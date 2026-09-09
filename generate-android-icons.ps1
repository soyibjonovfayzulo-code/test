Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\USTAFON\Desktop\aaaayti\public\mascot\app-icon.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source image loaded: $($srcBmp.Width)x$($srcBmp.Height)"

$resDir = "c:\Users\USTAFON\Desktop\aaaayti\android\app\src\main\res"

$densities = @(
    @{ Name = "mipmap-mdpi"; LegacySize = 48; ForeSize = 108 },
    @{ Name = "mipmap-hdpi"; LegacySize = 72; ForeSize = 162 },
    @{ Name = "mipmap-xhdpi"; LegacySize = 96; ForeSize = 216 },
    @{ Name = "mipmap-xxhdpi"; LegacySize = 144; ForeSize = 324 },
    @{ Name = "mipmap-xxxhdpi"; LegacySize = 192; ForeSize = 432 }
)

function Create-LauncherIcon([int]$size, [string]$type) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $g.Clear([System.Drawing.Color]::Transparent)

    if ($type -eq "round") {
        # Clip to circle with dark background
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $size, $size)
        $g.SetClip($path)

        # Fill background
        $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#060814"))
        $g.FillPath($bgBrush, $path)
        $bgBrush.Dispose()

        # Draw scaled image inside circle so nothing essential is cropped
        # Zoom slightly to fill circle well while keeping robot and text in view
        $scale = 1.06
        $drawW = [int]($size * $scale)
        $drawH = [int]($size * $scale)
        $drawX = [int](($size - $drawW) / 2)
        $drawY = [int](($size - $drawH) / 2)

        $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
        $g.DrawImage($srcBmp, $destRect, 0, 0, $srcBmp.Width, $srcBmp.Height, [System.Drawing.GraphicsUnit]::Pixel)

        $path.Dispose()
    } else {
        # Full square/squircle icon - draw the entire image with high fidelity
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
        $g.DrawImage($srcBmp, $destRect, 0, 0, $srcBmp.Width, $srcBmp.Height, [System.Drawing.GraphicsUnit]::Pixel)
    }

    $g.Dispose()
    return $bmp
}

function Create-AdaptiveForeground([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $g.Clear([System.Drawing.Color]::Transparent)

    # In Android Adaptive Icon, safe zone is inner ~70% of 108dp canvas
    $innerSize = [int]($size * 0.72)
    $destX = [int](($size - $innerSize) / 2)
    $destY = [int](($size - $innerSize) / 2)

    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $innerSize, $innerSize)
    $g.DrawImage($srcBmp, $destRect, 0, 0, $srcBmp.Width, $srcBmp.Height, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()
    return $bmp
}

foreach ($d in $densities) {
    $targetDir = Join-Path $resDir $d.Name
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # 1. Legacy icon
    $legacyIcon = Create-LauncherIcon $d.LegacySize "normal"
    $legacyPath = Join-Path $targetDir "ic_launcher.png"
    $legacyIcon.Save($legacyPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $legacyIcon.Dispose()

    # 2. Round icon
    $roundIcon = Create-LauncherIcon $d.LegacySize "round"
    $roundPath = Join-Path $targetDir "ic_launcher_round.png"
    $roundIcon.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $roundIcon.Dispose()

    # 3. Adaptive Foreground
    $foreIcon = Create-AdaptiveForeground $d.ForeSize
    $forePath = Join-Path $targetDir "ic_launcher_foreground.png"
    $foreIcon.Save($forePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $foreIcon.Dispose()

    Write-Host "Generated icons for $($d.Name) (Legacy: $($d.LegacySize)x$($d.LegacySize), Fore: $($d.ForeSize)x$($d.ForeSize))"
}

# 4. Hi-res 512x512 Play Store icon
$webIcon = Create-LauncherIcon 512 "normal"
$webIconPath = "c:\Users\USTAFON\Desktop\aaaayti\android\app\src\main\ic_launcher-web.png"
$webIcon.Save($webIconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$webIcon.Dispose()
Write-Host "Generated Play Store hi-res icon: 512x512"

$srcBmp.Dispose()
Write-Host "SUCCESS: All Android launcher icons updated with the user-provided icon!"
