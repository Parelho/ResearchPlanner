import React from "react";
import Navbar from "./components/Navbar/index.jsx"
import Home from "./components/Home/index.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Researchers from "./components/Researchers/index.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden pr-2">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/researchers" element={<Researchers />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
