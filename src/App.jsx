import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AppProvider } from "./AppContext";
import { CartProvider } from "./views/Cartcontext/CartContext.jsx";

import Signup from "./views/Signup/Signup";
import Signin from "./views/Signin/Signin";
import Profile from "./views/Profile/Profile";
import Home from "./views/Home/Home";
import Admin from "./views/Admin";
import Shop from "./views/Shop/Shop";
import Category from "./views/Category/Category";
import Product from "./views/Product/Product";
import CartPage from "./views/Cart/CartPage";
import Layout from "./views/Layout/Layout";

function App() {
  return (
    <AppProvider>
      <CartProvider> {/* CartProvider должен быть над Router! */}
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AppProvider>
  );
}
  

export default App;