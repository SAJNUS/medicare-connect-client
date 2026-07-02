# MediCare Connect (Client)

## Project Overview
MediCare Connect is a comprehensive healthcare appointment and management platform designed to connect patients with medical professionals. The platform provides a seamless experience for finding doctors, booking consultations, managing schedules, handling prescriptions, and processing secure payments. It incorporates distinct role-based interfaces for Patients, Doctors, and Administrators to ensure tailored functionality for each user type.

## Features
- Firebase authentication (Email/Password + Google Login)
- JWT-based protected routes
- Role-based dashboards
- Doctor discovery and filtering
- Appointment booking, rescheduling, cancellation, and payment workflow
- Stripe payment integration
- Patient reviews and prescriptions
- Doctor schedule and prescription management
- Admin management modules
- Notifications, loading states, custom 404 page, and responsive layouts

## Technologies Used

| Category | Technology |
|---|---|
| Framework | React (Vite) |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| UI/Animation | Framer Motion |
| Authentication | Firebase Auth |
| Payment Gateway | Stripe (React Stripe.js) |
| State Management | React Context API |
| HTTP Client | Axios |
| Alerts/Notifications | React Hot Toast |
| Icons | React Icons |

## Folder Structure

```
src/
├── api/                # Axios instances and API configurations
├── assets/             # Static images and resources
├── components/         # Reusable React components
│   ├── appointments/   # Appointment specific components
│   ├── dashboard/      # Dashboard layouts and sidebar
│   ├── payment/        # Stripe checkout and payment components
│   └── shared/         # Common UI components (Navbar, Modals, Footer)
├── context/            # Context API definitions
├── firebase/           # Firebase initialization and configuration
├── hooks/              # Custom React hooks (useAuth, etc.)
├── layouts/            # Primary application layouts
├── pages/              # Application views
│   ├── About/          # About page
│   ├── Contact/        # Contact page
│   ├── Dashboard/      # Role-specific dashboard views
│   ├── DoctorDetails/  # Individual doctor profiles
│   ├── FindDoctors/    # Doctor discovery and search
│   ├── Home/           # Landing page
│   ├── Login/          # Authentication entry
│   ├── NotFound/       # 404 Error page
│   └── Register/       # User registration
├── providers/          # Context providers (AuthProvider)
├── routes/             # Route definitions and ProtectedRoute logic
├── services/           # External service integrations
└── utils/              # Helper functions and utilities
```

## Installation

1. Clone the repository and navigate to the project directory:
```bash
git clone <repository-url>
cd medicare-connect-client
```

2. Install the necessary dependencies:
```bash
npm install
```

3. Configure the environment variables (see below).

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory based on the following template:

```env
VITE_API_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles and bundles the application for production.
- `npm run preview`: Serves the production build locally for testing.

## Build & Deployment
To prepare the application for production deployment, run `npm run build`. The resulting optimized static files will be generated in the `dist` folder. These files can be deployed to any static hosting service such as Vercel, Netlify, or Firebase Hosting. Ensure that the hosting provider is configured to redirect all unmatched routes to `index.html` to support client-side routing.

## Authentication & Authorization Flow
The application utilizes a dual-layer authentication and authorization system. Firebase handles the primary authentication (Email/Password and Google OAuth), providing instantaneous user validation. Upon successful authentication, the backend generates a JWT (JSON Web Token) which is stored securely on the client. All protected API requests append this token to the Authorization header to verify identity and role permissions at the server level. The client-side routing incorporates a `ProtectedRoute` wrapper to restrict dashboard access strictly to authenticated and authorized users based on their assigned roles.

## Dashboard Roles

### Patient
- View personal profile and update information
- Browse and filter available doctors
- Book, reschedule, and cancel appointments
- Process payments securely via Stripe
- View payment history
- Access medical prescriptions
- Submit doctor reviews

### Doctor
- Manage daily availability and schedule
- Review incoming appointment requests (Approve/Reject)
- Mark appointments as completed
- Generate and manage digital patient prescriptions
- Review patient feedback and ratings

### Admin
- Manage registered users across all roles
- Verify doctor credentials and approve registrations
- Monitor system-wide financial transactions and payments
- Issue refunds for cancelled or failed consultations
- Access overview statistics and analytics

## Responsive Design Support
The client application is built with a mobile-first approach using Tailwind CSS. All components, from the public landing pages to the complex dashboard data tables, are fully responsive. The navigation adapts to a drawer-style menu on smaller screens, and data-heavy tables transition to readable stacked cards to ensure usability across mobile devices, tablets, and desktop monitors.

## Live Demo
[Insert Live Demo Link Here]

## Related Backend Repository
[Insert Backend Repository Link Here]

## Author
[Insert Author Name/Details Here]
