import React, { useRef, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import { CartContext } from "../Cartcontext/CartContext"; 
import "./Layout.css";

export default function Layout() {
  const cartIconRef = useRef();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { totalItems, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  // ➡️ Підказка в залежності від стану кошика
  const tooltipText =
    totalItems > 0
      ? `🛒 У кошику ${totalItems} товарів на суму ${totalPrice} грн.`
      : "🛒 Кошик порожній";

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div className={`layout ${theme}`}>
      <header className="header">
        <div className="logo">
          <Link to="/" className="logoText">ЄВсьо.ua</Link>
        </div>

        <nav className="nav">
          <Link to="/" className="navLink">🏠 Головна</Link>
          <Link to="/shop" className="navLink">🛍️ Крамниця</Link>

          {/* ➡️ Віджет кошика з кількістю */}
          <div
            ref={cartIconRef}
            onClick={handleCartClick}
            title={tooltipText}
            style={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            <span className="navLink">
              🛒 Кошик
              <span style={styles.counter}>({totalItems})</span>
            </span>
          </div>

          <Link to="/profile" className="navLink">👤 Профіль</Link>
          <Link to="/signup" className="navLink">📝 Реєстрація</Link>
          <Link to="/signin" className="navLink">🔑 Вхід</Link>
          <Link to="/admin" className="adminButton">🔧 Адмін</Link>

          {/* Тема: День / Ніч */}
          <button onClick={toggleTheme} className="themeToggleBtn">
            {theme === "day" ? "🌞 Світлий режим" : "🌙 Темний режим"}
          </button>
        </nav>
      </header>

      <main className="main">
        <Outlet context={{ cartIconRef }} />
      </main>

      <footer className="footer">
        © 2025 ЄВсьо.ua. Всі права захищено.
      </footer>
    </div>
  );
}

const styles = {
  counter: {
    marginLeft: "5px",
    fontWeight: "bold",
    color: "#ff5722",
  },
};