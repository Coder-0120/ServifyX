import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'  
import ServicesPage from './Pages/servicesPage'

const App = () => {
  return (
    <>
    <Router>
      <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/services" element={<ServicesPage />} />

      </Routes>
    </Router>
    </>
  )
}

export default App