import React, { useRef } from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  const cartIconRef = useRef();

  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Link to="/" style={styles.logoText}>ЄВсьо.ua</Link>
        </div>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>🏠 Головна</Link>
          <Link to="/shop" style={styles.navLink}>🛍️ Крамниця</Link>

          {/* Корзина с ref */}
          <div ref={cartIconRef} style={{ position: "relative", display: "inline-block" }}>
            <Link to="/cart" style={styles.navLink}>🛒 Кошик</Link>
          </div>

          <Link to="/profile" style={styles.navLink}>👤 Профіль</Link>
          <Link to="/signup" style={styles.navLink}>📝 Реєстрація</Link>
          <Link to="/signin" style={styles.navLink}>🔑 Вхід</Link>
          <Link to="/admin" style={styles.adminButton}>🔧 Адмін</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <Outlet context={{ cartIconRef }} />
      </main>

      <footer style={styles.footer}>
        © 2025 ЄВсьо.ua. Всі права захищено.
      </footer>
    </div>
  );
}



const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#111",
    color: "#fff",
  },
  header: {
    background: "#222",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    borderBottom: "2px solid #333",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    color: "#61dafb",
    fontSize: "1.8rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  navLink: {
    background: "linear-gradient(45deg, #61dafb, #4a9ecf)",
    color: "#121212",
    textDecoration: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 10px rgba(97,218,251,0.4)",
  },
  adminButton: {
    background: "linear-gradient(45deg, #ff4b4b, #d32f2f)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 10px rgba(255, 0, 0, 0.4)",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  footer: {
    background: "#222",
    textAlign: "center",
    padding: "15px 0",
    fontSize: "0.9rem",
    color: "#aaa",
  },
};
