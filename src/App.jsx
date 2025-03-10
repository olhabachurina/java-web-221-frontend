import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./AppContext";

import Signup from "./views/Signup/Signup";
import Signin from "./views/Signin/Signin";
import Profile from "./views/Profile/Profile";
import Home from "./views/Home/Home";
import Admin from "./views/Admin";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;