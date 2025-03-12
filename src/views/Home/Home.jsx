import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// Хук для подключения CSS-стилей
const useInjectStyles = (css) => {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, [css]);
};

const keyframesCSS = `
  @keyframes floatRocket {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  @keyframes glowText {
    from { text-shadow: 0 0 20px rgba(97,218,251,1), 0 0 40px rgba(97,218,251,0.8); }
    to { text-shadow: 0 0 30px rgba(97,218,251,1), 0 0 50px rgba(97,218,251,0.9); }
  }
  @keyframes rotateLogo {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
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
    boxShadow: "0 4px 15px rgba(97,218,251,0.4)",
    minWidth: "180px",
    textAlign: "center",
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
    boxShadow: "0 4px 15px rgba(255, 0, 0, 0.4)",
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
    marginBottom: "30px",
  },
  logoText: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#61dafb",
    textShadow: "0 0 20px rgba(97,218,251,1), 0 0 40px rgba(97,218,251,0.8)",
    letterSpacing: "2px",
    animation: "glowText 2s infinite alternate",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#fff",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
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
  kramnytsyaContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  kramnytsyaButton: {
    padding: "10px 20px",
    textDecoration: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "16px",
  },
};

const Home = () => {
  useInjectStyles(keyframesCSS);

  return (
    <div style={styles.container}>
     
      <div style={styles.buttonContainer}>
        <Link to="/signup" style={styles.button}>Перейти до реєстрації</Link>
        <Link to="/signin" style={styles.button}>Перейти до входу</Link>
        <Link to="/profile" style={styles.button}>Мій профіль</Link>
        <Link to="/admin" style={styles.adminButton}>🔧 Адмін-панель</Link>
      </div>

    
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

    
      <div style={styles.kramnytsyaContainer}>
        <Link to="/shop" style={styles.kramnytsyaButton}>🛒 Крамниця</Link>
      </div>
    </div>
  );
};

export default Home;