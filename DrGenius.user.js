// ==UserScript==
// @name         🏆 الأدوات الذهبية - النسخة المحمية
// @namespace    https://github.com/ak2132003
// @version      5.1
// @description  نظام متكامل مع حماية متقدمة وإدارة مركزية
// @author       د.أحمد خالد 👑
// @match        *://*.centurygames.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/ak2132003/DrGen/refs/heads/main/DrGenius
// @downloadURL  https://raw.githubusercontent.com/ak2132003/DrGen/refs/heads/main/DrGenius
// ==/UserScript==

/* ####################################################### */
/* ################# الإعدادات الرئيسية ################# */
/* ####################################################### */

const CONFIG = {
    // روابط الملفات على الخادم (الروابط التي قدمتها)
    CONFIG_URL: "https://raw.githubusercontent.com/ak2132003/allowconf/main/config.json",
    USERS_URL: "https://raw.githubusercontent.com/ak2132003/allowusr/main/users.json",

    // مفاتيح التشفير (يجب تغييرها)
    SECRET_KEY: "golden_tools_ahmed_khaled_2023_ak2132003",
    HASH_SALT: "ahmed@khaled_salt_2023_private",

    // إعدادات التحديث
    CHECK_INTERVAL: 30 * 60 * 1000, // كل 30 دقيقة
    CACHE_TIME: 5 * 60 * 1000       // تخزين مؤقت لمدة 5 دقائق
};

/* ####################################################### */
/* ############### النظام الأساسي ################ */
/* ####################################################### */

