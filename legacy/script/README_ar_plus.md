# النسخة المطورة من سكريبت جمع الصيدليات في الجزائر

هذه النسخة تضيف:

- **Resume / استكمال تلقائي** إذا توقف السكريبت
- **Rotating proxies** عبر ملف `proxies.txt`
- **Retry + backoff** عند فشل الطلبات
- **تصدير إلى CSV و Excel**
- **تصدير مباشر إلى MySQL**
- **تصدير مباشر إلى Supabase Postgres**

## التثبيت

```bash
pip install requests beautifulsoup4 pandas openpyxl sqlalchemy pymysql psycopg2-binary
```

## التشغيل العادي

```bash
python pharmacies_algeria_scraper_plus.py --outdir output_pharmacies_plus
```

## الاستكمال بعد الانقطاع

```bash
python pharmacies_algeria_scraper_plus.py --resume --outdir output_pharmacies_plus
```

## استعمال proxy rotation

أنشئ ملف `proxies.txt` بهذا الشكل:

```txt
http://user:pass@ip1:port
http://user:pass@ip2:port
http://ip3:port
```

ثم شغّل:

```bash
python pharmacies_algeria_scraper_plus.py --proxies-file proxies.txt --resume
```

## التصدير إلى MySQL

```bash
python pharmacies_algeria_scraper_plus.py \
  --mysql-url "mysql+pymysql://USER:PASSWORD@HOST:3306/DBNAME" \
  --table-name pharmacies_algeria
```

## التصدير إلى Supabase

من لوحة Supabase خذ بيانات Postgres connection string ثم شغّل:

```bash
python pharmacies_algeria_scraper_plus.py \
  --supabase-url "postgresql+psycopg2://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres" \
  --table-name pharmacies_algeria
```

## الملفات الناتجة

داخل مجلد الإخراج ستجد:

- `pharmacies_algeria.csv`
- `pharmacies_algeria.xlsx`
- `checkpoint_state.json`
- `checkpoint_records.jsonl`

## ملاحظات

- بعض المواقع قد تغيّر بنيتها، لذلك parsing ليس مضمونًا 100%.
- البلدية أحيانًا يتم استنتاجها من العنوان إذا لم تكن موجودة مباشرة.
- عند التصدير إلى MySQL أو Supabase، إذا أردت استبدال الجدول بدل الإضافة:

```bash
python pharmacies_algeria_scraper_plus.py --db-if-exists replace
```

## مثال كامل

```bash
python pharmacies_algeria_scraper_plus.py \
  --source all \
  --outdir output_pharmacies_plus \
  --resume \
  --delay 1.0 \
  --max-pages-annumed 80 \
  --mysql-url "mysql+pymysql://USER:PASSWORD@HOST:3306/DBNAME"
```
