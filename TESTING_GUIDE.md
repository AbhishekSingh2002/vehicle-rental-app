# 🧪 Testing Guide - Vehicle Rental Booking System

This guide provides detailed instructions for running tests and ensuring code quality in the Vehicle Rental Booking System.

## 🚀 Quick Start

### Run All Tests
```bash
# Run frontend and backend tests separately
cd frontend && npm test
cd ../backend && npm test
```

### Test Coverage
```bash
# Frontend test coverage
cd frontend
npm test -- --coverage

# Backend test coverage (if tests configured)
cd ../backend
npm test -- --coverage
```

## 🧭 Test Structure

### Frontend Tests
- **Location**: `frontend/src/__tests__/`
- **Frameworks**: Jest, React Testing Library
- **Coverage**:
  - Component rendering
  - User interactions
  - Form validations
  - API integration (mocked)
  - Routing

### Backend Tests
- **Location**: `backend/tests/`
- **Frameworks**: Jest, Supertest
- **Coverage**:
  - API endpoints
  - Database operations
  - Authentication
  - Validation
  - Error handling

## 🧪 Running Tests

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/__tests__/App.test.jsx

# Run tests with coverage
npm test -- --coverage
```

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/api/vehicles.test.js

# Run tests with coverage
npm test -- --coverage
```

## 🧩 Test Doubles

### Mocking API Calls (Frontend)
```javascript
// Example using Jest's mocking
import { render, screen } from '@testing-library/react';
import { getVehicles } from '../../services/vehicleService';

jest.mock('../../services/vehicleService');

test('displays vehicles after loading', async () => {
  getVehicles.mockResolvedValue([
    { id: 1, name: 'Honda City', type: 'Sedan' }
  ]);
  
  render(<VehicleList />);
  
  // Assert loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data to load
  const vehicleName = await screen.findByText('Honda City');
  expect(vehicleName).toBeInTheDocument();
});
```

### Testing API Endpoints (Backend)
```javascript
const request = require('supertest');
const app = require('../../app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Vehicle API', () => {
  beforeAll(async () => {
    // Setup test data
    await prisma.vehicle.create({
      data: { name: 'Test Vehicle', type: 'SEDAN', status: 'AVAILABLE' }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.vehicle.deleteMany();
    await prisma.$disconnect();
  });

  it('should get all vehicles', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
```

## 🧪 Integration Tests

### Frontend Integration Tests
Test component interactions and state management:

```javascript
test('should add item to cart', async () => {
  render(
    <CartProvider>
      <ProductList />
      <Cart />
    </CartProvider>
  );
  
  const addButton = await screen.findByRole('button', { name: /add to cart/i });
  fireEvent.click(addButton);
  
  expect(screen.getByText('1 item in cart')).toBeInTheDocument();
});
```

### Backend Integration Tests
Test database and service layer integration:

```javascript
describe('Booking Service', () => {
  it('should create a booking with valid data', async () => {
    const bookingData = {
      vehicleId: 1,
      startDate: '2023-06-01',
      endDate: '2023-06-05',
      userId: 1
    };
    
    const booking = await bookingService.createBooking(bookingData);
    
    expect(booking).toHaveProperty('id');
    expect(booking.status).toBe('CONFIRMED');
  });
});
```

## 🛠️ Test Utilities

### Custom Render Function (Frontend)
Create a `test-utils.jsx` file to wrap components with providers:

```javascript
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Test Database Setup (Backend)
Use a separate test database:

```javascript
// jest.setup.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/vehicle_rental_test'
    }
  }
});

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  // Clean database between tests
  const tablenames = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables 
    WHERE schemaname='public'
  `;
  
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tablename}" CASCADE;`
      );
    }
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

## 🔍 Debugging Tests

### Frontend Test Debugging
```bash
# Run in debug mode
DEBUG_PRINT_LIMIT=10000 npm test -- --no-cache --verbose

# Debug in Chrome
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Backend Test Debugging
```bash
# Run with debug output
DEBUG=express:*,prisma:* npm test

# Debug in VS Code
// Add to launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Current File",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["${fileBasename}", "--config", "jest.config.js"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## 🧪 End-to-End Testing

### Using Cypress
1. Install Cypress:
   ```bash
   cd frontend
   npm install cypress --save-dev
   ```

2. Add test scripts to package.json:
   ```json
   "scripts": {
     "cypress:open": "cypress open",
     "cypress:run": "cypress run"
   }
   ```

3. Example test (`cypress/integration/booking.spec.js`):
   ```javascript
   describe('Booking Flow', () => {
     it('completes a booking', () => {
       cy.visit('/');
       cy.contains('Book Now').click();
       // Add test steps
     });
   });
   ```

## 🧹 Code Quality

### ESLint
```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Prettier
```bash
# Format code
npm run format
```

## 📊 Test Coverage Reports

After running tests with coverage, open the generated HTML report:

```bash
# Frontend
open frontend/coverage/lcov-report/index.html

# Backend
open backend/coverage/lcov-report/index.html
```

## 🚨 Common Issues

### Database Connection Issues
- Ensure test database is running
- Verify connection strings in test environment
- Check for port conflicts

### Test Timeouts
- Increase timeout in test files:
  ```javascript
  jest.setTimeout(30000); // 30 seconds
  ```
- Check for unhandled promises

### Mocking Issues
- Ensure mocks are properly reset between tests
- Verify mock implementations match expected calls

## 🤝 Contributing Tests

1. Write tests for all new features
2. Ensure tests are isolated and independent
3. Follow the existing test structure
4. Include appropriate assertions
5. Update this guide if adding new test utilities