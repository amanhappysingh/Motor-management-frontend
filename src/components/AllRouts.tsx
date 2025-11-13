import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'

import UltraTechLogin from '../pages/Login'
import { authGuard } from '../utils/authGuard'
import { AdminLayout } from './AdminLayout'
import Dashboard from '../pages/Dashboard'
import Users from '../pages/Users/Users'
import NotFound from './NotFound'

// root
export const rootRoute = createRootRoute({
  component: () => <Outlet />
})

// public
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login", // <-- no slash
  component: UltraTechLogin,
})

// protected admin layout
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "admin", // <-- no slash
  component: AdminLayout,
  loader: () => authGuard(["admin"])
})

// /admin  -> dashboard
export const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "", // index
  component: Dashboard,
})

// /admin/users
export const userRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "users", // <-- no slash
  component: Users,
})

// global not found
export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFound,
  loader: () => authGuard(["admin"]),
})
