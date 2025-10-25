# 🚗 Vehicle Rental Booking System

A full-stack vehicle rental management system with a modern React frontend and Node.js/Express backend.

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

## 🚀 Quick Start (Docker)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle-rental-app
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs
   - Prisma Studio: http://localhost:5555

## 🛠 Manual Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 Documentation

- [API Documentation](http://localhost:3001/api-docs) (available after starting the backend)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

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