(function() {
    'use strict';

    // 🔒 فئة الحماية الأساسية
    class SecuritySystem {
        constructor() {
            this.scriptHash = "9f86d081884c7d659a2feaa0c55ad015";
            this.checkIntegrity();
        }

        checkIntegrity() {
            const currentHash = CryptoJS.MD5(document.currentScript.textContent).toString();
            if (currentHash !== this.scriptHash) {
                this.selfDestruct();
            }
        }

        selfDestruct() {
            unsafeWindow.goldenTools = null;
            document.body.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                background:#000;color:red;z-index:99999;padding:20%;text-align:center;
                font-family:Arial;font-size:24px;">
                    ⚠️ تم اكتشاف تلاعب غير مصرح به!<br>
                    الرجاء استخدام النسخة الأصلية من:<br>
                    https://github.com/ak2132003/golden-tools
                </div>
            `;
            throw new Error("Security breach detected");
        }
    }

    // 📡 فئة الاتصال بالخادم (معدلة للتعامل مع GitHub Private)
    class ServerConnection {
        static async fetchConfig() {
            try {
                const response = await this.apiRequest(CONFIG.CONFIG_URL);
                if (!response || response.message === "Not Found") {
                    throw new Error("Config file not found");
                }
                return response;
            } catch (e) {
                console.error("Failed to load config:", e);
                return {
                    enabled: false,
                    maintenance: true,
                    maintenanceMessage: "فشل تحميل إعدادات النظام"
                };
            }
        }

        static async fetchUsers() {
            try {
                const response = await this.apiRequest(CONFIG.USERS_URL);
                if (!response || response.message === "Not Found") {
                    throw new Error("Users file not found");
                }
                return response.allowedUsers || [];
            } catch (e) {
                console.error("Failed to load users list:", e);
                return [];
            }
        }

        static apiRequest(url) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'token GHSAT0AAAAAADCRC77XNNAU4YA22FCZ3EIW2BCHYTQ',
                        'X-Request-Signature': CryptoJS.SHA256(url + CONFIG.SECRET_KEY).toString()
                    },
                    onload: function(res) {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (res.status === 404 || data.message === "Not Found") {
                                resolve(null);
                            } else {
                                resolve(data);
                            }
                        }
                        catch { resolve(null); }
                    },
                    onerror: function() { resolve(null); }
                });
            });
        }
    }

    // 👤 فئة إدارة المستخدم
    class UserManager {
        constructor() {
            this.currentUser = {
                snsid: this.extractSNSID(),
                email: "",
                accessLevel: 0,
                lastAccess: new Date().toISOString()
            };
        }

        extractSNSID() {
            try {
                const doc = document.documentElement.outerHTML;
                const snsid = doc.match(/var snsid = "(\d+)"/)[1];
                if (!snsid) throw new Error("No SNSID found");
                return snsid;
            } catch (e) {
                console.error("Failed to extract SNSID:", e);
                return null;
            }
        }

        async verifyUser(usersList) {
            if (!this.currentUser.snsid) return false;

            const user = usersList.find(u => u.snsid === this.currentUser.snsid);
            if (user) {
                this.currentUser.email = user.email;
                this.currentUser.accessLevel = user.accessLevel;
                return true;
            }
            return false;
        }
    }

    // 🖥️ فئة واجهة المستخدم
    class GoldenUI {
        static showMaintenance(message) {
            const existing = document.getElementById('golden-maintenance');
            if (existing) existing.remove();

            document.body.insertAdjacentHTML('afterbegin', `
                <div id="golden-maintenance" style="position:fixed;top:0;left:0;width:100%;
                z-index:99999;background:linear-gradient(90deg,#FF4500,#FF6347);
                color:white;padding:15px;text-align:center;font-family:Tajawal;
                box-shadow:0 5px 15px rgba(0,0,0,0.5);font-weight:bold;">
                    ${message || "🛠️ النظام غير متاح حالياً"}
                </div>
            `);
        }

        static showMainUI(user) {
            const existing = document.getElementById('golden-tools-ui');
            if (existing) existing.remove();

            document.body.insertAdjacentHTML('beforeend', `
                <div id="golden-tools-ui" style="position:fixed;bottom:20px;right:20px;z-index:9998;">
                    <style>
                        .golden-btn {
                            background: linear-gradient(90deg,#D4AF37,#FFD700);
                            color: white;
                            padding: 12px 20px;
                            border-radius: 25px;
                            margin: 10px;
                            cursor: pointer;
                            font-weight: bold;
                            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.6);
                            text-align: center;
                            font-family: 'Tajawal', sans-serif;
                            transition: all 0.3s;
                        }
                        .golden-btn:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 8px 20px rgba(212, 175, 55, 0.8);
                        }
                    </style>
                    <div class="golden-btn">👑 أدوات د.أحمد</div>
                </div>
            `);
        }
    }

    // 🚀 النظام الرئيسي
    class GoldenToolsSystem {
        static async init() {
            // 1. تشغيل نظام الحماية
            new SecuritySystem();

            // 2. جلب الإعدادات والمستخدمين
            const [config, users] = await Promise.all([
                ServerConnection.fetchConfig(),
                ServerConnection.fetchUsers()
            ]);

            // 3. التحقق من حالة النظام
            if (!config.enabled || config.maintenance) {
                return GoldenUI.showMaintenance(config.maintenanceMessage);
            }

            // 4. التحقق من المستخدم
            const userManager = new UserManager();
            const isAuthorized = await userManager.verifyUser(users);

            if (!isAuthorized) {
                return GoldenUI.showMaintenance("غير مصرح لك بالدخول");
            }

            // 5. إذا كل شيء صحيح - تشغيل الواجهة
            GoldenUI.showMainUI(userManager.currentUser);

            // 6. جدولة التحديث التلقائي
            setInterval(() => this.checkForUpdates(), CONFIG.CHECK_INTERVAL);
        }

        static async checkForUpdates() {
            const config = await ServerConnection.fetchConfig();
            if (config.requiredVersion && config.requiredVersion !== GM_info.script.version) {
                if (confirm("يتوفر تحديث جديد، هل تريد التحديث الآن؟")) {
                    window.open(config.updateUrl, '_blank');
                }
            }
        }
    }

    // بدء التشغيل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GoldenToolsSystem.init());
    } else {
        setTimeout(() => GoldenToolsSystem.init(), 1000);
    }
})();

(function () {
    'use strict';

    // ============== إعدادات التصميم الفاخرة ==============
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes glow { 0% { box-shadow: 0 0 10px rgba(255,215,0,0.7); } 50% { box-shadow: 0 0 20px rgba(255,215,0,0.9); } 100% { box-shadow: 0 0 10px rgba(255,215,0,0.7); } }

        /* زر الأدوات الرئيسي - تصميم ذهبي */
        .golden-toggle {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 70px;
            height: 70px;
            border-radius: 50%;
background: url('https://drahmedkhaled.neocities.org/%E2%80%94Pngtree%E2%80%94golden%20crown%20vector%20design_5415535-Photoroom.png') no-repeat center;
    background-size: contain;
    background-color: rgba(0, 0, 0, 0.6);            font-size: 34px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
            transition: all 0.3s ease;
            border: 3px solid #fff;
            font-family: 'Tajawal', sans-serif;
            animation: pulse 2s infinite, glow 3s infinite;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }
        .golden-toggle:hover {
            transform: scale(1.15) rotate(15deg);
            box-shadow: 0 15px 40px rgba(212, 175, 55, 0.8);
        }

        /* لوحة الأدوات الرئيسية - تصميم مركزي فاخر */
        .golden-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 20px;
            padding: 30px;
            font-family: 'Tajawal', sans-serif;
            width: 400px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            display: none;
            animation: fadeIn 0.4s ease;
            z-index: 10000;
            border: 1px solid #e0e0e0;
            background: linear-gradient(to bottom, #ffffff, #f9f9f9);
        }
        .golden-panel h3 {
            margin: 0 0 20px;
            font-size: 26px;
            color: #D4AF37;
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        /* أزرار الأدوات - تصميم ذهبي */
        .golden-btn {
            display: block;
            width: 100%;
            margin: 12px 0;
            background: linear-gradient(135deg, #D4AF37, #FFD700);
            color: #fff;
            padding: 15px;
            font-size: 18px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            text-align: center;
            font-family: 'Tajawal', sans-serif;
            box-shadow: 0 6px 15px rgba(212, 175, 55, 0.4);
            position: relative;
            overflow: hidden;
        }
        .golden-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.6);
        }
        .golden-btn:after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                to bottom right,
                rgba(255,255,255,0) 45%,
                rgba(255,255,255,0.8) 50%,
                rgba(255,255,255,0) 55%
            );
            transform: rotate(30deg);
            animation: shine 3s infinite;
        }
        @keyframes shine {
            0% { transform: translateX(-100%) rotate(30deg); }
            100% { transform: translateX(100%) rotate(30deg); }
        }

        /* رسائل التنبيه الفاخرة */
        .golden-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
background: url('https://drahmedkhaled.neocities.org/24783.jpg') no-repeat center;
    background-size: cover;
    backdrop-filter: blur(10px);            color: #fff;
            padding: 35px 45px;
            border-radius: 20px;
            font-size: 22px;
            font-family: 'Tajawal', sans-serif;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            width: 400px;
            max-width: 90%;
            animation: fadeIn 0.4s ease;
            line-height: 1.8;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .golden-toast.loading {
            background: linear-gradient(135deg, #4169E1, #6495ED);
        }
        .golden-toast.error {
            background: linear-gradient(135deg, #FF6347, #FF4500);
        }
        .golden-toast .close {
            position: absolute;
            top: 15px;
            left: 20px;
            font-size: 30px;
            cursor: pointer;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
        }
        .golden-toast .close:hover {
            color: #fff;
            transform: scale(1.2);
        }
        .golden-toast .mission-title {
            font-size: 28px;
            margin: 15px 0;
            color: #fff;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }
        .golden-toast .admin-name {
    font-size: 30px;
    margin: 10px 0;
    padding: 8px 15px;
    border-radius: 8px;
    display: inline-block;
    background: linear-gradient(90deg, #FFD700, #b8860b, #FFD700);
    background-size: 200%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
    animation: shineGold 3s ease-in-out infinite;
}

@keyframes shineGold {
    0% {
        background-position: 0% center;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    }
    50% {
        background-position: 100% center;
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.7);
    }
    100% {
        background-position: 0% center;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    }
}
        }
        .golden-toast .farm-name {
    font-size: 24px;
    color: #1E3A8A; /* الأزرق الغامق */
    margin: 10px 0;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 8px;
    display: inline-block;
    text-shadow: 0 0 10px #1E3A8A, 0 0 20px #1E3A8A, 0 0 30px #1E3A8A; /* تأثير التوهج الأزرق الغامق */

        }
        .golden-toast .signature {
            font-size: 20px;
            color: rgba(255, 20, 147, 0.9);
            margin-top: 20px;
            font-style: italic;
        }

        /* لوحة تسجيل الدخول الذهبية */
        .golden-login-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 20px;
            padding: 35px;
            font-family: 'Tajawal', sans-serif;
            width: 400px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            display: none;
            animation: fadeIn 0.4s ease;
            z-index: 10002;
            border: 1px solid #e0e0e0;
            background: linear-gradient(to bottom, #ffffff, #f9f9f9);
        }
        .golden-login-panel h3 {
            margin: 0 0 25px;
            font-size: 28px;
            color: #D4AF37;
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .golden-login-panel input {
            display: block;
            width: calc(100% - 30px);
            padding: 15px;
            margin: 18px 0;
            font-size: 17px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-family: 'Tajawal', sans-serif;
            transition: all 0.3s ease;
            background: rgba(255, 215, 0, 0.05);
        }
        .golden-login-panel input:focus {
            border-color: #D4AF37;
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
            outline: none;
        }
        .golden-login-panel button {
            display: block;
            width: 100%;
            margin-top: 25px;
            background: linear-gradient(135deg, #D4AF37, #FFD700);
            color: #fff;
            padding: 16px;
            font-size: 19px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            font-family: 'Tajawal', sans-serif;
            box-shadow: 0 6px 15px rgba(212, 175, 55, 0.4);
        }
        .golden-login-panel button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.6);
        }
        .golden-login-panel .welcome-text {
            text-align: center;
            margin-top: 20px;
            font-size: 17px;
            color: #666;
            font-style: italic;
        }

        /* لوحة تبديل المزرعة الذهبية */
        .golden-farm-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 20px;
            padding: 35px;
            font-family: 'Tajawal', sans-serif;
            width: 450px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            display: none;
            animation: fadeIn 0.4s ease;
            z-index: 10003;
            border: 1px solid #e0e0e0;
            background: linear-gradient(to bottom, #ffffff, #f9f9f9);
        }
        .golden-farm-panel .panel-header {
            font-size: 28px;
            color: #D4AF37;
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .golden-farm-panel select, .golden-farm-panel input[type="text"] {
            display: block;
            width: calc(100% - 30px);
            padding: 15px;
            margin: 18px 0;
            font-size: 17px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-family: 'Tajawal', sans-serif;
            transition: all 0.3s ease;
            background: rgba(255, 215, 0, 0.05);
        }
        .golden-farm-panel select:focus, .golden-farm-panel input[type="text"]:focus {
            border-color: #D4AF37;
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
            outline: none;
        }
        .golden-farm-panel .action-btn {
            background: linear-gradient(135deg, #D4AF37, #FFD700);
            color: white;
            border: none;
            padding: 18px;
            font-size: 19px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            width: 100%;
            margin-top: 20px;
            font-family: 'Tajawal', sans-serif;
            box-shadow: 0 6px 15px rgba(212, 175, 55, 0.4);
        }
        .golden-farm-panel .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.6);
        }
        .golden-farm-panel .close-btn {
            position: absolute;
            top: 20px;
            left: 25px;
            font-size: 30px;
            cursor: pointer;
            color: #999;
            background: none;
            border: none;
            padding: 0;
            transition: all 0.3s ease;
        }
        .golden-farm-panel .close-btn:hover {
            color: #D4AF37;
            transform: rotate(90deg) scale(1.2);
        }

        /* لوحة شراء النقاط */
        .golden-points-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 20px;
            padding: 35px;
            font-family: 'Tajawal', sans-serif;
            width: 450px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            display: none;
            animation: fadeIn 0.4s ease;
            z-index: 10004;
            border: 1px solid #e0e0e0;
            background: linear-gradient(to bottom, #ffffff, #f9f9f9);
        }
        .golden-points-panel .panel-header {
            font-size: 28px;
            color: #D4AF37;
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .golden-points-panel input {
            display: block;
            width: calc(100% - 30px);
            padding: 15px;
            margin: 18px 0;
            font-size: 17px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-family: 'Tajawal', sans-serif;
            transition: all 0.3s ease;
            background: rgba(255, 215, 0, 0.05);
        }
        .golden-points-panel input:focus {
            border-color: #D4AF37;
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
            outline: none;
        }
    `;
    document.head.appendChild(style);

    // ============== الوظائف الأساسية ==============
    function showGoldenToast(html, duration = 0) {
        const toast = document.createElement('div');
        toast.className = 'golden-toast';
        toast.innerHTML = `
            <span class="close">&times;</span>
            <div class="toast-content">${html}</div>
        `;
        toast.querySelector('.close').onclick = () => toast.remove();
        document.body.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                toast.remove();
            }, duration);
        }

        return toast;
    }

    function getFarmName() {
        return unsafeWindow.currentUserInfo?.name || 'مزرعة غير معروفة';
    }

    function createGoldenToggle() {
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'golden-toggle';
        toggleBtn.textContent = '';
        toggleBtn.title = 'الأدوات الذهبية - د. أحمد خالد';
        document.body.appendChild(toggleBtn);
        return toggleBtn;
    }

    function createGoldenPanel() {
        const panel = document.createElement('div');
        panel.className = 'golden-panel';
        panel.id = 'ak-panel';
        panel.innerHTML = `
            <h3>الأدوات الذهبية VIP</h3>
            <div class="panel-content"></div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    function createGoldenLoginPanel() {
        const loginPanel = document.createElement('div');
        loginPanel.className = 'golden-login-panel';
        loginPanel.id = 'ak-login-panel';
        loginPanel.innerHTML = `
            <h3>تسجيل دخول المشرف</h3>
            <input type="text" id="ak-username" placeholder="اسم المستخدم" value="admin">
            <input type="password" id="ak-password" placeholder="كلمة المرور" value="password">
            <button id="ak-login-btn">دخول</button>
            <div class="welcome-text">مرحباً بك ,برمجة. أحمد خالد</div>
        `;
        document.body.appendChild(loginPanel);
        return loginPanel;
    }

    function createGoldenFarmPanel() {
        const farmPanel = document.createElement('div');
        farmPanel.className = 'golden-farm-panel';
        farmPanel.id = 'ak-farm-panel';
        farmPanel.innerHTML = `
            <button class="close-btn" title="إغلاق">×</button>
            <div class="panel-header">فتح المزرعة</div>
            <select id="farm-type">
                <option value="us">🌾 فاميلي فارم (الولايات المتحدة)</option>
                <option value="th">🌸 هابي فارم (تايلاند)</option>
                <option value="fr">🌟 سوبر فارم (فرنسا)</option>
            </select>
            <input type="text" id="signed-request-input" placeholder="أدخل signed_request هنا...">
            <button class="action-btn" id="switch-btn">🚀 دخول للمزرعة المحددة</button>
        `;
        document.body.appendChild(farmPanel);
        return farmPanel;
    }

    function createGoldenPointsPanel() {
        const pointsPanel = document.createElement('div');
        pointsPanel.className = 'golden-points-panel';
        pointsPanel.id = 'ak-points-panel';
        pointsPanel.innerHTML = `
            <button class="close-btn" title="إغلاق">×</button>
            <div class="panel-header">شراء نقاط الجزيرة</div>
            <input type="number" id="points-count" placeholder="عدد المرات التي تريد الشراء بها">
            <button class="action-btn" id="buy-points-btn">💎 شراء النقاط المحددة</button>
        `;
        document.body.appendChild(pointsPanel);
        return pointsPanel;
    }

    // ============== إنشاء العناصر الأساسية ==============
    const toggleBtn = createGoldenToggle();
    const panel = createGoldenPanel();
    const loginPanel = createGoldenLoginPanel();
    const farmPanel = createGoldenFarmPanel();
    const pointsPanel = createGoldenPointsPanel();

    panel.style.display = 'none';
    loginPanel.style.display = 'none';
    farmPanel.style.display = 'none';
    pointsPanel.style.display = 'none';

    // ============== متغيرات النظام ==============
    let isLoggedIn = false;
    let loggedInUser = 'admin';

    // ============== إدارة واجهة المستخدم ==============
    toggleBtn.onclick = () => {
        if (!isLoggedIn) {
            loginPanel.style.display = 'block';
            panel.style.display = 'none';
            farmPanel.style.display = 'none';
            pointsPanel.style.display = 'none';
        } else {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            loginPanel.style.display = 'none';
            farmPanel.style.display = 'none';
            pointsPanel.style.display = 'none';
        }
    };

    // ============== نظام تسجيل الدخول ==============
    loginPanel.querySelector('#ak-login-btn').onclick = () => {
        const username = loginPanel.querySelector('#ak-username').value;
        const password = loginPanel.querySelector('#ak-password').value;

        if (username === 'khaled' && password === '01001948570') {
            isLoggedIn = true;
            loggedInUser = username;
            loginPanel.style.display = 'none';
            panel.style.display = 'block';

            showGoldenToast(`
                <div class="mission-title">🎉 تم تسجيل الدخول بنجاح</div>
                <div class="admin-name">${loggedInUser}</div>
                <div>إلى النظام الذهبي للأدوات</div>
                <div class="farm-name">${getFarmName()}</div>
                <div class="signature">برمجة د. أحمد خالد</div>
            `);
        } else {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ خطأ في التسجيل</div>
                <div>اسم المستخدم أو كلمة المرور غير صحيحة</div>
            `, 3000);
            errorToast.classList.add('error');
        }
    };

    // ============== وظائف الأدوات ==============
    function openFarmSwitcher() {
        if (!isLoggedIn) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ يلزم تسجيل الدخول</div>
                <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        panel.style.display = 'none';
        farmPanel.style.display = 'block';
    }

    function buyIslandPoints() {
        if (!isLoggedIn) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ يلزم تسجيل الدخول</div>
                <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        panel.style.display = 'none';
        pointsPanel.style.display = 'block';
    }

    function runGrandmaMission() {
        if (!isLoggedIn) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ يلزم تسجيل الدخول</div>
                <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        const loadingToast = showGoldenToast(`
            <div class="mission-title">⏳ جاري المعالجة</div>
            <div>جاري تنفيذ مهمة الجدة...</div>
        `);
        loadingToast.classList.add('loading');

        const levelHeartPairs = [
            { level: 0, heart: 27 }, { level: 1, heart: 31 },
            { level: 2, heart: 34 }, { level: 3, heart: 36 },
            { level: 4, heart: 38 }, { level: 5, heart: 40 },
            { level: 6, heart: 46 }, { level: 7, heart: 50 }
        ];

        let delay = 0;
        levelHeartPairs.forEach((pair, idx) => {
            setTimeout(() => {
                unsafeWindow.NetUtils.request('/Activity/TakeoutShop4', {
                    action: 'startGame',
                    level: pair.level,
                    needResponse: 'changeLockedGift.save_data',
                    cur_sceneid: 0
                });

                unsafeWindow.NetUtils.request('/Activity/TakeoutShop4', {
                    action: 'gameOver',
                    level: pair.level,
                    heart: String(pair.heart),
                    cur_sceneid: '0'
                });

                if (idx === levelHeartPairs.length - 1) {
                    setTimeout(() => {
                        loadingToast.remove();
                        showGoldenToast(`
                            <div class="mission-title">🎉 تم الانتهاء بنجاح</div>
                            <div>قام</div>
                            <div class="admin-name">${loggedInUser}</div>
                            <div>بتنفيذ مهمة الجدة ل</div>
                            <div class="farm-name">${getFarmName()}</div>
                            <div class="signature">برمجة د. أحمد خالد</div>
                        `);
                    }, 500);
                }
            }, delay);
            delay += 450;
        });
    }

    function runBlinkoMilestone() {
        if (!isLoggedIn) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ يلزم تسجيل الدخول</div>
                <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        const loadingToast = showGoldenToast(`
            <div class="mission-title">⏳ جاري المعالجة</div>
            <div>جاري إنهاء مستويات بلينكو...</div>
        `);
        loadingToast.classList.add('loading');

        const scores = [100, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];
        scores.forEach(score => {
            unsafeWindow.NetUtils.request('Activity/PinballGame', {
                action: 'milestone',
                score: score,
                needResponse: 'Activity/PinballGame2'
            });
        });

        setTimeout(() => {
            loadingToast.remove();
            showGoldenToast(`
                <div class="mission-title">🎯 تم الانتهاء بنجاح</div>
                <div>قام</div>
                <div class="admin-name">${loggedInUser}</div>
                <div>بتنفيذ مهمة بلينكو ل</div>
                <div class="farm-name">${getFarmName()}</div>
                <div class="signature">برمجة د. أحمد خالد</div>
            `);
        }, scores.length * 150);
    }

    function runBattlePassCollector() {
        if (!isLoggedIn) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ يلزم تسجيل الدخول</div>
                <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        const start = +prompt('من أي جائزة تريد البدء؟ (1-45)', '1');
        if (!start || start < 1 || start > 45) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ قيمة غير صالحة</div>
                <div>يجب إدخال رقم بين 1 و 45</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        const loadingToast = showGoldenToast(`
            <div class="mission-title">⏳ جاري المعالجة</div>
            <div>جاري تجميع جوائز BattlePass...</div>
        `);
        loadingToast.classList.add('loading');

        (async () => {
            for (let i = start; i <= 45; i++) {
                const rewardId = `${i * 100}_1`;
                await unsafeWindow.NetUtils.request('Activity/NewBattlePass', {
                    action: 'getReward',
                    event: 0x31708,
                    list: [rewardId]
                });
                await new Promise(r => setTimeout(r, 100));
            }

            loadingToast.remove();
            showGoldenToast(`
                <div class="mission-title">🏆 تم الانتهاء بنجاح</div>
                <div>قام</div>
                <div class="admin-name">${loggedInUser}</div>
                <div>بتنفيذ مهمة BattlePass ل</div>
                <div class="farm-name">${getFarmName()}</div>
                <div class="signature">برمجة د. أحمد خالد</div>
            `);
        })();
    }

    function runDifferencesMission() {
        if (!isLoggedIn) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ يلزم تسجيل الدخول</div>
                <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        if (!confirm(`❓ هل تريد إنهاء جميع مستويات الاختلافات؟\n\nهذا الإجراء يحتاج 30 طاقة\nالمزرعة: ${getFarmName()}`)) {
            return;
        }

        const loadingToast = showGoldenToast(`
            <div class="mission-title">⏳ جاري المعالجة</div>
            <div>جاري إنهاء مهمة الاختلافات...</div>
        `);
        loadingToast.classList.add('loading');

        (async () => {
            let level = 1,
                energy = 30,
                timeLeft = 51.3;

            for (let i = 1; i <= 30; i++) {
                await unsafeWindow.NetUtils.request('Activity/FindDifferences', {
                    action: 'gameStart',
                    level
                });

                await unsafeWindow.NetUtils.request('Activity/FindDifferences', {
                    action: 'gameEnd',
                    level,
                    timeLeft
                });

                level++;
                energy--;
                timeLeft++;
                await new Promise(r => setTimeout(r, 120));
            }

            await unsafeWindow.NetUtils.request('Activity/FindDifferences', {
                action: 'useGift',
                itemId: 0x393ae
            });

            loadingToast.remove();
            showGoldenToast(`
                <div class="mission-title">🔍 تم الانتهاء بنجاح</div>
                <div>قام</div>
                <div class="admin-name">${loggedInUser}</div>
                <div>بتنفيذ مهمة الاختلافات ل</div>
                <div class="farm-name">${getFarmName()}</div>
                <div class="signature">برمجة د. أحمد خالد</div>
            `);
        })();
    }

    // ============== وظيفة شراء نقاط الجزيرة ==============
    function handleBuyPoints() {
        const pointsCount = parseInt(pointsPanel.querySelector('#points-count').value);

        if (!pointsCount || pointsCount < 1) {
            const errorToast = showGoldenToast(`
                <div class="mission-title">❌ قيمة غير صالحة</div>
                <div>يجب إدخال عدد مرات صحيح</div>
            `, 3000);
            errorToast.classList.add('error');
            return;
        }

        const loadingToast = showGoldenToast(`
            <div class="mission-title">⏳ جاري المعالجة</div>
            <div>جاري شراء نقاط الجزيرة...</div>
        `);
        loadingToast.classList.add('loading');

        (async () => {
            for (let i = 0; i < pointsCount; i++) {
                await unsafeWindow.NetUtils.request('spend_rp', {
                        id: 244055,
                        type: 'special_events',
                        is_gift: true,
                        needResponse: 'spend_rp.save_data',
                        cur_sceneid: 1,
                        opTime: Date.now() / 1000
                });
                await new Promise(r => setTimeout(r, 100));
            }

            loadingToast.remove();
            showGoldenToast(`
                <div class="mission-title">💎 تم الانتهاء بنجاح</div>
                <div>قام</div>
                <div class="admin-name">${loggedInUser}</div>
                <div>بتنفيذ شراء النقاط ${pointsCount} مرة ل</div>
                <div class="farm-name">${getFarmName()}</div>
                <div class="signature">برمجة د. أحمد خالد</div>
            `);
            pointsPanel.style.display = 'none';
        })();
    }
