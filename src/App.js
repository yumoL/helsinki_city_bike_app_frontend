import React from 'react'
import './App.css'
import Header from './components/Header'
import DataUploader from './components/DataUploader'
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <DataUploader />
      </div>
      
      <Footer />
    </div>
  )
}

export default App
