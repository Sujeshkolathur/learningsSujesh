# iStay Backend

Spring Boot 3 API — PostgreSQL inventory, availability, reservations, JWT auth.

## Profiles

| Profile | Purpose |
|---------|---------|
| `local` (default) | Docker Postgres defaults, open Actuator for observe |
| `prod` | Secrets **required** from env; Actuator health-only; CORS from env |
| `test` | Used by integration tests + Testcontainers |

## Prerequisites

```powershell
docker compose -f docker-compose.postgres.yml up -d
```

Copy env template:

```powershell
copy .env.example .env
```

## Run (local)

```powershell
mvn spring-boot:run
```

Uses `local` profile (see `spring-boot-maven-plugin`). GC log: `logs/gc.log`.

### Production-style run

```powershell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:ISTAY_DB_URL="jdbc:postgresql://localhost:5432/istay"
$env:ISTAY_DB_USERNAME="istay"
$env:ISTAY_DB_PASSWORD="istay"
$env:ISTAY_JWT_SECRET="replace-with-long-random-secret-at-least-32-bytes"
$env:ISTAY_CORS_ALLOWED_ORIGINS="http://localhost:5173"
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

App **fails fast** in `prod` if JWT secret is missing/local-default or DB/CORS env is unset.

## Auth (JWT)

| User | Password | Role | Property |
|------|----------|------|----------|
| `front_desk` | `password` | FRONT_DESK (book/cancel) | DEMO-01 |
| `revenue` | `password` | REVENUE (read-only) | DEMO-01 |
| `other_desk` | `password` | FRONT_DESK | OTHER-01 |

`POST /api/auth/login` → Bearer token. Path `propertyId` must match token claim.

| Endpoint | Access |
|----------|--------|
| `POST /api/auth/login` | Public |
| `GET .../inventory`, `.../availability`, `.../reservations` | FRONT_DESK, REVENUE |
| `POST .../reservations`, `.../cancel` | FRONT_DESK |

`GET /api/properties/{propertyId}/reservations?status=CONFIRMED|CANCELLED` — optional status filter; newest first.

## OpenAPI (local profile)

| Resource | URL |
|----------|-----|
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |

Authorize with the JWT from `/api/auth/login`. **Disabled in `prod`.**

## Observe (local profile)

| Signal | Where |
|--------|--------|
| Heap | http://localhost:8080/actuator/metrics/jvm.memory.used |
| Prometheus | http://localhost:8080/actuator/prometheus |
| Grafana | `docker compose up -d` → http://localhost:3000 |

In **prod**, only `/actuator/health` is public; OpenAPI/Swagger are off.

## SonarQube

```powershell
docker compose -f docker-compose.sonarqube.yml up -d
.\scripts\sonar-scan.ps1
```

## Tests

```powershell
./mvnw test
```

Testcontainers PostgreSQL required (Docker).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`:

```text
./mvnw -B -ntp verify
```

Uses Testcontainers (Docker on the runner) and uploads the JaCoCo HTML report as an artifact.
