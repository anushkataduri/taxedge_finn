import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Login = lazy(() => import('./pages/Login/Login'))
const Register = lazy(() => import('./pages/Register/Register'))
const OTP = lazy(() => import('./pages/OTP/OTP'))
const Passcode = lazy(() => import('./pages/Passcode/Passcode'))
const CreateProfile = lazy(() => import('./pages/CreateProfile/CreateProfile'))

export const authenticationRoutes: RouteObject[] = [
  { path: routePaths.auth.login, element: <Login /> },
  { path: routePaths.auth.register, element: <Register /> },
  { path: routePaths.auth.otp, element: <OTP /> },
  { path: routePaths.auth.passcode, element: <Passcode /> },
  { path: routePaths.auth.createProfile, element: <CreateProfile /> },
]
