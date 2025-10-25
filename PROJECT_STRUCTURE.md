# Complete Project Structure - Vehicle Rental Booking System

## 📁 Full Directory Tree

```
vehicle-rental-app/
├── README.md
├── TESTING_GUIDE.md
├── DEPLOYMENT.md
├── PROJECT_STRUCTURE.md
├── POSTMAN_COLLECTION.json
├── .gitignore
├── docker-compose.yml
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── .env (git-ignored)
│   ├── Dockerfile
│   ├── .dockerignore
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   │       └── [timestamp]_init/
│   │           └── migration.sql
│   │
│   ├── src/
│   │   ├── index.js
│   │   ├── app.js
│   │   │
│   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── typesController.js
│   │   │   ├── vehiclesController.js
│   │   │   └── bookingsController.js
│   │   │
│   │   ├── services/
│   │   │   └── bookingService.js
│   │   │
│   │   └── lib/
│   │       └── prismaClient.js (optional)
│   │
│   └── logs/ (git-ignored)
│       ├── error.log
│       └── combined.log
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── .env.local (git-ignored)
    ├── Dockerfile
    ├── .dockerignore
    │
    ├── public/
    │   ├── index.html
    │   ├── favicon.ico
    │   └── manifest.json
    │
    └── src/
        ├── index.js
        ├── index.css
        ├── App.jsx
        │
        ├── components/
        │   ├── StepName.jsx
        │   ├── StepWheels.jsx
        │   ├── StepType.jsx
        │   ├── StepModel.jsx
        │   ├── StepDateRange.jsx
        │   ├── StepReview.jsx
        │   ├── StepNav.jsx
        │   └── BookingSuccess.jsx
        │
        ├── hooks/
        │   └── useBookingWizard.js
        │
        ├── services/
        │   └── api.js
        │
        └── utils/
            └── validation.js
```

---

## 📄 File-by-File Breakdown

### Root Level Files

#### `README.md`
**Purpose:** Main project documentation  
**Contains:**
- Project overview
- Tech stack
- Setup instructions
- API documentation
- Database schema
- Running commands

#### `TESTING_GUIDE.md`
**Purpose:** Comprehensive testing documentation  
**Contains:**
- Manual test scenarios
- Expected responses
- Overlap testing steps
- Frontend testing checklist
- Performance testing

#### `DEPLOYMENT.md`
**Purpose:** Production deployment guide  
**Contains:**
- Docker setup
- Cloud platform deployments (Heroku, AWS, DO)
- VPS deployment
- SSL setup
- Monitoring configuration

#### `POSTMAN_COLLECTION.json`
**Purpose:** Ready-to-import API test collection  
**Contains:**
- All API endpoints
- Sample requests
- Test scenarios

#### `docker-compose.yml`
**Purpose:** Multi-container orchestration  
**Contains:**
- PostgreSQL service
- Backend service
- Frontend service (optional)
- Volume definitions
- Network configuration

#### `.gitignore`
**Purpose:** Git exclusions  
**Ignores:**
- node_modules/
- .env files
- Build artifacts
- Log files
- IDE configs

---

### Backend Structure

#### `backend/package.json`
**Purpose:** Node.js project configuration  
**Key Scripts:**
```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "migrate": "npx prisma migrate dev",
  "migrate:deploy": "npx prisma migrate deploy",
  "seed": "node prisma/seed.js",
  "studio": "npx prisma studio",
  "reset": "npx prisma migrate reset --force"
}
```

**Dependencies:**
- `express` - Web framework
- `@prisma/client` - Database client
- `cors` - CORS middleware
- `morgan` - HTTP logger

**Dev Dependencies:**
- `prisma` - ORM CLI
- `nodemon` - Auto-restart

#### `backend/.env.example`
**Purpose:** Environment variable template  
**Variables:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
PORT=3001
NODE_ENV=development
```

#### `backend/Dockerfile`
**Purpose:** Backend containerization  
**Multi-stage build:** No  
**Base image:** node:18-alpine  
**Exposes:** Port 3001

---

### Backend - Prisma Folder

#### `backend/prisma/schema.prisma`
**Purpose:** Database schema definition  
**Models:**
- `VehicleType` - Vehicle categories with wheel count
- `Vehicle` - Individual vehicle instances
- `Booking` - Rental reservations

**Key Features:**
- Foreign key relationships
- Indexes for performance
- JSON metadata support
- Timestamp tracking

#### `backend/prisma/seed.js`
**Purpose:** Database initialization script  
**Creates:**
- 4 vehicle types (cruiser, hatchback, sedan, suv)
- 8 vehicles (2 per type)
- Sample metadata (color, year, fuel type)

**Usage:** `npm run seed`

#### `backend/prisma/migrations/`
**Purpose:** Version-controlled schema changes  
**Contains:** SQL migration files  
**Generated by:** `npx prisma migrate dev`

---

### Backend - Source Code

#### `backend/src/index.js`
**Purpose:** Application entry point  
**Responsibilities:**
- Import Express app
- Start HTTP server
- Listen on configured port
- Log startup information

**Key Code:**
```javascript
const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

