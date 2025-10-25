# PortfolioAI - React Frontend

A React TypeScript web application for PortfolioAI, an AI-powered portfolio and job readiness suite.

## Features

- **Authentication System**: Login and registration with role-based access
- **User Dashboard**: For regular users (role pk: 2)
- **Admin Dashboard**: For super admins (role pk: 1)
- **Protected Routes**: Role-based route protection
- **API Integration**: Axios-based API client with token management
- **Responsive Design**: Built with Tailwind CSS

## Tech Stack

- React 19.2.0
- TypeScript
- React Router DOM
- Axios
- Tailwind CSS
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API Endpoints

The application integrates with the following backend endpoints:

- `POST /api/user/login/` - User login
- `POST /api/user/user-sign-up/` - User registration
- `POST /api/user/token/refresh/` - Token refresh

## User Roles

- **Super Admin** (role pk: 1): Access to admin dashboard with system management features
- **Regular User** (role pk: 2): Access to user dashboard with portfolio building features

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginForm.tsx    # Login form component
│   ├── RegisterForm.tsx # Registration form component
│   ├── UserDashboard.tsx # User dashboard
│   ├── AdminDashboard.tsx # Admin dashboard
│   └── ProtectedRoute.tsx # Route protection component
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── services/            # API services
│   └── api.ts          # Axios configuration
├── types/              # TypeScript type definitions
│   └── auth.ts         # Authentication types
├── App.tsx             # Main app component
├── index.css           # Global styles
└── index.tsx           # Entry point
```

## Features Implemented

### Authentication
- Login form with email/password
- Registration form with optional LinkedIn, GitHub, and resume file upload
- Token-based authentication with automatic refresh
- Role-based access control

### User Dashboard
- Portfolio builder access
- Resume generator
- Cover letter writer
- Job alerts setup
- Mock interview practice
- Analytics overview

### Admin Dashboard
- User management
- System analytics
- Settings configuration
- System logs
- AI model management
- Content management

## Development

### Available Scripts

- `yarn start` - Runs the app in development mode
- `yarn build` - Builds the app for production
- `yarn test` - Launches the test runner
- `yarn eject` - Ejects from Create React App (one-way operation)

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.