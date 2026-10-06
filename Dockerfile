# 1) Build the React app
FROM node:22-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Run FastAPI, which also serves the built app
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ backend/
COPY --from=web /web/dist frontend/dist
WORKDIR /app/backend
EXPOSE 8000
# sh -c expands the host's $PORT (Render sets it); exec makes uvicorn PID 1 so stop signals reach it
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --timeout-graceful-shutdown 1"]
