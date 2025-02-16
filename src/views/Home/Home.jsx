import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Головна сторінка</h1>
      <p style={styles.description}>Ласкаво просимо до нашого додатку!</p>
      <div style={styles.buttonContainer}>
        <Link to="/signup" style={styles.button}>Перейти до реєстрації</Link>
        <Link to="/signin" style={styles.button}>Перейти до входу</Link>
        <Link to="/profile" style={styles.button}>Мій профіль</Link> {/* ✅ Новая кнопка */}
      </div>
    </div>
  );
}

// ✅ Вернул оригинальные стили
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212", // Темный фон
    color: "#ffffff", // Белый текст
    padding: "20px",
  },
  heading: {
    fontSize: "2rem",
    color: "#61dafb",
    marginBottom: "20px",
  },
  description: {
    fontSize: "1.2rem",
    textAlign: "center",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    gap: "15px",
  },
  button: {
    backgroundColor: "#61dafb", // Голубой цвет кнопок
    color: "#121212", // Черный текст на кнопках
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
    textDecoration: "none", // ✅ Убираем подчеркивание у ссылок
    display: "inline-block",
  },
};

export default Home;