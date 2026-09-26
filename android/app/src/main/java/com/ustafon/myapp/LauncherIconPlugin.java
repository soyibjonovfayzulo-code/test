package com.ustafon.myapp;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Map;

@CapacitorPlugin(name = "LauncherIcon")
public class LauncherIconPlugin extends Plugin {

    @PluginMethod
    public void setLauncherIcon(PluginCall call) {
        String state = call.getString("icon", DynamicIconManager.STATE_ACTIVE);
        boolean success = DynamicIconManager.setLauncherIcon(getContext(), state);
        JSObject ret = new JSObject();
        ret.put("ok", success);
        ret.put("icon", state);
        call.resolve(ret);
    }

    @PluginMethod
    public void getLauncherIcon(PluginCall call) {
        Context ctx = getContext();
        SharedPreferences prefs = DynamicIconManager.getPrefs(ctx);
        String currentState = prefs.getString(DynamicIconManager.KEY_CURRENT_STATE, DynamicIconManager.STATE_ACTIVE);
        long lastOpenedAt = prefs.getLong(DynamicIconManager.KEY_LAST_OPENED_AT, System.currentTimeMillis());

        JSObject ret = new JSObject();
        ret.put("icon", currentState);
        ret.put("lastOpenedAt", lastOpenedAt);
        ret.put("daysInactive", (System.currentTimeMillis() - lastOpenedAt) / (1000.0 * 60.0 * 60.0 * 24.0));
        call.resolve(ret);
    }

    @PluginMethod
    public void updateLastOpenedAt(PluginCall call) {
        Double tsDouble = call.getDouble("timestamp");
        long ts = tsDouble != null ? tsDouble.longValue() : System.currentTimeMillis();

        Context ctx = getContext();
        DynamicIconManager.getPrefs(ctx).edit()
                .putLong(DynamicIconManager.KEY_LAST_OPENED_AT, ts)
                .apply();

        DynamicIconManager.checkAndSync(ctx);

        JSObject ret = new JSObject();
        ret.put("ok", true);
        ret.put("lastOpenedAt", ts);
        call.resolve(ret);
    }

    @PluginMethod
    public void onAppLaunch(PluginCall call) {
        Map<String, Object> launchResult = DynamicIconManager.onAppLaunched(getContext());
        JSObject ret = new JSObject();
        ret.put("ok", true);
        ret.put("previousState", launchResult.get("previousState"));
        ret.put("isReturnFromInactivity", launchResult.get("isReturnFromInactivity"));
        ret.put("currentState", launchResult.get("currentState"));
        call.resolve(ret);
    }

    @PluginMethod
    public void resetToActive(PluginCall call) {
        Context ctx = getContext();
        DynamicIconManager.getPrefs(ctx).edit()
                .putLong(DynamicIconManager.KEY_LAST_OPENED_AT, System.currentTimeMillis())
                .apply();

        boolean success = DynamicIconManager.setLauncherIcon(ctx, DynamicIconManager.STATE_ACTIVE);

        JSObject ret = new JSObject();
        ret.put("ok", success);
        ret.put("icon", DynamicIconManager.STATE_ACTIVE);
        call.resolve(ret);
    }
}
