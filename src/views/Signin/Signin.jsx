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
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("✅ Авторизація успішна:", data);
        setUser(data); // ✅ Сохраняем пользователя в контекст
        navigate("/profile"); // ✅ Перенаправляем на профиль
      })
      .catch((error) => {
        console.error("❌ Помилка входу:", error);
        setResponseMessage("Невірний логін або пароль");
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Вхід</h1>
      <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логін" style={styles.input} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" style={styles.input} />
      <button onClick={sendForm} style={styles.button}>Увійти</button>
      {responseMessage && <p style={styles.response}>{responseMessage}</p>}
    </div>
  );
}

// ✅ Стили
const styles = {
  container: { textAlign: "center", padding: "20px" },
  heading: { fontSize: "2rem", color: "#61dafb" },
  input: { width: "300px", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "1px solid #444" },
  button: { backgroundColor: "#61dafb", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" },
  response: { color: "red", marginTop: "20px" },
};

export default Signin;