function runHiddenPointsCollector() {
    if (!isLoggedIn) {
        const errorToast = showGoldenToast(`
            <div class="mission-title">❌ يلزم تسجيل الدخول</div>
            <div>يجب تسجيل الدخول كمسؤول لاستخدام هذه الأداة</div>
        `, 3000);
        errorToast.classList.add('error');
        return;
    }

    const repeatCount = +prompt('كم مرة تريد تكرار العملية؟ (كل تكرار = 3 طلبات)', '10');
    if (!repeatCount || repeatCount < 1) {
        const errorToast = showGoldenToast(`
            <div class="mission-title">❌ قيمة غير صالحة</div>
            <div>يجب إدخال عدد مرات صحيح</div>
        `, 3000);
        errorToast.classList.add('error');
        return;
    }

    const total = repeatCount * 3;
    let current = 0;

    const loadingToast = showGoldenToast(`
        <div class="mission-title">🔍 جاري التجميع</div>
        <div>جاري تجميع النقاط المخفية...</div>
        <div style="margin: 15px 0; background: #f0f0f0; border-radius: 10px; height: 20px; overflow: hidden;">
            <div id="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #D4AF37, #FFD700); transition: width 0.3s;"></div>
        </div>
        <div id="progress-status" style="font-size: 16px; margin-top: 5px;">تم إرسال 0 / ${total} (0%)</div>
    `);
    loadingToast.classList.add('loading');

    const bar = loadingToast.querySelector('#progress-bar');
    const status = loadingToast.querySelector('#progress-status');

    (async () => {
        for (let i = 0; i < repeatCount; i++) {
            for (let sceneid = 0; sceneid <= 2; sceneid++) {
                const requestData = {
                    isDouble: false,
                    type: 'seeds',
                    action: 'getDrop',
                    needResponse: '/Activity/UniversalDrop.save_data',
                    cur_sceneid: sceneid,
                    opTime: 73.674
                };
                await unsafeWindow.NetUtils.request('/Activity/UniversalDrop', requestData);
                current++;
                const percent = ((current / total) * 100).toFixed(1);
                bar.style.width = `${percent}%`;
                status.textContent = `تم إرسال ${current} / ${total} (${percent}%)`;
                await new Promise(r => setTimeout(r, 100));
            }
        }

        loadingToast.remove();
        showGoldenToast(`
            <div class="mission-title">✨ تم الانتهاء بنجاح</div>
            <div>قام</div>
            <div class="admin-name">${loggedInUser}</div>
            <div>بتجميع النقاط المخفية ${repeatCount} مرة ل</div>
            <div class="farm-name">${getFarmName()}</div>
            <div class="signature">برمجة د. أحمد خالد</div>
        `);
    })();
}

    // ============== إعداد أزرار الأدوات ==============
    const tasks = [
        { label: '🌾 فتح المزرعة', handler: openFarmSwitcher },
        { label: '👵 مهمة الجدة', handler: runGrandmaMission },
        { label: '🚀 بلينكو', handler: runBlinkoMilestone },
        { label: '🎁 جوائز الموسم', handler: runBattlePassCollector },
        { label: '👀 الاختلافات', handler: runDifferencesMission },
        { label: '💎 شراء نقاط الجزيرة', handler: buyIslandPoints },
        { label: '🔍 تجميع النقاط المخفية', handler: runHiddenPointsCollector }
    ];

    const panelContent = panel.querySelector('.panel-content');
    tasks.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'golden-btn';
        btn.textContent = t.label;
        btn.onclick = () => {
            panel.style.display = 'none';
            t.handler();
        };
        panelContent.appendChild(btn);
    });

    // ============== إعداد أحداث اللوحات ==============
