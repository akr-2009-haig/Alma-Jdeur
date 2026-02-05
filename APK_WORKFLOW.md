# خطوات بناء APK - سير العمل الكامل
# APK Build Steps - Complete Workflow

## 🎯 الهدف | Goal
تحويل المشروع إلى ملف APK يمكن تثبيته على أجهزة Android
Convert the project to an APK file that can be installed on Android devices

---

## ✅ الخطوة 1: التحقق من المتطلبات | Step 1: Verify Requirements

```bash
# التحقق من Node.js
node --version  # يجب أن يكون v18 أو أحدث

# التحقق من Java
java -version   # يجب أن يكون JDK 17 أو أحدث

# التحقق من Android SDK (اختياري للخطوات المتقدمة)
echo $ANDROID_HOME

# تشغيل سكريبت التحقق التلقائي
./verify_apk_setup.sh
```

**النتيجة المتوقعة | Expected Result:**
- ✅ جميع الأدوات مثبتة
- ✅ All tools installed

---

## ✅ الخطوة 2: تثبيت التبعيات | Step 2: Install Dependencies

```bash
# التثبيت (مرة واحدة فقط)
npm install
```

**النتيجة المتوقعة | Expected Result:**
```
added XXX packages
```

---

## ✅ الخطوة 3: بناء مشروع الويب | Step 3: Build Web Project

```bash
npm run build
```

**النتيجة المتوقعة | Expected Result:**
```
building client...
✓ built in X.XXs
building server...
⚡ Done in XXms
```

**التحقق | Verify:**
```bash
ls dist/public/
# يجب أن يظهر: index.html, assets/, favicon.png
```

---

## ✅ الخطوة 4: مزامنة مع Android | Step 4: Sync with Android

```bash
npm run cap:sync
```

**النتيجة المتوقعة | Expected Result:**
```
✔ Copying web assets from dist/public to android/app/src/main/assets/public
✔ Creating capacitor.config.json in android/app/src/main/assets
✔ copy android in XXms
✔ Updating Android plugins
✔ update android in XXms
[info] Sync finished in X.XXXs
```

---

## ✅ الخطوة 5: بناء APK | Step 5: Build APK

### للتطوير (Debug APK) | For Development (Debug APK)

```bash
npm run cap:build:android
```

**ماذا يحدث؟ | What happens?**
1. يبني مشروع الويب (npm run build)
2. يزامن مع Android (npx cap sync)
3. يبني APK باستخدام Gradle (./gradlew assembleDebug)

**النتيجة المتوقعة | Expected Result:**
```
BUILD SUCCESSFUL in XXs
XX actionable tasks: XX executed
```

**موقع الملف | File Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### للإصدار النهائي (Release APK) | For Release (Release APK)

⚠️ **ملاحظة:** يحتاج إلى إعداد مفتاح التوقيع أولاً
⚠️ **Note:** Requires signing key setup first

```bash
# 1. إنشاء مفتاح التوقيع (مرة واحدة فقط)
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 2. تحديث capacitor.config.ts بمعلومات المفتاح

# 3. بناء Release APK
npm run cap:build:android:release
```

**موقع الملف | File Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## ✅ الخطوة 6: نقل APK للهاتف | Step 6: Transfer APK to Phone

### الطريقة 1: USB Cable
```bash
# يمكنك نسخ الملف مباشرة من:
android/app/build/outputs/apk/debug/app-debug.apk
```

### الطريقة 2: Cloud Storage
- ارفع APK إلى Google Drive أو Dropbox
- حمّل من الهاتف وثبّت
- Upload APK to Google Drive or Dropbox
- Download on phone and install

---

## ✅ الخطوة 7: تثبيت على الهاتف | Step 7: Install on Phone

1. **تفعيل المصادر غير المعروفة | Enable Unknown Sources:**
   - Settings → Security → Unknown Sources ✓

2. **تثبيت APK | Install APK:**
   - افتح ملف app-debug.apk
   - اضغط "تثبيت" أو "Install"
   - انتظر حتى يكتمل التثبيت

3. **فتح التطبيق | Open App:**
   - ابحث عن "نظام الجراحة العامة"
   - افتح التطبيق

---

## 🔄 تحديث التطبيق | Updating the App

عند تعديل الكود وتريد تحديث APK:
When you modify code and want to update APK:

```bash
# 1. بناء ومزامنة
npm run build
npm run cap:sync

# 2. بناء APK جديد
npm run cap:build:android

# 3. انقل APK الجديد للهاتف
# Transfer new APK to phone
```

---

## 🐛 حل المشاكل | Troubleshooting

### المشكلة: Build fails
```bash
# الحل: تنظيف وإعادة البناء
npm run android:clean
npm run build
npm run cap:build:android
```

### المشكلة: dist/public not found
```bash
# الحل: ابنِ المشروع أولاً
npm run build
```

### المشكلة: Gradle error
```bash
# الحل: تحقق من JAVA_HOME
echo $JAVA_HOME
export JAVA_HOME=/path/to/jdk  # إذا كان فارغاً
```

### المشكلة: التطبيق لا يعمل
- تحقق من عنوان الخادم في capacitor.config.ts
- تأكد من توفر الإنترنت
- راجع logs في Android Studio:
  ```bash
  npm run cap:open:android
  ```

---

## 📊 ملخص الأوامر | Command Summary

| الأمر | Command | الوصف | Description |
|-------|---------|--------|-------------|
| `npm install` | - | تثبيت التبعيات | Install dependencies |
| `npm run build` | - | بناء الويب | Build web |
| `npm run cap:sync` | - | مزامنة | Sync |
| `npm run cap:build:android` | - | بناء APK | Build APK |
| `./verify_apk_setup.sh` | - | التحقق | Verify |

---

## 🎉 النتيجة النهائية | Final Result

بعد اتباع جميع الخطوات، سيكون لديك:
After following all steps, you will have:

✅ ملف APK جاهز للتثبيت
✅ APK file ready for installation

✅ يعمل على أي جهاز Android (5.1+)
✅ Works on any Android device (5.1+)

✅ اسم التطبيق بالعربية: "نظام الجراحة العامة"
✅ App name in Arabic: "نظام الجراحة العامة"

✅ يحتوي على كل وظائف المشروع
✅ Contains all project features

---

## 📞 المساعدة | Help

راجع الوثائق للمزيد من التفاصيل:
Check documentation for more details:

- 📖 APK_BUILD_GUIDE.md - دليل شامل
- 📖 QUICK_START_APK.md - بدء سريع
- 📖 APK_BUILD_CHECKLIST.md - قائمة تحقق

---

**تم الإعداد بنجاح! ✨**
**Successfully configured! ✨**
