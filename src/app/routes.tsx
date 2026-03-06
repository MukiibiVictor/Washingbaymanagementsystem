import { createBrowserRouter, RouterProvider } from 'react-router';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CheckInsPage from './pages/CheckInsPage';
import TransactionsPage from './pages/TransactionsPage';
import PricingPage from './pages/PricingPage';
import UsersPage from './pages/UsersPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilesPage from './pages/UserProfilesPage';
import ServicesPage from './pages/ServicesPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/auth-context';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'checkins',
        element: <CheckInsPage />,
      },
      {
        path: 'transactions',
        element: <TransactionsPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'user-profiles',
        element: <UserProfilesPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Root component that wraps the router with AuthProvider
export function RootRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
