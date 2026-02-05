# دليل البدء السريع لبناء APK
# Quick Start Guide for APK Build

## خطوات سريعة | Quick Steps

### 1️⃣ التثبيت | Installation
```bash
npm install
```

### 2️⃣ البناء والمزامنة | Build & Sync
```bash
npm run build
npm run cap:sync
```

### 3️⃣ بناء APK | Build APK
```bash
# للتطوير (سريع) | Debug (fast)
npm run cap:build:android

# للإصدار النهائي | Release
npm run cap:build:android:release
```

### 4️⃣ موقع الملف | File Location
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## ملف التكوين | Configuration File

### app.json
```json
{
  "appId": "com.benisuef.hospital.surgery",
  "appName": "نظام الجراحة العامة",
  "webDir": "dist/public"
}
```

### capacitor.config.ts
- معرف التطبيق | App ID: `com.benisuef.hospital.surgery`
- اسم التطبيق | App Name: `نظام الجراحة العامة`
- مجلد الويب | Web Directory: `dist/public`

## المتطلبات الأساسية | Basic Requirements

✅ Node.js (v18 أو أحدث | or newer)
✅ Java JDK 17+
✅ Android SDK (API 22+)

## أوامر مفيدة | Useful Commands

| الأمر | Command | الوصف | Description |
|-------|---------|--------|-------------|
| `npm run cap:sync` | - | مزامنة التغييرات | Sync changes |
| `npm run cap:open:android` | - | فتح Android Studio | Open Android Studio |
| `npm run android:clean` | - | تنظيف البناء | Clean build |

## استكشاف المشاكل | Quick Troubleshooting

### ❌ لا يوجد JDK | No JDK
```bash
java -version  # تحقق من التثبيت | Check installation
```

### ❌ لا يوجد Android SDK
- ثبّت Android Studio | Install Android Studio
- أو حمّل Command-Line Tools | Or download Command-Line Tools

### ❌ مجلد dist/public مفقود | dist/public missing
```bash
npm run build  # ابنِ المشروع أولاً | Build project first
```

## التالي | Next Steps

📖 للمزيد من التفاصيل، راجع | For more details, see:
- [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md) - دليل كامل | Full guide
- [README.md](./README.md) - معلومات المشروع | Project info

## الخطوة الأخيرة | Final Step

بعد البناء، ستجد ملف APK في | After build, find APK at:
```
📱 android/app/build/outputs/apk/debug/app-debug.apk
```

يمكنك نقله لهاتفك وتثبيته مباشرة!
You can transfer it to your phone and install directly!

---

🎉 **مبروك! مشروعك جاهز لبناء APK**
🎉 **Congratulations! Your project is ready for APK build**
