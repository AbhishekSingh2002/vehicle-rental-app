# 🚗 Vehicle Rental Booking System

A modern, full-stack vehicle rental management system built with React, Node.js, and PostgreSQL. This application provides a seamless booking experience with real-time availability, user authentication, and an intuitive admin interface.

## 🌟 Features

- 🚀 Full booking wizard with 6 steps
- 🔐 User authentication (login/register)
- 📅 Real-time availability checking
- 📱 Responsive design for all devices
- 📊 Admin dashboard (coming soon)
- 📝 Booking management
- 🚗 Vehicle catalog with filtering

## 🛠 Tech Stack

- **Frontend**: React 18, TailwindCSS, React Router
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Testing**: Jest, React Testing Library
- **API Documentation**: Swagger/OpenAPI

## 🚀 Quick Start

### With Docker (Recommended)
```bash
git clone <repository-url>
cd vehicle-rental-app
docker-compose up -d --build

# Run database migrations after containers are up
docker-compose exec backend npx prisma migrate deploy
```

Access the application:
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

### Local Development
1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Update with your database credentials
   npm run migrate       # dev migration
   npm run seed          # optional seed data
   npm run dev           # start backend at http://localhost:3001
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Ensure REACT_APP_API_URL is set in .env.local or via scripts
   npm start  # starts on https://localhost:3000 per scripts
   ```

For detailed setup and deployment instructions, see our [Deployment Guide](./DEPLOYMENT.md).

## 🔧 Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 9+ or yarn 1.22+
- Docker (optional, for containerized development)

### Environment Variables
Create the following files with appropriate values:
- `backend/.env` - Backend configuration (see example below)
- `frontend/.env.local` - Frontend configuration (optional; scripts set sane defaults)

Backend `.env` example:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vehicle_rental_dev?schema=public"
JWT_SECRET=dev-secret-change-me
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Database Setup
```bash
# Apply migrations
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

### Development Scripts
Backend (from `backend/`):
- `npm run dev` - Start backend in dev mode
- `npm run migrate` - Apply dev migrations
- `npm run migrate:deploy` - Apply production migrations
- `npm run seed` - Seed database
- `npm run studio` - Open Prisma Studio
- `npm run reset` - Reset DB (destructive)

Frontend (from `frontend/`):
- `npm start` - Start CRA dev server (HTTPS, port 3000)
- `npm run build` - Build production bundle

## 🧪 Testing

### Quick Test Commands
```bash
# Run all tests
cd backend && npm test && cd ../frontend && npm test

# Run with coverage
cd backend && npm run test:coverage
cd frontend && npm test -- --coverage
```

For comprehensive testing instructions, including E2E testing and test development, see our [Testing Guide](./TESTING_GUIDE.md).

## 📚 Documentation

- [API Documentation](http://localhost:3001/api-docs) (available after starting the backend)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive guide to testing the application
- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions for all environments
- [Postman Collection](./POSTMAN_COLLECTION.json) - API requests for testing
- [Auth & Booking API quick reference](./backend/API_DOCS.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)