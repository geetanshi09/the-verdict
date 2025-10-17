import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
// import ObjectDetection from './components/ObjectDetection';
import ObjectDetectionDemo from './components/ObjectDetectionDemo';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="main-content"
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/detection" element={<ObjectDetectionDemo />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
