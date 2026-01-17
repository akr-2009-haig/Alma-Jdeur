#!/bin/bash

echo "🔍 فحص مشروع Alma-Jdeur ..."

# 1️⃣ التحقق من ملف .env
if [ -f ".env" ]; then
  echo "✅ ملف .env موجود"
else
  echo "❌ ملف .env غير موجود"
  exit 1
fi

# التحقق من متغير DATABASE_URL
if grep -q "DATABASE_URL=" .env; then
  echo "✅ متغير DATABASE_URL موجود"
else
  echo "❌ متغير DATABASE_URL غير موجود في .env"
  exit 1
fi

# 2️⃣ التحقق من مكتبات npm
declare -a packages=("pg" "drizzle-orm" "dotenv")

for pkg in "${packages[@]}"; do
  npm list $pkg &>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ مكتبة $pkg مثبتة"
  else
    echo "❌ مكتبة $pkg غير مثبتة"
  fi
done

# 3️⃣ التحقق من PostgreSQL
if command -v psql &>/dev/null; then
  echo "✅ PostgreSQL مثبت"
else
  echo "❌ PostgreSQL غير مثبت"
fi

# التحقق من خدمة PostgreSQL
pg_ctl status &>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ خدمة PostgreSQL تعمل"
else
  echo "❌ خدمة PostgreSQL لا تعمل"
fi

# 4️⃣ اختبار الاتصال بقاعدة البيانات
DB_URL=$(grep "DATABASE_URL=" .env | cut -d '=' -f2)
if psql $DB_URL -c "\q" &>/dev/null; then
  echo "✅ الاتصال بقاعدة البيانات ناجح"
else
  echo "❌ فشل الاتصال بقاعدة البيانات"
fi

echo "🔧 الفحص اكتمل."
