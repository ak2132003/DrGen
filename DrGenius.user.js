// ==UserScript==
// @name         🏆 DR VIP by Ahmed Khaled
// @namespace    https://www.facebook.com/Dr.Ahmed.FamilyFarm
// @version      5.2
// @description  نظام متكامل لكل المهمات
// @author       د.أحمد خالد 👑
// @match        *://*.centurygames.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://github.com/ak2132003/DrGen/raw/refs/heads/main/DrGenius.user.js
// @updateURL    https://github.com/ak2132003/DrGen/raw/refs/heads/main/DrGenius.user.js
// @downloadURL  https://github.com/ak2132003/DrGen/raw/refs/heads/main/DrGenius.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ============== الإعدادات ==============
    const scriptUrl = "https://raw.githubusercontent.com/ak2132003/Drjson/refs/heads/main/DrGenius.json"; // رابط GitHub Raw
    const githubToken = "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"; // ضع التوكن هنا مباشرة

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
