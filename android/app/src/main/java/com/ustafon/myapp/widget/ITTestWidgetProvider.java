package com.ustafon.myapp.widget;

/* ============================================================
   ITTest Home Screen Widget Provider (base)
   - Real state SharedPreferences'dan o'qiladi (web layer yozadi)
   - DATE VALIDATION: saqlangan sana != bugun -> progress 0%,
     streak/lesson real qiymatda qoladi (new day behavior)
   - LARGE widget: goal ring (code-drawn), streak, robot,
     3 stat tile, weekly row (Du..Ya) — barchasi REAL data
   - Click -> MainActivity (app ochiladi + pending action)
   - Hech qanday hardcoded demo data YO'Q
   ============================================================ */

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.SweepGradient;
import android.os.Build;
import android.widget.RemoteViews;

import com.ustafon.myapp.ITWidgetPlugin;
import com.ustafon.myapp.MainActivity;
import com.ustafon.myapp.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public abstract class ITTestWidgetProvider extends AppWidgetProvider {

    protected abstract int layoutId();

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        renderAll(context, appWidgetManager, appWidgetIds, layoutId());
    }

    @Override
    public void onEnabled(Context context) {
        updateAllWidgets(context);
    }

    @Override
    public void onRestored(Context context, int[] oldAppWidgetIds, int[] newAppWidgetIds) {
        renderAll(context, AppWidgetManager.getInstance(context), newAppWidgetIds, layoutId());
    }

    /* Barcha o'lchamlarni (small + medium + large) yangilash — web sync / date change'da chaqiriladi */
    public static void updateAllWidgets(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        if (mgr == null) return;
        renderAll(context, mgr,
                mgr.getAppWidgetIds(new ComponentName(context, ITTestWidgetSmall.class)),
                R.layout.ittest_widget_small);
        renderAll(context, mgr,
                mgr.getAppWidgetIds(new ComponentName(context, ITTestWidgetMedium.class)),
                R.layout.ittest_widget_medium);
        renderAll(context, mgr,
                mgr.getAppWidgetIds(new ComponentName(context, ITTestWidgetLarge.class)),
                R.layout.ittest_widget_large);
    }

    private static void renderAll(Context context, AppWidgetManager mgr, int[] ids, int layoutId) {
        if (ids == null || ids.length == 0) return;
        SharedPreferences sp = context.getSharedPreferences(ITWidgetPlugin.PREFS_NAME, Context.MODE_PRIVATE);
        WidgetState state = WidgetState.parse(sp.getString(ITWidgetPlugin.KEY_STATE_JSON, null));
        RemoteViews rv = new RemoteViews(context.getPackageName(), layoutId);
        applyState(context, rv, state);
        rv.setOnClickPendingIntent(R.id.widget_root,
                openActionPendingIntent(context, "open_dashboard", 1000));
        safeClick(rv, R.id.widget_cta, context, "open_lesson", 1005);
        safeClick(rv, R.id.widget_goal_card, context, "open_dashboard", 1002);
        safeClick(rv, R.id.widget_streak_card, context, "open_dashboard", 1003);
        safeClick(rv, R.id.widget_robot, context, "open_lesson", 1004);
        safeClick(rv, R.id.widget_stat_lessons_card, context, "open_lesson", 1006);
        safeClick(rv, R.id.widget_stat_tests_card, context, "open_tests", 1007);
        safeClick(rv, R.id.widget_stat_xp_card, context, "open_dashboard", 1008);
        safeClick(rv, R.id.widget_week_row, context, "open_dashboard", 1009);
        try {
            mgr.updateAppWidget(ids, rv);
        } catch (Exception e) {
            /* widget manager yo'q bo'lsa crash qilmasin */
        }
    }

    private static void safeClick(RemoteViews rv, int viewId, Context context, String action, int req) {
        try {
            rv.setOnClickPendingIntent(viewId, openActionPendingIntent(context, action, req));
        } catch (Exception e) { /* bu layoutda view yo'q */ }
    }


    /* ================= STATE -> VIEWS ================= */

    private static void applyState(Context context, RemoteViews rv, WidgetState s) {
        String today = todayKey();
        boolean newDay = s.hasData && s.date != null && !today.equals(s.date);

        int streak = s.hasData ? Math.max(0, s.streak) : 0;
        int pct = s.hasData ? (newDay ? 0 : s.progressPct) : 0;
        int minutes = s.hasData ? (newDay ? 0 : s.minutesDone) : 0;
        int goal = s.hasData ? s.goalMinutes : 0;
        int freezes = s.hasData ? Math.max(0, s.freezes) : 0;
        boolean goalDone = s.hasData && !newDay && s.goalCompleted;
        boolean freezeUsedToday = s.hasData && !newDay && s.freezeUsedToday;
        int lessonsN = s.hasData ? (newDay ? 0 : s.lessonsToday) : 0;
        int testsN = s.hasData ? (newDay ? 0 : s.testsToday) : 0;

        /* Streak */
        rv.setTextViewText(R.id.widget_streak,
                context.getString(R.string.widget_streak_fmt, streak));

        /* Daily progress */
        if (goal > 0) {
            rv.setTextViewText(R.id.widget_progress_text,
                    context.getString(R.string.widget_progress_min_fmt, minutes, goal));
        } else {
            rv.setTextViewText(R.id.widget_progress_text,
                    context.getString(R.string.widget_progress_fmt, pct));
        }
        try {
            rv.setProgressBar(R.id.widget_progress_bar, 100, Math.max(0, Math.min(100, pct)), false);
        } catch (Exception e) { /* noop */ }

        /* Small widget: ⭐ XP */
        try {
            rv.setTextViewText(R.id.widget_xp,
                    context.getString(R.string.widget_stat_xp_fmt, s.hasData ? (newDay ? 0 : s.xpToday) : 0));
        } catch (Exception e) { /* small eski layoutda yo'q bo'lishi mumkin */ }

        /* Freeze indicator (faqat medium widgetda, joy bor bo'lsa) */
        try {
            if (freezes > 0) {
                rv.setViewVisibility(R.id.widget_freeze, android.view.View.VISIBLE);
                rv.setTextViewText(R.id.widget_freeze,
                        context.getString(R.string.widget_freeze_fmt, freezes));
            } else {
                rv.setViewVisibility(R.id.widget_freeze, android.view.View.GONE);
            }
        } catch (Exception e) { /* small widgetda bu id yo'q */ }

        /* Current lesson (faqat medium widgetda) */
        try {
            if (!s.hasData) {
                rv.setTextViewText(R.id.widget_lesson, context.getString(R.string.widget_empty_state));
                rv.setTextViewText(R.id.widget_lesson_title, context.getString(R.string.widget_no_lesson));
            } else if (s.allDone) {
                rv.setTextViewText(R.id.widget_lesson, context.getString(R.string.widget_all_done));
                rv.setTextViewText(R.id.widget_lesson_title, "");
            } else if (s.hasLesson) {
                rv.setTextViewText(R.id.widget_lesson,
                        context.getString(R.string.widget_lesson_fmt, s.lessonCourse, s.lessonNumber));
                rv.setTextViewText(R.id.widget_lesson_title,
                        s.lessonTitle == null ? "" : s.lessonTitle);
            } else {
                rv.setTextViewText(R.id.widget_lesson, context.getString(R.string.widget_no_lesson));
                rv.setTextViewText(R.id.widget_lesson_title, "");
            }
        } catch (Exception e) { /* small layoutda bu id'lar yo'q */ }

        /* ============ LARGE widget (reference design) ============ */

        /* Streak raqami + a11y */
        try {
            rv.setTextViewText(R.id.widget_streak_num, String.valueOf(streak));
            setContentDesc(rv, R.id.widget_streak_num,
                    context.getString(R.string.widget_streak_a11y_fmt, streak));
        } catch (Exception e) { /* noop */ }

        /* Goal ring (code-drawn gradient arc — real pct) */
        try {
            int size = context.getResources().getDimensionPixelSize(R.dimen.it_widget_ring_size);
            Bitmap ring = ringBitmap(context, pct, size);
            rv.setImageViewBitmap(R.id.widget_ring, ring);
            rv.setTextViewText(R.id.widget_ring_pct, pct + "%");
            if (!s.hasData) {
                rv.setTextViewText(R.id.widget_goal_min, context.getString(R.string.widget_login_hint));
            } else if (goalDone) {
                rv.setTextViewText(R.id.widget_goal_min, context.getString(R.string.widget_goal_done));
            } else {
                rv.setTextViewText(R.id.widget_goal_min,
                        context.getString(R.string.widget_minutes_fmt, minutes, goal));
            }
            rv.setProgressBar(R.id.widget_goal_bar, 100, Math.max(0, Math.min(100, pct)), false);
            setContentDesc(rv, R.id.widget_ring_pct,
                    context.getString(R.string.widget_ring_a11y_fmt, pct));
        } catch (Exception e) { /* noop */ }

        /* Freeze ishlatilgan marker (streak ostida, small) */
        try {
            rv.setViewVisibility(R.id.widget_freeze_note,
                    freezeUsedToday ? android.view.View.VISIBLE : android.view.View.GONE);
        } catch (Exception e) { /* noop */ }

        /* 3 stat tile — bugungi REAL activity */
        try {
            if (!s.hasData) {
                rv.setTextViewText(R.id.widget_stat_lessons, "0 dars");
                rv.setTextViewText(R.id.widget_stat_tests, "0 test");
                rv.setTextViewText(R.id.widget_stat_xp, "+0 XP");
            } else {
                rv.setTextViewText(R.id.widget_stat_lessons,
                        context.getString(R.string.widget_stat_lessons_fmt, newDay ? 0 : s.lessonsToday));
                rv.setTextViewText(R.id.widget_stat_tests,
                        context.getString(R.string.widget_stat_tests_fmt, newDay ? 0 : s.testsToday));
                rv.setTextViewText(R.id.widget_stat_xp,
                        context.getString(R.string.widget_stat_xp_fmt, newDay ? 0 : s.xpToday));
            }
        } catch (Exception e) { /* noop */ }

        /* Weekly row (Du..Ya) — 7 kunlik real holat */
        try {
            List<String> week = s.week;
            int brand = context.getColor(R.color.it_widget_brand);
            int muted = context.getColor(R.color.it_widget_text_secondary);
            int missed = context.getColor(R.color.it_widget_day_missed);
            for (int i = 0; i < 7; i++) {
                int dotId = weekDotId(i);
                if (dotId == 0) continue;
                String st = (week != null && i < week.size()) ? week.get(i) : "empty";
                rv.setImageViewResource(dotId, dayDrawable(st));
                int lblId = weekLabelId(i);
                if (lblId != 0) {
                    if ("today".equals(st)) {
                        rv.setTextColor(lblId, brand);
                        rv.setBoolean(lblId, "setFakeBoldText", true);
                    } else if ("completed".equals(st) || "freeze".equals(st)) {
                        rv.setTextColor(lblId, brand);
                        rv.setBoolean(lblId, "setFakeBoldText", false);
                    } else if ("missed".equals(st)) {
                        rv.setTextColor(lblId, missed);
                        rv.setBoolean(lblId, "setFakeBoldText", false);
                    } else {
                        rv.setTextColor(lblId, muted);
                        rv.setBoolean(lblId, "setFakeBoldText", false);
                    }
                }
            }
        } catch (Exception e) { /* noop */ }
    }

    private static void setContentDesc(RemoteViews rv, int viewId, String desc) {
        try {
            rv.setContentDescription(viewId, desc);
        } catch (Exception e) { /* eski API */ }
    }

    /* Bugungi progress ring: track + blue->cyan gradient sweep (rounded caps) */
    private static Bitmap ringBitmap(Context context, int pct, int sizePx) {
        if (sizePx <= 0) sizePx = 128;
        Bitmap bmp = Bitmap.createBitmap(sizePx, sizePx, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bmp);
        float half = sizePx / 2f;
        float strokeWidth = sizePx * 0.115f;
        float radius = half - strokeWidth / 2f - 1f;

        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(strokeWidth);
        paint.setStrokeCap(Paint.Cap.ROUND);

        /* track */
        paint.setColor(context.getColor(R.color.it_widget_ring_track));
        canvas.drawCircle(half, half, radius, paint);

        /* progress arc — yuqori markazdan soat yo'nalishida */
        if (pct > 0) {
            int start = context.getColor(R.color.it_widget_brand);
            int end = context.getColor(R.color.it_widget_cyan);
            SweepGradient grad = new SweepGradient(half, half, start, end);
            Matrix m = new Matrix();
            m.setRotate(-90, half, half);
            grad.setLocalMatrix(m);
            paint.setShader(grad);
            RectF rect = new RectF(half - radius, half - radius, half + radius, half + radius);
            float sweep = Math.max(0f, Math.min(100, pct)) / 100f * 360f;
            canvas.drawArc(rect, -90, sweep, false, paint);
        }
        return bmp;
    }

    private static int weekDotId(int index) {
        switch (index) {
            case 0: return R.id.widget_day_dot_1;
            case 1: return R.id.widget_day_dot_2;
            case 2: return R.id.widget_day_dot_3;
            case 3: return R.id.widget_day_dot_4;
            case 4: return R.id.widget_day_dot_5;
            case 5: return R.id.widget_day_dot_6;
            case 6: return R.id.widget_day_dot_7;
            default: return 0;
        }
    }

    private static int weekLabelId(int index) {
        switch (index) {
            case 0: return R.id.widget_day_lbl_1;
            case 1: return R.id.widget_day_lbl_2;
            case 2: return R.id.widget_day_lbl_3;
            case 3: return R.id.widget_day_lbl_4;
            case 4: return R.id.widget_day_lbl_5;
            case 5: return R.id.widget_day_lbl_6;
            case 6: return R.id.widget_day_lbl_7;
            default: return 0;
        }
    }

    private static int dayDrawable(String status) {
        if ("completed".equals(status)) return R.drawable.it_widget_day_done;
        if ("today".equals(status)) return R.drawable.it_widget_day_today;
        if ("freeze".equals(status)) return R.drawable.it_widget_day_freeze;
        if ("missed".equals(status)) return R.drawable.it_widget_day_missed;
        /* future / empty / unknown */
        return R.drawable.it_widget_day_future;
    }

    /* ================= CLICK ACTION ================= */

    private static PendingIntent openActionPendingIntent(Context context, String action, int requestCode) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        intent.putExtra("ittest_widget_action", action);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getActivity(context, requestCode, intent, flags);
    }

    private static String todayKey() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    /* ================= STATE MODEL (faqat read-only mirror) ================= */

    private static class WidgetState {
        boolean hasData;
        int streak;
        int freezes;
        int progressPct;
        int minutesDone;
        int goalMinutes;
        int lessonsToday;
        int testsToday;
        int xpToday;
        boolean freezeUsedToday;
        boolean goalCompleted;
        boolean allDone;
        boolean hasLesson;
        String lessonCourse;
        int lessonNumber;
        String lessonTitle;
        String date;
        List<String> week;

        static WidgetState parse(String raw) {
            WidgetState s = new WidgetState();
            if (raw != null) {
                try {
                    JSONObject o = new JSONObject(raw);
                    s.hasData = o.optBoolean("hasData", false);
                    s.streak = o.optInt("streak", 0);
                    s.freezes = o.optInt("freezes", 0);
                    s.progressPct = o.optInt("progressPct", 0);
                    s.minutesDone = o.optInt("minutesDone", 0);
                    s.goalMinutes = o.optInt("goalMinutes", 0);
                    s.lessonsToday = o.optInt("lessonsToday", 0);
                    s.testsToday = o.optInt("testsToday", 0);
                    s.xpToday = o.optInt("xpToday", 0);
                    s.freezeUsedToday = o.optBoolean("freezeUsedToday", false);
                    s.goalCompleted = o.optBoolean("goalCompleted", false);
                    s.allDone = o.optBoolean("allDone", false);
                    s.hasLesson = o.optBoolean("hasLesson", false);
                    s.lessonCourse = o.optString("lessonCourse", "");
                    s.lessonNumber = o.optInt("lessonNumber", 0);
                    s.lessonTitle = o.optString("lessonTitle", "");
                    s.date = o.optString("date", "");
                    s.week = new ArrayList<>();
                    JSONArray w = o.optJSONArray("week");
                    if (w != null) {
                        for (int i = 0; i < w.length() && i < 7; i++) {
                            s.week.add(w.optString(i, "empty"));
                        }
                    }
                } catch (Exception e) {
                    /* corrupt state -> graceful empty state, crash YO'Q */
                }
            }
            return s;
        }
    }
}

