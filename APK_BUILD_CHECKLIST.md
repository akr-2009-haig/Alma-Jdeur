# قائمة التحقق لبناء APK | APK Build Checklist

## قبل البناء | Before Building

### ✅ المتطلبات المثبتة | Requirements Installed
- [ ] Node.js (v18+) مثبت | installed
  ```bash
  node --version
  ```
- [ ] Java JDK 17+ مثبت | installed
  ```bash
  java -version
  ```
- [ ] Android SDK مثبت | installed (via Android Studio or Command-Line Tools)
  ```bash
  echo $ANDROID_HOME  # Linux/Mac
  echo %ANDROID_HOME%  # Windows
  ```

### ✅ إعداد المشروع | Project Setup
- [ ] التبعيات مثبتة | Dependencies installed
  ```bash
  npm install
  ```
- [ ] المشروع يعمل محلياً | Project runs locally
  ```bash
  npm run dev
  ```
- [ ] لا توجد أخطاء TypeScript | No TypeScript errors
  ```bash
  npm run check
  ```

## خطوات البناء | Build Steps

### 1️⃣ بناء مشروع الويب | Build Web Project
- [ ] تشغيل أمر البناء | Run build command
  ```bash
  npm run build
  ```
- [ ] التحقق من المخرجات | Verify output
  ```bash
  ls -la dist/public/
  ```
- [ ] يجب أن يحتوي على | Should contain:
  - [ ] index.html
  - [ ] assets/ folder
  - [ ] favicon.png

### 2️⃣ مزامنة Capacitor | Sync Capacitor
- [ ] مزامنة الملفات | Sync files
  ```bash
  npm run cap:sync
  ```
- [ ] التحقق من عدم وجود أخطاء | Check for no errors
- [ ] يجب أن تظهر رسالة | Should show message:
  ```
  ✔ Sync finished
  ```

### 3️⃣ بناء APK | Build APK

#### للتطوير (Debug) | For Development
- [ ] تشغيل أمر بناء Debug | Run debug build
  ```bash
  npm run cap:build:android
  ```
- [ ] انتظار اكتمال البناء | Wait for build completion
- [ ] التحقق من الملف | Verify file exists
  ```bash
  ls -la android/app/build/outputs/apk/debug/
  ```
- [ ] الملف المتوقع | Expected file:
  ```
  app-debug.apk
  ```

#### للإصدار (Release) | For Release
- [ ] إنشاء مفتاح التوقيع | Create signing key (first time only)
  ```bash
  keytool -genkey -v -keystore my-release-key.keystore \
    -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] تحديث capacitor.config.ts | Update capacitor.config.ts
  - [ ] keystorePath
  - [ ] keystoreAlias
- [ ] إنشاء keystore.properties | Create keystore.properties
- [ ] تشغيل أمر بناء Release | Run release build
  ```bash
  npm run cap:build:android:release
  ```
- [ ] التحقق من الملف الموقع | Verify signed file
  ```bash
  ls -la android/app/build/outputs/apk/release/
  ```

## بعد البناء | After Building

### ✅ التحقق من APK | Verify APK
- [ ] حجم الملف معقول | File size reasonable (usually 5-20 MB)
  ```bash
  du -h android/app/build/outputs/apk/debug/app-debug.apk
  ```
- [ ] APK يفتح بدون أخطاء | APK opens without errors
- [ ] يمكن نقله للهاتف | Can transfer to phone

### ✅ التثبيت والاختبار | Install & Test
- [ ] نقل APK للهاتف | Transfer APK to phone
  - USB cable أو | or
  - Cloud storage (Google Drive, Dropbox, etc.)
- [ ] تفعيل "مصادر غير معروفة" | Enable "Unknown Sources"
  - Settings → Security → Unknown Sources
- [ ] تثبيت APK | Install APK
- [ ] فتح التطبيق | Open app
- [ ] اختبار الوظائف الأساسية | Test basic functions:
  - [ ] شاشة البداية تظهر | Splash screen shows
  - [ ] التطبيق يحمل | App loads
  - [ ] واجهة المستخدم تعمل | UI works
  - [ ] الاتصال بالخادم يعمل (إذا كان متاحاً) | Server connection works (if available)

## استكشاف المشاكل | Troubleshooting

### ❌ خطأ: JAVA_HOME غير محدد
- [ ] تعيين JAVA_HOME | Set JAVA_HOME
  ```bash
  export JAVA_HOME=/path/to/jdk
  ```

### ❌ خطأ: Gradle fails
- [ ] تنظيف البناء | Clean build
  ```bash
  npm run android:clean
  ```
- [ ] إعادة المحاولة | Retry build

### ❌ خطأ: dist/public مفقود
- [ ] تشغيل البناء أولاً | Run build first
  ```bash
  npm run build
  ```

### ❌ التطبيق لا يعمل
- [ ] التحقق من عنوان الخادم | Check server URL in capacitor.config.ts
- [ ] التحقق من صلاحيات الإنترنت | Check INTERNET permission in AndroidManifest.xml
- [ ] مراجعة logs في Android Studio | Check logs in Android Studio
  ```bash
  npm run cap:open:android
  ```

## الخطوة التالية | Next Steps

### للتطوير | For Development
- [ ] استخدام Android Studio للتصحيح | Use Android Studio for debugging
  ```bash
  npm run cap:open:android
  ```
- [ ] مراجعة Logcat للأخطاء | Check Logcat for errors

### للنشر | For Publishing
- [ ] بناء APK موقع | Build signed APK
- [ ] اختبار APK على أجهزة متعددة | Test on multiple devices
- [ ] إنشاء حساب Google Play Console | Create Google Play Console account
- [ ] رفع APK لـ Play Store | Upload to Play Store
- [ ] ملء معلومات التطبيق | Fill app information
- [ ] إرسال للمراجعة | Submit for review

## ملاحظات | Notes

### الحجم | Size
- Debug APK: أكبر حجماً | Larger size (~10-30 MB)
- Release APK: أصغر حجماً | Smaller size (~5-15 MB)

### الأداء | Performance
- Debug APK: أبطأ | Slower
- Release APK: أسرع | Faster (optimized)

### التوقيع | Signing
- Debug APK: موقع تلقائياً | Auto-signed
- Release APK: يحتاج توقيع يدوي | Needs manual signing

## الموارد | Resources

- 📖 [QUICK_START_APK.md](./QUICK_START_APK.md)
- 📖 [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md)
- 🌐 [Capacitor Docs](https://capacitorjs.com/)
- 🌐 [Android Developer Guide](https://developer.android.com/)

---

✅ **اكتملت جميع الخطوات؟ مبروك! APK جاهز للاستخدام**
✅ **All steps completed? Congratulations! APK is ready to use**
