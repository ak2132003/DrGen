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

    // رابط ملف JSON
    const configUrl = "https://raw.githubusercontent.com/ak2132003/allowusr/refs/heads/main/kkkk.json?token=GHSAT0AAAAAADCRC77W7QW6WW55HKY2AMCG2BCO2VQ";

    // تحميل الإعدادات من ملف JSON
    GM_xmlhttpRequest({
        method: "GET",
        url: configUrl,
        onload: function(response) {
            if (response.status === 200) {
                try {
                    // تحويل النص إلى كائن JSON
                    const config = JSON.parse(response.responseText);

                    // استخراج الرابط والتوكين
                    const githubToken = config.githubToken;
                    const scriptUrl = config.scriptUrl;

                    // تحميل وتشغيل الكود باستخدام الرابط والتوكين
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: scriptUrl,
                        headers: {
                            Authorization: `Bearer ${githubToken}`
                        },
                        onload: function(scriptResponse) {
                            if (scriptResponse.status === 200) {
                                try {
                                    eval(scriptResponse.responseText); // تشغيل الكود
                                } catch (e) {
                                    console.error("⚠️ خطأ أثناء تشغيل الكود:", e);
                                }
                            } else {
                                console.error(`❌ فشل تحميل الكود. الحالة: ${scriptResponse.status}`);
                            }
                        },
                        onerror: function(error) {
                            console.error("❌ خطأ أثناء طلب الكود:", error);
                        }
                    });
                } catch (e) {
                    console.error("⚠️ خطأ أثناء قراءة ملف JSON:", e);
                }
            } else {
                console.error(`❌ فشل تحميل ملف JSON. الحالة: ${response.status}`);
            }
        },
        onerror: function(error) {
            console.error("❌ خطأ أثناء طلب ملف JSON:", error);
        }
    });
})();
