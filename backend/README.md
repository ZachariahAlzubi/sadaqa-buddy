# Backend setup

## Environment
```
cp .env.example .env
```
Edit `.env` with your Postgres credentials and optional `FRONTEND_URL`.

## Install & database
```
npm install
# ensure PostgreSQL server is running and `psql` client is available
npm run db:schema
npm run db:seed
# imports CSV exports if present (files are optional)
npm run db:import
```

## Run
```
npm run dev
```

## Smoke tests
```
curl -s http://localhost:3001/api/v1/users/me
curl -s "http://localhost:3001/api/v1/transactions?limit=3&sortBy=-created_date"
curl -s -X POST http://localhost:3001/api/v1/pledges \
  -H "Content-Type: application/json" \
  -d '{"transaction_id":"00000000-0000-0000-0000-000000000301","amount":0.25,"donation_type":"sadaqah","month_year":"2025-08"}'
```

