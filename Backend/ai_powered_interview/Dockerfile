
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Install Poetry and project dependencies using pyproject.toml/poetry.lock
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir poetry

# Copy project metadata required by Poetry (including README) before install
COPY pyproject.toml  README.md ./

# Ensure the package source (`app`) exists before installing the project
COPY app ./app
RUN poetry install

# Copy application source (rest of repo, tests, configs, etc.)
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]