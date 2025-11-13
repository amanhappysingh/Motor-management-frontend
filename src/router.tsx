import { createBrowserRouter, redirect } from 'react-router-dom'
import UltraTechLogin from './pages/Login'
import { authGuard } from './utils/authGuard'
import { AdminLayout } from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users/Users'
import NotFound from './components/NotFound'
import AllMotors from './pages/Motors/AllMotors'
import MotorReports from './pages/Reports/Reports'
import QrCode from './pages/Reports/QrCode'
import Scan from './pages/Reports/Scane'



export const router = createBrowserRouter([
  {
    path: "/login",
    element: <UltraTechLogin />
  },
  {
    path: "/",
    element: <AdminLayout />,
    loader: () => authGuard(["admin"]), 
    children: [
      {
        index: true,      // / → dashboard
        element: <Dashboard />
      },
      {
        path: "users",   // /users
        element: <Users />
      },
      
      {
        path: "all-motors/:type",   // /users
        element: <AllMotors />
      },
      {
        path: "reports",   // /users
        element: <MotorReports />
      },
      {
        path: "motors/:motorId",   // /users
        element: <Scan />
      },
      {
        path: "*",       // any wrong route under admin
        element: <NotFound />
      }
    ]
  },
  { 
    path: "*",            // global wildcard
    element: <NotFound />,
    // loader: () => authGuard(["admin"])
  }
])
