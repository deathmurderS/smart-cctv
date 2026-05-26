import * as Sentry from "@sentry/react";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cameras from './pages/Cameras'
import Events from './pages/Events'
import Map from './pages/Map'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

const PageTracker = () => {
  const location = useLocation()
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname })
  }, [location])
  return null
}

const App = () => {
  return (
    <Sentry.ErrorBoundary fallback={<p>Terjadi kesalahan. Silakan refresh halaman.</p>}>
      <BrowserRouter>
        <PageTracker />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/cameras" element={<PrivateRoute><Cameras /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  )
}

export default Sentry.withProfiler(App)