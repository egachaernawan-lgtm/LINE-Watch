FROM python:3.12-slim

# WeasyPrint needs Pango; fonts for PDF rendering.
RUN apt-get update && apt-get install -y --no-install-recommends \
      libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz0b fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV PYTHONUNBUFFERED=1 PORT=8080
# Cloud Run: one worker process per instance; long-running ingest requests are fine (timeout set on the service).
CMD ["sh", "-c", "alembic upgrade head && python -m app.seed.loader && exec gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 1 --timeout 900 -b 0.0.0.0:${PORT}"]
