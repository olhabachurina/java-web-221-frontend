import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";

function Signin() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const sendForm = async () => {
    const cleanLogin = loginValue.trim();
    const cleanPassword = password.trim();

    if (!cleanLogin || !cleanPassword) {
      setResponseMessage("❌ Логін і пароль обов'язкові!");
      return;
    }

    console.log("➡️ Попытка входа с:");
    console.log("Логин:", cleanLogin);
    console.log("Пароль:", cleanPassword);

    const credentials = btoa(`${cleanLogin}:${cleanPassword}`);
    console.log("➡️ Base64 Credentials:", credentials);

    setIsLoading(true);
    setResponseMessage("");

    try {
      const response = await fetch("http://localhost:8081/Java_Web_211_war/login", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`➡️ Ответ сервера: ${response.status}`);

      const resultText = await response.text();

      let result;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error("❌ Ответ не JSON:", resultText);
        setResponseMessage("❌ Некорректный ответ от сервера");
        return;
      }

      if (!response.ok) {
        console.error("❌ Ошибка авторизации:", result);
        setResponseMessage(`❌ ${result.error || "Ошибка входа"}`);
        setPassword("");
        return;
      }

      console.log("✅ Авторизация успешна:", result);

      if (result.token) {
        login(result.token);
        navigate("/profile");
      } else {
        setResponseMessage("⚠️ Сервер не вернул токен");
      }

    } catch (error) {
      console.error("❌ Сетевая ошибка:", error);
      setResponseMessage("❌ Не удалось соединиться с сервером");
    } finally {
      setIsLoading(false);
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
        style={{
          ...styles.input,
          borderColor: responseMessage && !loginValue ? "#ff4c4c" : "#61dafb",
        }}
        onKeyDown={handleKeyDown}
      />

      <div style={styles.passwordContainer}>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          style={{
            ...styles.input,
            borderColor: responseMessage && !password ? "#ff4c4c" : "#61dafb",
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
          type="button"
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>

      <button
        onClick={sendForm}
        style={{
          ...styles.button,
          backgroundColor: !loginValue || !password ? "#555" : "#61dafb",
          cursor: !loginValue || !password || isLoading ? "not-allowed" : "pointer",
        }}
        disabled={!loginValue || !password || isLoading}
      >
        {isLoading ? "⏳ Входимо..." : "🚀 Увійти"}
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
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#FFD700",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #61dafb",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
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
    transition: "background-color 0.3s ease, cursor 0.3s ease",
  },
  errorMessage: {
    color: "#ff4c4c",
    marginTop: "10px",
    fontSize: "14px",
    transition: "opacity 0.3s ease",
  },
};

export default Signin;
