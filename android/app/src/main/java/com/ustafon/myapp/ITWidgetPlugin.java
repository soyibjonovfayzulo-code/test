package com.ustafon.myapp;

/* ============================================================
   ITWidgetPlugin — Capacitor <-> Android Widget Bridge
   ITTest web state (source of truth) -> SharedPreferences
   -> Home Screen Widget (ITTestWidgetProvider).
   No parallel/fake state is created here: this plugin ONLY
   persists what the web layer (widget-sync.js) sends.
   ============================================================ */

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.ustafon.myapp.widget.ITTestWidgetProvider;

@CapacitorPlugin(name = "ITWidget")
public class ITWidgetPlugin extends Plugin {

    public static final String PREFS_NAME = "ittest_widget_state";
    public static final String KEY_STATE_JSON = "state_json";
    public static final String KEY_UPDATED_AT = "updated_at";
    public static final String KEY_PENDING_ACTION = "pending_action";

    /** Web layer real state yuboradi -> persist -> widgetni yangilash */
    @PluginMethod
    public void updateWidget(PluginCall call) {
        JSObject state = call.getObject("state");
        if (state == null) {
            call.reject("state is required");
            return;
        }
        Context ctx = getContext();
        SharedPreferences.Editor ed = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit();
        ed.putString(KEY_STATE_JSON, state.toString());
        ed.putLong(KEY_UPDATED_AT, System.currentTimeMillis());
        ed.apply();

        ITTestWidgetProvider.updateAllWidgets(ctx);

        JSObject ret = new JSObject();
        ret.put("ok", true);
        call.resolve(ret);
    }

    /** Widget clickdan keyin app ichida navigate qilish uchun saqlangan action */
    @PluginMethod
    public void getPendingAction(PluginCall call) {
        String action = getContext()
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getString(KEY_PENDING_ACTION, "");
        JSObject ret = new JSObject();
        ret.put("action", action == null ? "" : action);
        call.resolve(ret);
    }

    /** Action o'qilgach tozalash (bir martalik ishlashi uchun) */
    @PluginMethod
    public void clearPendingAction(PluginCall call) {
        Context ctx = getContext();
        ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit().remove(KEY_PENDING_ACTION).apply();
        JSObject ret = new JSObject();
        ret.put("ok", true);
        call.resolve(ret);
    }

    /** MainActivity widget click Intent'ini shu yerda ushlaydi */
    public static void handleWidgetIntent(Context ctx, Intent intent) {
        if (ctx == null || intent == null) return;
        String action = intent.getStringExtra("ittest_widget_action");
        if (action != null && !action.isEmpty()) {
            ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                    .edit().putString(KEY_PENDING_ACTION, action).apply();
        }
    }
}
