# .docker/Dockerfile.builder
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    TRANSFORMERS_CACHE=/app/.cache/huggingface

WORKDIR /app

# Copy requirements first for better caching
COPY apps/backend/services/builder/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy builder service code
COPY apps/backend/services/builder/src/ /app/src
COPY apps/backend/services/collector/.env ./

# Add this line to add the current directory to PYTHONPATH
ENV PYTHONPATH=/app:$PYTHONPATH

# Command to run the Bytewax pipeline script
RUN chmod +x /app/src/scripts/bytewax_entrypoint.sh

EXPOSE 8020
