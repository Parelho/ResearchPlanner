import React from "react";
import Navbar from "./components/Navbar/index.jsx"
import Home from "./components/Home/index.jsx";
import { HashRouter, Routes, Route } from "react-router-dom";
import Researchers from "./components/Researchers/index.jsx";
import Login from "./components/Login/index.jsx";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/*"
          element={
            <div className="flex h-screen overflow-hidden pr-2">
              <Navbar />
              <div className="flex-1 overflow-y-auto p-2">
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/researchers" element={<Researchers />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;