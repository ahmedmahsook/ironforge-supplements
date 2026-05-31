<div align="center">



\# ⚡ IronForge



\*\*Production-grade e-commerce platform for fitness supplements\*\*



\[!\[Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=flat-square\&logo=go)](https://golang.org)

\[!\[React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square\&logo=react)](https://reactjs.org)

\[!\[PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square\&logo=postgresql)](https://postgresql.org)

\[!\[Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square\&logo=redis)](https://redis.io)

\[!\[Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square\&logo=docker)](https://docker.com)



\*Clean Architecture · JWT Auth · Razorpay Payments · Redis Caching\*



</div>



\---



\## What This Is



IronForge is a full-stack supplement store built to production standards. The backend is written in Go using Clean Architecture — strict separation between controllers, services, repository, and models. The frontend is a React SPA with a full shopping flow from browse to checkout.



Built to demonstrate real-world backend engineering: secure auth flows, payment integration, caching strategy, and containerized deployment.



\---



\## Architecture



```

Frontend (React + Tailwind)

&#x20;         │

&#x20;         ▼

&#x20; Backend API (Go + Gin)

&#x20;         │

&#x20;  ┌──────┴──────┐

&#x20;  ▼             ▼

PostgreSQL      Redis

&#x20;                       Cloudinary (media)

&#x20;                       Razorpay (payments)

```



\*\*Backend follows Clean Architecture:\*\*



```

backend/

├── cmd/                    # Entry point

├── internal/

│   ├── controllers/        # HTTP handlers

│   ├── services/           # Business logic

│   ├── repository/         # Data access layer

│   ├── models/             # Domain entities

│   ├── middleware/         # Auth, logging

│   ├── infrastructure/     # DB, Redis, external clients

│   └── routes/             # Route registration

├── Dockerfile

└── docker-compose.yml



frontend/

├── src/

│   ├── components/

│   ├── pages/

│   ├── context/

│   ├── hooks/

│   └── api/

└── Dockerfile

```



\---



\## Feature Surface



\### Auth

\- OTP-verified registration via SMTP

\- JWT access tokens + refresh token rotation

\- Role-based access control (User / Admin)

\- Secure logout with token invalidation



\### User

\- Product browsing, search, and filtering

\- Shopping cart and wishlist management

\- Checkout with order placement

\- Order history and cancellation



\### Admin

\- Dashboard with order and user management

\- Full product CRUD

\- Order status updates



\### Payments

\- Cash on Delivery

\- Razorpay online payments with server-side verification



\---



\## Tech Stack



| Layer | Technology |

|-------|-----------|

| Frontend | React 18, React Router, Axios, Tailwind CSS |

| Backend | Go, Gin, GORM |

| Database | PostgreSQL |

| Cache | Redis |

| Payments | Razorpay |

| Media | Cloudinary |

| DevOps | Docker, Docker Compose |



\---



\## Running Locally



\*\*Requirements:\*\* Docker + Docker Compose



```bash

git clone <repository-url>

cd ironforge

```



Configure environment variables (see below), then:



```bash

docker compose up --build

```



| Service | URL |

|---------|-----|

| Frontend | http://localhost:3000 |

| Backend API | http://localhost:8080 |

| PostgreSQL | localhost:5432 |

| Redis | localhost:6379 |



\---



\## Environment Variables



\*\*Backend\*\* (`.env`)



```env

\# Database

DB\_HOST=

DB\_PORT=

DB\_USER=

DB\_PASSWORD=

DB\_NAME=



\# Auth

JWT\_SECRET=

REFRESH\_SECRET=



\# Email (OTP)

SMTP\_HOST=

SMTP\_PORT=

SMTP\_USER=

SMTP\_PASS=



\# Cache

REDIS\_ADDR=



\# Payments

RAZORPAY\_KEY\_ID=

RAZORPAY\_KEY\_SECRET=



\# Media

CLOUDINARY\_URL=

```



\*\*Frontend\*\* (`.env`)



```env

VITE\_RAZORPAY\_KEY=

```



\---



\## Engineering Highlights



\- \*\*Clean Architecture\*\* — business logic is fully decoupled from transport and persistence layers; controllers call services, services call repositories, nothing leaks across boundaries

\- \*\*JWT + Refresh Tokens\*\* — short-lived access tokens with a rotation-based refresh mechanism; tokens are invalidated on logout via Redis

\- \*\*Redis Caching\*\* — hot paths cached to reduce DB load; cache keys designed for easy invalidation

\- \*\*Razorpay Integration\*\* — payment orders created server-side; signature verification on callback prevents tampering

\- \*\*Dockerized\*\* — all services orchestrated via Compose; single command brings up the full stack



\---



\## Roadmap



\- \[ ] Email order notifications

\- \[ ] Product reviews and ratings

\- \[ ] Coupon and discount system

\- \[ ] Inventory analytics dashboard

\- \[ ] Unit and integration tests

\- \[ ] CI/CD pipeline

\- \[ ] AWS deployment



\---



\## Author



\*\*Ahmed Mahsook\*\* — BCA Graduate · Backend Developer



Building scalable backend systems with Go, PostgreSQL, Redis, Docker, and modern cloud infrastructure.



\---



<div align="center">

<sub>Built with Go · Powered by Clean Architecture</sub>

</div>



