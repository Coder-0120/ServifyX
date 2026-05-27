import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'  
import ServicesPage from './Pages/servicesPage'
import ProviderDashboard from './Pages/ProviderDashboard'
import CreateProviderProfile from './Pages/CreateProviderProfile'
import TrackBookings from './Pages/TrackBookings'
const App = () => {
  return (
    <>
    <Router>
      <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/create-provider-profile" element={<CreateProviderProfile />} />
      <Route path="/track-bookings" element={<TrackBookings />} />


      </Routes>
    </Router>
  </>
  )
}

export default App