#### `backend/src/app.js`
**Purpose:** Express application configuration  
**Responsibilities:**
- Apply middleware (cors, json parser, logger)
- Mount API routes
- Define error handlers
- Export app for testing

**Middleware Stack:**
1. `cors()` - Enable CORS
2. `express.json()` - Parse JSON bodies
3. `morgan('dev')` - HTTP request logging
4. API routes at `/api`
5. 404 handler
6. Global error handler

#### `backend/src/routes/index.js`
**Purpose:** Central route registration  
**Endpoints:**

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/wheels` | typesController.getWheels | Get available wheel counts |
| GET | `/types` | typesController.getTypes | Get vehicle types |
| GET | `/vehicles` | vehiclesController.getVehicles | Get vehicles |
| GET | `/vehicles/:id` | vehiclesController.getVehicleById | Get single vehicle |
| POST | `/bookings` | bookingsController.createBooking | Create booking |
| GET | `/bookings/check-availability` | bookingsController.checkAvailability | Check availability |
| GET | `/bookings/vehicle/:vehicleId` | bookingsController.getVehicleBookings | Get vehicle bookings |
| PATCH | `/bookings/:id/cancel` | bookingsController.cancelBooking | Cancel booking |

---

### Backend - Controllers

#### `backend/src/controllers/typesController.js`
**Purpose:** Handle vehicle type requests  
**Functions:**
- `getTypes(req, res)` - Fetch types, optionally filtered by wheels
- `getWheels(req, res)` - Get distinct wheel counts

**Query Parameters:**
- `wheels` (optional): 2 or 4

**Example Response:**
```json
[
  { "id": 1, "name": "cruiser", "wheels": 2 },
  { "id": 2, "name": "hatchback", "wheels": 4 }
]
```

#### `backend/src/controllers/vehiclesController.js`
**Purpose:** Handle vehicle requests  
**Functions:**
- `getVehicles(req, res)` - Fetch vehicles, optionally filtered by typeId
- `getVehicleById(req, res)` - Fetch single vehicle with bookings

**Query Parameters:**
- `typeId` (optional): Filter by vehicle type

**Includes:** Related type information and metadata

#### `backend/src/controllers/bookingsController.js`
**Purpose:** Handle booking operations  
**Functions:**
- `createBooking(req, res)` - Create new booking
- `getVehicleBookings(req, res)` - List bookings for vehicle
- `checkAvailability(req, res)` - Check if vehicle is available
- `cancelBooking(req, res)` - Cancel existing booking

**Error Handling:**
- 400 - Validation errors
- 404 - Resource not found
- 409 - Overlap conflict
- 500 - Server errors

---

### Backend - Services

#### `backend/src/services/bookingService.js`
**Purpose:** Business logic for bookings  
**Key Function:** `createBooking(data)`

**Transaction Flow:**
1. Validate input data
2. Begin database transaction
3. Verify vehicle exists
4. Lock existing bookings with `SELECT ... FOR UPDATE`
5. Check for date overlaps
6. If no overlap, create booking
7. Commit transaction

**Overlap Detection Logic:**
```javascript
const overlapping = await tx.$queryRaw`
  SELECT id FROM "Booking"
  WHERE "vehicleId" = ${vehicleId}
    AND status = 'confirmed'
    AND NOT ("endDate" < ${start}::date OR "startDate" > ${end}::date)
  FOR UPDATE
`;
```

**Custom Errors:**
- `OverlapError` (409) - Date conflict
- `ValidationError` (400) - Invalid input

**Additional Functions:**
- `getVehicleBookings(vehicleId)` - List bookings
- `checkAvailability(vehicleId, startDate, endDate)` - Boolean check
- `cancelBooking(bookingId)` - Update status

---

### Frontend Structure

#### `frontend/package.json`
**Purpose:** React project configuration  
**Key Scripts:**
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

**Dependencies:**
- `react` - UI library
- `react-dom` - DOM rendering
- `lucide-react` - Icons
- `tailwindcss` - Utility CSS (optional)

#### `frontend/public/index.html`
**Purpose:** HTML entry point  
**Contains:**
- Root div for React mounting
- Meta tags for SEO
- Viewport configuration

#### `frontend/src/index.js`
**Purpose:** React app initialization  
**Responsibilities:**
- Import React
- Import App component
- Render to DOM
- Import global styles

#### `frontend/src/App.jsx`
**Purpose:** Main application component  
**Structure:** Multi-step booking wizard

**State Management:**
```javascript
{
  firstName: '',
  lastName: '',
  wheels: null,
  typeId: null,
  vehicleId: null,
  startDate: '',
  endDate: '',
  stepIndex: 0
}
```

**Features:**
- Progress indicator
- Step navigation
- Validation per step
- API integration
- Success screen

---

### Frontend - Components

#### `StepName.jsx`
**Purpose:** First name input step  
**Inputs:** First name, Last name  
**Validation:** Required, max 50 chars

#### `StepWheels.jsx`
**Purpose:** Wheel count selection  
**Options:** 2 (Bike) or 4 (Car)  
**UI:** Large icon buttons

#### `StepType.jsx`
**Purpose:** Vehicle type selection  
**Data Source:** API `/types?wheels={selected}`  
**Loading State:** Shows spinner

#### `StepModel.jsx`
**Purpose:** Specific vehicle selection  
**Data Source:** API `/vehicles?typeId={selected}`  
**Display:** Vehicle name + metadata

#### `StepDateRange.jsx`
**Purpose:** Date selection  
**Inputs:** Start date, End date  
**Validation:**
- No past dates
- Start ≤ End
- Both required

#### `StepReview.jsx`
**Purpose:** Booking summary and confirmation  
**Display:**
- All entered information
- Vehicle details
- Date range
- Confirm button

#### `BookingSuccess.jsx`
**Purpose:** Post-booking confirmation  
**Display:**
- Success icon
- Booking ID
- Status
- Date range
- Reset button

---

### Frontend - Hooks

#### `hooks/useBookingWizard.js`
**Purpose:** Custom state management hook  
**Returns:**
- `state` - Current wizard state
- `updateField(field, value)` - Update single field
- `nextStep()` - Advance to next step
- `prevStep()` - Go back one step
- `types` - Vehicle types array
- `vehicles` - Vehicles array
- `loading` - Loading state
- `error` - Error message

**Side Effects:**
- Fetch types when wheels selected
- Fetch vehicles when type selected
- Clear error on field update

---

### Frontend - Services

#### `services/api.js`
**Purpose:** API client wrapper  
**Functions:**
- `getTypes(wheels)` - Fetch vehicle types
- `getVehicles(typeId)` - Fetch vehicles
- `createBooking(data)` - Submit booking
- `checkAvailability(vehicleId, startDate, endDate)` - Check dates

**Configuration:**
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

**Error Handling:** Throws errors with status codes

---

## 🔄 Data Flow Diagram

```
User Input → Frontend Component → useBookingWizard Hook → API Service
                                                              ↓