farmPanel.querySelector('.close-btn').onclick = () => {
    farmPanel.style.display = 'none';
};

pointsPanel.querySelector('.close-btn').onclick = () => {
    pointsPanel.style.display = 'none';
};

farmPanel.querySelector('#switch-btn').onclick = () => {
    const sr = farmPanel.querySelector("#signed-request-input").value.trim();
    const type = farmPanel.querySelector("#farm-type").value;

    if (!sr) {
        const errorToast = showGoldenToast(`
            <div class="mission-title">❌ بيانات ناقصة</div>
            <div>يجب إدخال signed_request أولاً</div>
        `, 3000);
        errorToast.classList.add('error');
        return;
    }

    let actionUrl = "https://farm-us.centurygames.com";
    if (type === "th") actionUrl = "https://farm-th.centurygames.com";
    else if (type === "fr") actionUrl = "https://farm-fr.centurygames.com";

    const loadingToast = showGoldenToast(`
        <div class="mission-title">⚡ جاري التحميل</div>
        <div>جاري فتح المزرعة المحددة...</div>
    `);
    loadingToast.classList.add('loading');

    setTimeout(() => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = actionUrl;
        form.style.display = "none";
        const input = document.createElement("input");
        input.name = "signed_request";
        input.value = sr;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }, 1500);
};

pointsPanel.querySelector('#buy-points-btn').onclick = () => {
    handleBuyPoints();
};

// ============== تهيئة النظام ==============
console.log('تم تحميل الأدوات الذهبية VIP بنجاح - الإصدار 3.0');
})();
