# دليل بناء APK للأندرويد
# Native Android APK Build Guide

## المتطلبات | Requirements

### 1. Java Development Kit (JDK)
- تحتاج إلى JDK 17 أو أحدث
- Need JDK 17 or newer
```bash
# للتحقق من الإصدار | Check version
java -version
```

### 2. Android Studio (اختياري | Optional)
- يُفضل تثبيت Android Studio لإدارة SDK
- Recommended for managing Android SDK
- تحميل من | Download from: https://developer.android.com/studio

### 3. Android SDK Command-Line Tools
- ستحتاج إلى Android SDK مثبت
- Android SDK required
- الإصدار الأدنى: API 22 (Android 5.1)
- Minimum version: API 22 (Android 5.1)

## إعداد المشروع | Project Setup

### 1. تثبيت التبعيات | Install Dependencies
```bash
npm install
```

### 2. بناء مشروع الويب | Build Web Project
```bash
npm run build
```

### 3. مزامنة Capacitor | Sync Capacitor
```bash
npm run cap:sync
```

## بناء APK | Build APK

### طريقة 1: بناء APK للتطوير | Method 1: Debug APK Build
```bash
# البناء السريع للتجربة | Quick build for testing
npm run cap:build:android
```
الملف سيكون في | Output file:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### طريقة 2: بناء APK للإصدار | Method 2: Release APK Build
```bash
# البناء للنشر | Production build
npm run cap:build:android:release
```
الملف سيكون في | Output file:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### طريقة 3: استخدام Android Studio | Method 3: Using Android Studio
```bash
# فتح المشروع في Android Studio | Open project in Android Studio
npm run cap:open:android
```
ثم من قائمة Build → Build Bundle(s) / APK(s) → Build APK(s)

Then from menu: Build → Build Bundle(s) / APK(s) → Build APK(s)

## توقيع APK للإصدار | Signing Release APK

### 1. إنشاء مفتاح التوقيع | Create Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### 2. تحديث capacitor.config.ts
```typescript
android: {
  buildOptions: {
    keystorePath: 'path/to/my-release-key.keystore',
    keystoreAlias: 'my-key-alias',
    releaseType: 'APK'
  }
}
```

### 3. إضافة كلمة المرور | Add Passwords
أنشئ ملف `android/keystore.properties`:
Create file `android/keystore.properties`:
```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=my-key-alias
storeFile=path/to/my-release-key.keystore
```

### 4. البناء الموقع | Build Signed APK
```bash
npm run cap:build:android:release
```

## إعدادات إضافية | Additional Configuration

### تخصيص الأيقونة | Customize Icon
1. ضع صورة PNG (1024x1024) في مجلد `resources/icon.png`
2. Put 1024x1024 PNG in `resources/icon.png`
3. استخدم Capacitor Asset Generator أو Android Studio
4. Use Capacitor Asset Generator or Android Studio

### تخصيص شاشة البداية | Customize Splash Screen
1. ضع صورة PNG في `resources/splash.png`
2. Put PNG in `resources/splash.png`
3. عدّل إعدادات SplashScreen في `capacitor.config.ts`
4. Modify SplashScreen settings in `capacitor.config.ts`

### تغيير اسم التطبيق | Change App Name
عدّل في | Edit in `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">نظام الجراحة العامة</string>
```

### تغيير معرف التطبيق | Change App ID
عدّل في | Edit in:
- `capacitor.config.ts`: `appId`
- `app.json`: `appId`
- `android/app/build.gradle`: `applicationId`

## الأوامر المتاحة | Available Commands

```bash
# مزامنة التغييرات | Sync changes
npm run cap:sync

# فتح في Android Studio | Open Android Studio
npm run cap:open:android

# بناء APK تطوير | Build debug APK
npm run cap:build:android

# بناء APK إصدار | Build release APK
npm run cap:build:android:release

# تنظيف البناء | Clean build
npm run android:clean
```

## استكشاف الأخطاء | Troubleshooting

### خطأ: JAVA_HOME غير محدد
### Error: JAVA_HOME not set
```bash
# Linux/Mac
export JAVA_HOME=/path/to/jdk
export PATH=$JAVA_HOME/bin:$PATH

# Windows
set JAVA_HOME=C:\path\to\jdk
set PATH=%JAVA_HOME%\bin;%PATH%
```

### خطأ: Android SDK غير موجود
### Error: Android SDK not found
```bash
# حدد مسار SDK | Set SDK path
export ANDROID_HOME=/path/to/android-sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

### خطأ: Gradle بطيء
### Error: Gradle slow
عدّل | Edit `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx2048m
org.gradle.daemon=true
org.gradle.parallel=true
```

### مشكلة: التطبيق لا يعمل بدون إنترنت
### Issue: App doesn't work offline
- تأكد من بناء المشروع قبل المزامنة
- Ensure web project is built before sync
- تحقق من وجود ملفات dist/public
- Verify dist/public directory exists

## ملاحظات مهمة | Important Notes

### الخادم المحلي | Local Server
- التطبيق يحتاج إلى خادم للعمل بشكل كامل
- App needs server to function fully
- يمكن تعيين عنوان الخادم في capacitor.config.ts
- Can set server URL in capacitor.config.ts

### قاعدة البيانات | Database
- يجب أن يكون لديك خادم PostgreSQL يعمل
- Need running PostgreSQL server
- عدّل DATABASE_URL في متغيرات البيئة
- Modify DATABASE_URL in environment variables

### الصلاحيات | Permissions
- قد تحتاج لإضافة صلاحيات في AndroidManifest.xml
- May need to add permissions in AndroidManifest.xml
- مثل: INTERNET, CAMERA, STORAGE
- Such as: INTERNET, CAMERA, STORAGE

## روابط مفيدة | Useful Links

- [Capacitor Documentation](https://capacitorjs.com/)
- [Android Developer Guide](https://developer.android.com/)
- [Signing Your App](https://developer.android.com/studio/publish/app-signing)

## الدعم | Support

للمساعدة أو الإبلاغ عن مشاكل:
For help or reporting issues:
- افتح Issue في GitHub
- Open GitHub Issue
- راجع الوثائق الرسمية
- Check official documentation
