import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext"; // Импортируем контекст

function Signin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const sendForm = () => {
    let credentials = btoa(`${login}:${password}`);

    fetch("http://localhost:8081/Java_Web_211_war/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("✅ Авторизація успішна:", data);

        if (data.token) {
          setUser({ ...data, token: data.token });
          localStorage.setItem("token", data.token);
        } else {
          setUser(data);
        }

        navigate("/profile");
      })
      .catch((error) => {
        console.error("❌ Помилка входу:", error);
        setResponseMessage("❌ Невірний логін або пароль!");
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Вхід</h1>
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Логін"
        style={styles.input}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        style={styles.input}
      />
      <button onClick={sendForm} style={styles.button}>Увійти</button>
      {responseMessage && <p style={styles.errorMessage}>{responseMessage}</p>}
    </div>
  );
}

// ✅ Обновленные стили
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#000", // Черный фон
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#61dafb", // Ярко-синий цвет заголовка
    marginBottom: "20px",
  },
  input: {
    width: "280px",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "2px solid #61dafb", // Голубая рамка
    backgroundColor: "#111", // Темный фон полей ввода
    color: "#61dafb", // Голубой текст
    fontSize: "1rem",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#61dafb", // Голубая кнопка
    color: "#000",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.2rem",
    border: "none",
    marginTop: "15px",
    transition: "0.3s",
  },
  errorMessage: {
    color: "red",
    fontSize: "1.2rem",
    marginTop: "15px",
    backgroundColor: "#222", // Темный фон для выделения ошибки
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid red",
    animation: "shake 0.3s ease-in-out",
  },
};

export default Signin;