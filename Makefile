# Variables
DOCKER_COMPOSE = docker compose
ENV_FILE = .env
SERVICES = postgres mq qdrant api collector builder

# Colors for pretty printing
BLUE := \033[36m
GREEN := \033[32m
RED := \033[31m
RESET := \033[0m


# Database migrations
.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(RESET)"
	docker exec lpd-api alembic upgrade head

.PHONY: db-migrate-create
db-migrate-create: ## Create a new migration
	@echo "$(BLUE)Creating new migration...$(RESET)"
	docker exec lpd-api alembic revision --autogenerate -m "$(message)"

.PHONY: db-migrate-rollback
db-migrate-rollback: ## Rollback last migration
	@echo "$(BLUE)Rolling back last migration...$(RESET)"
	docker exec lpd-api alembic downgrade -1

.PHONY: db-check-connection
db-check-connection: ## Check database connection
	@echo "$(BLUE)Checking database connection...$(RESET)"
	@docker compose exec api python -c "from sqlalchemy import create_engine; \
		import os; \
		url = f'postgresql://{os.getenv(\"POSTGRES_USER\")}:{os.getenv(\"POSTGRES_PASSWORD\")}@{os.getenv(\"POSTGRES_HOST\")}:{os.getenv(\"POSTGRES_PORT\")}/{os.getenv(\"POSTGRES_DB\")}'; \
		print(f'Connecting to: {url}'); \
		engine = create_engine(url); \
		connection = engine.connect(); \
		print('Connection successful!')"
		
# Local Development Commands

# Run backend services locally without docker
.PHONY: local-start-lighthouse
local-start-lighthouse: ## Start lighthouse service locally without docker
	export PYTHONPATH=$$PYTHONPATH:$(shell pwd)/apps/backend/services/lighthouse/src
	python apps/backend/services/lighthouse/src/main.py

# Build Commands
.PHONY: build
build: ## Build all services
	@echo "$(BLUE)Building all services...$(RESET)"
	$(DOCKER_COMPOSE) build

.PHONY: build-api
build-api: ## Build API service
	@echo "$(BLUE)Building API service...$(RESET)"
	$(DOCKER_COMPOSE) build api

.PHONY: build-collector
build-collector: ## Build collector service
	@echo "$(BLUE)Building collector service...$(RESET)"
	$(DOCKER_COMPOSE) build collector

.PHONY: build-builder
build-builder: ## Build builder service
	@echo "$(BLUE)Building builder service...$(RESET)"
	$(DOCKER_COMPOSE) build builder

.PHONY: build-generator
build-generator: ## Build generator service
	@echo "$(BLUE)Building generator service...$(RESET)"
	$(DOCKER_COMPOSE) build generator

.PHONY: build-lighthouse
build-lighthouse: ## Build lighthouse service
	@echo "$(BLUE)Building lighthouse service...$(RESET)"
	$(DOCKER_COMPOSE) build lighthouse

.PHONY: local-start
local-start: ## Start all services for local development
	@echo "$(BLUE)Starting all services...$(RESET)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)Services started successfully!$(RESET)"

.PHONY: local-start-infra
local-start-infra: ## Start only infrastructure services (postgres, rabbitmq, qdrant)
	@echo "$(BLUE)Starting infrastructure services...$(RESET)"
	$(DOCKER_COMPOSE) up -d postgres mq qdrant
	@echo "$(GREEN)Infrastructure services started!$(RESET)"

.PHONY: local-start-api
local-start-api: ## Start API service and its dependencies
	@echo "$(BLUE)Starting API and dependencies...$(RESET)"
	$(DOCKER_COMPOSE) up -d postgres mq qdrant api
	@echo "$(GREEN)API service started!$(RESET)"

.PHONY: local-stop
local-stop: ## Stop all services
	@echo "$(BLUE)Stopping all services...$(RESET)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)All services stopped!$(RESET)"

.PHONY: local-stop-builder
local-stop-builder: ## Stop builder service
	@echo "$(BLUE)Stopping builder service...$(RESET)"
	$(DOCKER_COMPOSE) down builder
	@echo "$(GREEN)Builder service stopped!$(RESET)"

.PHONY: local-restart
local-restart: local-stop local-start ## Restart all services

.PHONY: mq-setup
mq-setup:
	@echo "$(BLUE)Setting up RabbitMQ permissions...$(RESET)"
	@docker compose exec mq rabbitmqctl add_vhost /
	@docker compose exec mq rabbitmqctl set_permissions -p / guest ".*" ".*" ".*"
	@docker compose exec mq rabbitmqctl set_user_tags guest administrator
	@echo "$(GREEN)RabbitMQ permissions set!$(RESET)"

# Logs
.PHONY: logs
logs: ## View logs of all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: logs-api
logs-api: ## View API logs
	$(DOCKER_COMPOSE) logs -f api

.PHONY: logs-collector
logs-collector: ## View collector logs
	$(DOCKER_COMPOSE) logs -f collector

.PHONY: logs-builder
logs-builder: ## View builder logs
	$(DOCKER_COMPOSE) logs -f builder

# Clean Commands
.PHONY: clean
clean: local-stop ## Stop services and clean up containers, volumes
	@echo "$(BLUE)Cleaning up Docker resources...$(RESET)"
	$(DOCKER_COMPOSE) down -v --remove-orphans
	@echo "$(GREEN)Cleanup complete!$(RESET)"

.PHONY: clean-build
clean-build: clean build ## Clean and rebuild all services

# Database Commands
.PHONY: db-shell
db-shell: ## Open PostgreSQL shell
	@echo "$(BLUE)Connecting to PostgreSQL...$(RESET)"
	docker exec -it lpd-postgres psql -U $${POSTGRES_USER} -d $${POSTGRES_DB}

.PHONY: db-backup 
db-backup: ## Backup PostgreSQL database
	@echo "$(BLUE)Creating database backup...$(RESET)"
	docker exec lpd-postgres pg_dump -U $${POSTGRES_USER} $${POSTGRES_DB} > backup-$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup created!$(RESET)"

# Health Checks
.PHONY: health-check
health-check: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(RESET)"
	@for service in $(SERVICES); do \
		echo "Checking $$service..."; \
		curl -f http://localhost:$${PORT:-8000}/health 2>/dev/null || echo "$$service is not healthy"; \
	done
	@echo "$(GREEN)Health check complete!$(RESET)"

# Development Utilities
.PHONY: lint
lint: ## Run linters
	@echo "$(BLUE)Running linters...$(RESET)"
	docker exec lpd-api black .
	docker exec lpd-api isort .
	docker exec lpd-api flake8 .
	@echo "$(GREEN)Linting complete!$(RESET)"

.PHONY: test
test: ## Run tests
	@echo "$(BLUE)Running tests...$(RESET)"
	docker exec lpd-api pytest
	@echo "$(GREEN)Tests complete!$(RESET)"

# Help
.PHONY: help
help: ## Display this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "  $(BLUE)%-20s$(RESET) %s\n", $$1, $$NF }' $(MAKEFILE_LIST)


# Modal
.PHONY: modal-deploy-comfyui
modal-deploy-comfyui: ## Build the modal app
	modal deploy apps/backend/services/generator/src/workflow/comfyui/comfyapp.py

.PHONY: modal-run-comfyui
modal-run-comfyui: ## Build the modal app
	modal serve apps/backend/services/generator/src/workflow/comfyui/comfyapp.py

.PHONY: modal-run-comfyui-api
modal-run-comfyui-api: ## Build the modal app
	modal run apps/backend/services/generator/src/workflow/comfyui/comfyapp.py --api

.PHONY: modal-stop-comfyui
modal-stop-comfyui: ## Build the modal app
	modal app stop lpd-comfyui

.PHONY: modal-list-apps
modal-list-apps: ## List all modal apps
	modal list

.PHONY: modal-test-comfyui
modal-test-comfyui: ## Test the modal app
	python apps/backend/services/generator/src/workflow/comfyui/comfyclient.py "--modal-workspace" "lpd-comfyui" "--prompt" "Spider-Man visits Yosemite, rendered by Blender, trending on artstation"

# Default target
.DEFAULT_GOAL := help