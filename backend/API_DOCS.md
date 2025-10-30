# API Reference - Vehicle Rental Backend

Base URL: `/api`

## Auth

- POST `/auth/register`
  - Body: `{ email, password, firstName, lastName }`
  - 201 Created -> `{ id, email, firstName, lastName, token }`
  - 400 Validation error

- POST `/auth/login`
  - Body: `{ email, password }`
  - 200 OK -> `{ token, user: { id, email, firstName, lastName } }`
  - 401 Invalid credentials

- GET `/auth/me` (Bearer auth)
  - 200 OK -> current user profile

## Types & Vehicles (Public)

- GET `/wheels`
  - 200 OK -> `[2, 4]` or enriched wheel counts

- GET `/types?wheels={2|4}`
  - 200 OK -> `[{ id, name, wheels }]`

- GET `/vehicles?typeId={id}`
  - 200 OK -> `[{ id, name, type: { id, name }, metadata }]`

- GET `/vehicles/:id`
  - 200 OK -> vehicle with details and related bookings

## Availability & Bookings

- GET `/bookings/check-availability?vehicleId={id}&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  - 200 OK -> `{ available: boolean }`
  - 400 Missing parameters

- GET `/bookings/vehicle/:vehicleId`
  - 200 OK -> bookings for specified vehicle

Protected (Bearer token required):

- GET `/bookings/my`
  - 200 OK -> bookings for authenticated user, includes computed `totalAmount`

- POST `/bookings`
  - Body: `{ vehicleId, startDate, endDate }`
  - 201 Created -> booking summary including `totalAmount`
  - 409 Overlap error when dates conflict

- PATCH `/bookings/:id/cancel`
  - 200 OK -> updated booking with status

## Notes

- Authentication: Use `Authorization: Bearer <token>` for protected endpoints.
- Dates: Use ISO format `YYYY-MM-DD`.
- Price calculation: `totalAmount = pricePerDay * max(1, days)` computed from vehicle metadata.

