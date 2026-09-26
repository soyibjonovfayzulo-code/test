package com.ustafon.myapp;

import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class DynamicIconManager {

    private static final String TAG = "DynamicIconManager";
    public static final String PREFS_NAME = "orzutalim_launcher_prefs";
    public static final String KEY_LAST_OPENED_AT = "lastOpenedAt";
    public static final String KEY_CURRENT_STATE = "current_state";
    public static final String KEY_PREVIOUS_INACTIVITY_STATE = "previous_inactivity_state";

    public static final String STATE_ACTIVE = "active";
    public static final String STATE_SLEEPING = "sleeping";
    public static final String STATE_MISSING = "missing";
    public static final String STATE_ANGRY = "angry";
    public static final String STATE_WELCOME = "welcome";

    private static final Map<String, String> ALIAS_MAP = new HashMap<>();
    static {
        ALIAS_MAP.put(STATE_ACTIVE, "com.ustafon.myapp.OrzuTalimActive");
        ALIAS_MAP.put(STATE_SLEEPING, "com.ustafon.myapp.OrzuTalimSleeping");
        ALIAS_MAP.put(STATE_MISSING, "com.ustafon.myapp.OrzuTalimMissing");
        ALIAS_MAP.put(STATE_ANGRY, "com.ustafon.myapp.OrzuTalimAngry");
        ALIAS_MAP.put(STATE_WELCOME, "com.ustafon.myapp.OrzuTalimWelcome");
    }

    public static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public static String calculateStateFromTimestamp(long lastOpenedAtMs) {
        if (lastOpenedAtMs <= 0) return STATE_ACTIVE;
        long now = System.currentTimeMillis();
        long diffMs = Math.max(0, now - lastOpenedAtMs);
        double daysInactive = diffMs / (1000.0 * 60.0 * 60.0 * 24.0);

        if (daysInactive < 2.0) {
            return STATE_ACTIVE;
        } else if (daysInactive >= 2.0 && daysInactive < 3.0) {
            return STATE_SLEEPING;
        } else if (daysInactive >= 3.0 && daysInactive < 7.0) {
            return STATE_MISSING;
        } else {
            return STATE_ANGRY;
        }
    }

    public static synchronized boolean setLauncherIcon(Context context, String targetState) {
        if (context == null || targetState == null) return false;
        String targetAlias = ALIAS_MAP.get(targetState);
        if (targetAlias == null) {
            targetState = STATE_ACTIVE;
            targetAlias = ALIAS_MAP.get(STATE_ACTIVE);
        }

        SharedPreferences prefs = getPrefs(context);
        String currentState = prefs.getString(KEY_CURRENT_STATE, STATE_ACTIVE);

        // Avoid duplicate switching if current state already matches
        if (targetState.equals(currentState)) {
            Log.d(TAG, "Already in state: " + targetState + " — skipping duplicate component switch.");
            return true;
        }

        try {
            PackageManager pm = context.getPackageManager();

            // Disable all other 4 aliases first
            for (Map.Entry<String, String> entry : ALIAS_MAP.entrySet()) {
                String state = entry.getKey();
                String aliasName = entry.getValue();
                if (!state.equals(targetState)) {
                    ComponentName comp = new ComponentName(context.getPackageName(), aliasName);
                    if (pm.getComponentEnabledSetting(comp) != PackageManager.COMPONENT_ENABLED_STATE_DISABLED) {
                        pm.setComponentEnabledSetting(
                                comp,
                                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                                PackageManager.DONT_KILL_APP
                        );
                    }
                }
            }

            // Enable target alias
            ComponentName targetComp = new ComponentName(context.getPackageName(), targetAlias);
            pm.setComponentEnabledSetting(
                    targetComp,
                    PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                    PackageManager.DONT_KILL_APP
            );

            prefs.edit().putString(KEY_CURRENT_STATE, targetState).apply();
            Log.i(TAG, "Successfully switched launcher icon state to: " + targetState);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Error switching launcher icon state to: " + targetState, e);
            // Fallback to active state if switching failed
            try {
                prefs.edit().putString(KEY_CURRENT_STATE, STATE_ACTIVE).apply();
            } catch (Exception ignored) {}
            return false;
        }
    }

    /**
     * Called whenever app is opened by user.
     * Evaluates prior inactivity state, handles WELCOME flow if needed, updates lastOpenedAt timestamp.
     */
    public static synchronized Map<String, Object> onAppLaunched(Context context) {
        Map<String, Object> result = new HashMap<>();
        if (context == null) return result;

        SharedPreferences prefs = getPrefs(context);
        long lastOpenedAt = prefs.getLong(KEY_LAST_OPENED_AT, 0L);
        long now = System.currentTimeMillis();

        String prevInactivityState = calculateStateFromTimestamp(lastOpenedAt);
        boolean isReturnFromInactivity = (STATE_SLEEPING.equals(prevInactivityState) ||
                STATE_MISSING.equals(prevInactivityState) ||
                STATE_ANGRY.equals(prevInactivityState));

        result.put("previousState", prevInactivityState);
        result.put("isReturnFromInactivity", isReturnFromInactivity);

        // Store previous inactivity state for UI greeting
        prefs.edit()
                .putString(KEY_PREVIOUS_INACTIVITY_STATE, prevInactivityState)
                .putLong(KEY_LAST_OPENED_AT, now)
                .apply();

        if (isReturnFromInactivity) {
            // 1. Temporarily enable WELCOME icon state
            setLauncherIcon(context, STATE_WELCOME);
            result.put("currentState", STATE_WELCOME);
        } else {
            // Normal launch -> active icon
            setLauncherIcon(context, STATE_ACTIVE);
            result.put("currentState", STATE_ACTIVE);
        }

        // Schedule background worker
        scheduleBackgroundWorker(context);

        return result;
    }

    /**
     * Called by background worker or app sync to verify and update icon based on inactivity elapsed days.
     */
    public static synchronized void checkAndSync(Context context) {
        if (context == null) return;
        SharedPreferences prefs = getPrefs(context);
        long lastOpenedAt = prefs.getLong(KEY_LAST_OPENED_AT, System.currentTimeMillis());
        String targetState = calculateStateFromTimestamp(lastOpenedAt);

        String currentState = prefs.getString(KEY_CURRENT_STATE, STATE_ACTIVE);
        // Do not overwrite WELCOME if user is currently in active app session, unless state changed
        if (!targetState.equals(currentState)) {
            setLauncherIcon(context, targetState);
        }
    }

    public static void scheduleBackgroundWorker(Context context) {
        try {
            PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(
                    IconCheckWorker.class,
                    1, TimeUnit.HOURS
            ).build();

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                    "OrzuTalimIconCheckWorker",
                    ExistingPeriodicWorkPolicy.KEEP,
                    workRequest
            );
            Log.d(TAG, "Background IconCheckWorker scheduled.");
        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule IconCheckWorker", e);
        }
    }
}
