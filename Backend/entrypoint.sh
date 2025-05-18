#!/bin/bash

echo "✅ Waiting for PostgreSQL..."

# DB가 뜰 때까지 기다림
while ! nc -z db 5432; do
  sleep 1
done

echo "✅ PostgreSQL started!"

# 마이그레이션 및 static 수집
python manage.py migrate
python manage.py collectstatic --noinput

# gunicorn 실행
exec gunicorn Devjs.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120
