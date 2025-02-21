package com.mystreetpets.androidapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.web)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // Enable debugging
        WebView.setWebContentsDebuggingEnabled(true)

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                println("WebView Loaded: $url")
            }

            override fun onReceivedError(
                view: WebView?, request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                println("WebView Error: ${error?.description}")
            }
        }

        webView.loadUrl("https://main.deealfgqu77r6.amplifyapp.com")
    }
}
