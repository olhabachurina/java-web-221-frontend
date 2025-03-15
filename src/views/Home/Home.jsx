import React, { useEffect, useState } from "react";

const Home = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const themeStyles = {
    background: isDarkTheme
      ? "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
      : "linear-gradient(135deg, #fdfbfb, #ebedee)",
    color: isDarkTheme ? "#fff" : "#333",
  };

  return (
    <div style={{ ...styles.container, ...themeStyles }}>
      <div style={styles.logoContainer}>
        <h1 style={styles.logoText}>ЄВсьо.ua</h1>
        <p style={styles.subtitle}>Ласкаво просимо до нашого додатку!</p>
      </div>

      <div style={styles.videoContainer}>
        <video style={styles.video} autoPlay loop muted playsInline>
          <source src="/Untitled design.mp4" type="video/mp4" />
          Ваш браузер не підтримує відео.
        </video>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    transition: "all 0.4s ease",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  logoText: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#61dafb",
    textShadow: "0 0 20px rgba(97,218,251,1), 0 0 40px rgba(97,218,251,0.8)",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#fff",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
  },
  videoContainer: {
    width: "90%",
    maxWidth: "700px",
    margin: "20px 0",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #61dafb",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
  },
  video: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
  },
};

export default Home;