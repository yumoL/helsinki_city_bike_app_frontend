import React from "react"
import { Route, Routes } from "react-router-dom"
import "./App.css"
import Header from "./components/Header"
import FrontPage from "./components/FrontPage"
import StationList from "./components/StationList"
import SingleStation from "./components/SingleStation"
import JourneyList from "./components/JourneyList"
import DataUploader from "./components/DataUploader"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="App">
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <Routes>
          <Route exact path="/" element={<FrontPage />} />
          <Route path="/stations" element={<StationList />} />
          <Route path="/station/:sid" element={<SingleStation />} />
          <Route path="/journeys" element={<JourneyList />} />
          <Route path="/upload" element={<DataUploader />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
