import { useState } from 'react'
import './App.css'
import GameInterface from './components/GameInterface'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Categories from './components/Categories.jsx';

function App() {


  return (
    <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<GameInterface />} />
                    <Route path="/categories" element={<Categories />} />
                </Routes>
            </div>
        </Router>
  )
}

export default App
