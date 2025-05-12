// ==UserScript==
// @name         🏆 الأدوات الذهبية - النسخة المحمية
// @namespace    https://github.com/ak2132003
// @version      5.2
// @description  نظام متكامل مع حماية متقدمة وإدارة مركزية مع دعم JSON
// @author       د.أحمد خالد 👑
// @match        *://*.centurygames.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://github.com/ak2132003/DrGen/raw/refs/heads/main/DrGenius.user.js
// @run-at       document-start
// @updateURL    https://github.com/ak2132003/DrGen/raw/refs/heads/main/DrGenius.user.js
// @downloadURL  https://github.com/ak2132003/DrGen/raw/refs/heads/main/DrGenius.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ============== الإعدادات ==============
    const githubToken = "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"; // التوكن الخاص بك
    const scriptUrl = "https://raw.githubusercontent.com/ak2132003/tok/main/tokDrGeniusLoader.user.js"; // رابط GitHub Raw

    // ============== تحميل وتشغيل الكود ==============
    GM_xmlhttpRequest({
        method: "GET",
        url: scriptUrl,
        headers: {
            Authorization: `Bearer ${githubToken}` // استخدام التوكن في الطلب
        },
        onload: function(response) {
            if (response.status === 200) {
                try {
                    eval(response.responseText); // تشغيل الكود المُحمَّل
                } catch (e) {
                    console.error("⚠️ خطأ أثناء تشغيل الكود:", e);
                }
            } else {
                console.error(`❌ فشل تحميل الكود. الحالة: ${response.status}`);
            }
        },
        onerror: function(error) {
            console.error("❌ خطأ أثناء طلب الكود:", error);
        }
    });
})();
