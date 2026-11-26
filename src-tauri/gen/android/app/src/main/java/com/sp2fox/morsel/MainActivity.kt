package com.sp2fox.morsel

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import android.view.View
import android.view.WindowManager

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
    }
}
