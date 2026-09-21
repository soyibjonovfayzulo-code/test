package com.ustafon.myapp;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        /* ITTest widget bridge plugin (real daily/streak state -> widget) */
        registerPlugin(ITWidgetPlugin.class);
        ITWidgetPlugin.handleWidgetIntent(this, getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        ITWidgetPlugin.handleWidgetIntent(this, intent);
    }
}

