package com.ustafon.myapp;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class IconCheckWorker extends Worker {

    private static final String TAG = "IconCheckWorker";

    public IconCheckWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            Log.d(TAG, "Executing periodic background launcher icon check...");
            DynamicIconManager.checkAndSync(getApplicationContext());
            return Result.success();
        } catch (Exception e) {
            Log.e(TAG, "Error in IconCheckWorker doWork", e);
            return Result.retry();
        }
    }
}
