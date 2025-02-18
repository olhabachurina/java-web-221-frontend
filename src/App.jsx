import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContext from "./AppContext.jsx"; 
import Signup from "./views/Signup/Signup";
import Signin from "./views/Signin/Signin";
import Profile from "./views/Profile/Profile";
import Home from "./views/Home/Home";

function App() {
  const [user, setUser] = useState(null);

  function request(url, conf) {
    return new Promise((resolve, reject) => {
      fetch(url, conf)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  return (
    <AppContext.Provider value={{ user, setUser, request }}> {/* ✅ Добавлен request */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
export default App;