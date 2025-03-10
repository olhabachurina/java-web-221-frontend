import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";

function Signin() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const sendForm = async () => {
    if (!loginValue || !password) {
      setResponseMessage("❌ Логін і пароль обов'язкові!");
      return;
    }

    const credentials = btoa(`${loginValue}:${password}`);

    try {
      const response = await fetch("http://localhost:8081/Java_Web_211_war/login", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error(`❌ Помилка сервера: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Авторизація успішна:", data);

      if (data.token) {
        login(data.token);
        navigate("/profile");
      } else {
        throw new Error("⚠️ Сервер не повернув токен!");
      }
    } catch (error) {
      console.error("❌ Помилка входу:", error);
      setResponseMessage("❌ Невірний логін або пароль!");
      setPassword("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendForm();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔐 Вхід</h1>

      <input
        type="text"
        value={loginValue}
        onChange={(e) => setLoginValue(e.target.value)}
        placeholder="Логін"
        style={styles.input}
        onKeyDown={handleKeyDown}
      />

      <div style={styles.passwordContainer}>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          style={styles.input}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>

      <button onClick={sendForm} style={styles.button}>
        🚀 Увійти
      </button>

      {responseMessage && <p style={styles.errorMessage}>{responseMessage}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#111",
    color: "#fff",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  },
  heading: { fontSize: "2rem", marginBottom: "20px", color: "#FFD700" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #61dafb",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "16px",
  },
  passwordContainer: { position: "relative", display: "flex", alignItems: "center" },
  showPasswordButton: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#61dafb",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#61dafb",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  errorMessage: { color: "#ff4c4c", marginTop: "10px", fontSize: "14px" },
};

export default Signin;