import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes floatRocket {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }

      @keyframes glowText {
        from { text-shadow: 0 0 20px rgba(97, 218, 251, 1), 0 0 40px rgba(97, 218, 251, 0.8); }
        to { text-shadow: 0 0 30px rgba(97, 218, 251, 1), 0 0 50px rgba(97, 218, 251, 0.9); }
      }

      @keyframes fadeBridge {
        from { opacity: 0.7; transform: scale(1); }
        to { opacity: 1; transform: scale(1.1); }
      }

      @keyframes rotateLogo {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      {/* Кнопки навигации */}
      <div style={styles.buttonContainer}>
  <Link to="/signup" style={styles.button}>Перейти до реєстрації</Link>
  <Link to="/signin" style={styles.button}>Перейти до входу</Link>
  <Link to="/profile" style={styles.button}>Мій профіль</Link>
  <Link to="/admin" style={styles.adminButton}>🔧 Адмін-панель</Link> {/* Новий елемент */}
</div>


      {/* Логотипы */}
      <div style={styles.logos}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg" 
          alt="Java Logo" 
          style={styles.logo}
        />
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" 
          alt="JavaScript Logo" 
          style={{ ...styles.logo, animation: "rotateLogo 5s linear infinite reverse" }} 
        />
      </div>

      {/* Логотип CodeBridge */}
      <div style={styles.logoContainer}>
        <h1 style={styles.logoText}>ЄВсьо.ua</h1>
        <p style={styles.subtitle}>Ласкаво просимо до нашого додатку!</p>
      </div>

      {/* Видео вместо баннера */}
      <div style={styles.videoContainer}>
      <video style={styles.video} autoPlay loop muted playsInline>
  <source src="/Untitled design.mp4" type="video/mp4" />
  Ваш браузер не поддерживает видео.
</video>
      </div>

      {/* Место для категорий товаров */}
      <div style={styles.categoriesPlaceholder}>
        <p>🛍 Тут будуть категорії товарів</p>
      </div>
    </div>
  );
}

/* 🎨 Оптимизированные стили */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center",
    animation: "fadeIn 1.5s ease-in-out",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    padding: "10px",
    marginBottom: "30px",
  },
  button: {
    background: "linear-gradient(45deg, #61dafb, #4a9ecf)",
    color: "#121212",
    border: "none",
    borderRadius: "30px",
    padding: "12px 25px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    textDecoration: "none",
    display: "inline-block",
    boxShadow: "0 4px 15px rgba(97, 218, 251, 0.4)",
    minWidth: "180px",
    textAlign: "center",
  },
  logos: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  logo: {
    width: "70px",
    height: "auto",
    opacity: "0.8",
    animation: "rotateLogo 5s linear infinite",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: "30px",
  },
  logoText: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#61dafb",
    textShadow: "0 0 20px rgba(97, 218, 251, 1), 0 0 40px rgba(97, 218, 251, 0.8)",
    letterSpacing: "2px",
    animation: "glowText 2s infinite alternate",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#ffffff",
    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
  },
  videoContainer: {
    width: "80%",
    maxWidth: "600px",
    margin: "20px 0",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #61dafb",
  },
  video: {
    width: "100%",
    borderRadius: "8px",
  },
  adminButton: {
    background: "linear-gradient(45deg, #ff4b4b, #d32f2f)",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "12px 25px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    textDecoration: "none",
    display: "inline-block",
    boxShadow: "0 4px 15px rgba(255, 0, 0, 0.4)",
    minWidth: "180px",
    textAlign: "center",
  },
  categoriesPlaceholder: {
    height: "100px",
    backgroundColor: "#1b2c44",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    color: "#ccc",
    border: "2px dashed #61dafb",
    width: "80%",
    maxWidth: "600px",
    marginTop: "20px",
  },
};

export default Home;