Database ← Prisma ORM ← bookingService ← Controller ← Express Router
                                                              ↓
                                                        Response JSON
                                                              ↓
                                          Component State ← Hook ← Component
                                                              ↓
                                                          UI Update
```

---

## 🗄️ Database Schema Visualization

```
┌─────────────────┐
│  VehicleType    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ wheels          │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│   Vehicle       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ typeId (FK)     │
│ registration    │
│ metadata (JSON) │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│   Booking       │
├─────────────────┤
│ id (PK)         │
│ vehicleId (FK)  │
│ firstName       │
│ lastName        │
│ startDate       │
│ endDate         │
│ status          │
│ createdAt       │
└─────────────────┘
```

---

## 📊 API Request Flow Example

### Creating a Booking

```
1. Frontend POST /api/bookings
   Body: { firstName, lastName, vehicleId, startDate, endDate }
   
2. Express Router → bookingsController.createBooking()
   
3. Controller extracts and validates request data
   
4. Controller calls bookingService.createBooking(data)
   
5. Service starts transaction:
   a. Check vehicle exists
   b. Lock existing bookings (SELECT ... FOR UPDATE)
   c. Check for overlap
   d. If no overlap: INSERT new booking
   e. Commit transaction
   
6. Service returns booking object
   
7. Controller formats response
   
8. Response sent to frontend (201 Created or 409 Conflict)
   
9. Frontend updates UI with result
```

---

## 🎯 Key Design Patterns Used

### Backend
- **MVC Pattern:** Routes → Controllers → Services
- **Repository Pattern:** Prisma abstracts database
- **Transaction Script:** bookingService handles business logic
- **Error Handling Middleware:** Centralized error responses

### Frontend
- **Container/Presentational:** App.jsx manages state, components display
- **Custom Hooks:** useBookingWizard encapsulates logic
- **Controlled Components:** Form inputs managed by React state
- **Progressive Enhancement:** Step-by-step validation

---

## 📝 Naming Conventions

### Backend
- **Files:** camelCase.js (e.g., bookingsController.js)
- **Functions:** camelCase (e.g., createBooking)
- **Classes:** PascalCase (e.g., OverlapError)
- **Constants:** UPPER_SNAKE_CASE (e.g., DATABASE_URL)

### Frontend
- **Components:** PascalCase.jsx (e.g., StepName.jsx)
- **Hooks:** useCamelCase (e.g., useBookingWizard)
- **Functions:** camelCase (e.g., handleSubmit)
- **Props:** camelCase (e.g., firstName)

### Database
- **Tables:** PascalCase (e.g., VehicleType)
- **Columns:** camelCase (e.g., firstName)
- **Indexes:** descriptive names with prefix

---

This structure follows industry best practices and the exact specifications from your document! 🎉