import React, { useState } from "react";
import confetti from "canvas-confetti"; // Импорт конфетти



const Signup = () => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [emails, setEmails] = useState([""]);
  const [phones, setPhones] = useState([""]);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Для вывода ответа сервера и ошибок формы
  const [responseMessage, setResponseMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Валидация формы
  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Ім'я є обов'язковим.";
    if (!login) errors.login = "Логін є обов'язковим.";
    if (emails.some((email) => !email.includes("@"))) {
      errors.emails = "Кожен email повинен бути коректним.";
    }
    if (phones.some((phone) => phone.length < 10)) {
      errors.phones = "Кожен телефон повинен містити щонайменше 10 цифр.";
    }
    if (!city) errors.city = "Місто є обов'язковим.";
    if (!address) errors.address = "Адреса є обов'язковою.";
    if (!birthdate) errors.birthdate = "Дата народження є обов'язковою.";
    if (!password || password.length < 6) {
      errors.password = "Пароль повинен містити щонайменше 6 символів.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Паролі не збігаються.";
    }
    return errors;
  };

  // Отправка данных на сервер
  const handleRegistration = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const userData = {
      name,
      login,
      emails,
      phones,
      city,
      address,
      birthdate,
      password
    };

    // 🔎 Подробное логирование
    console.log("🔎 [Registration] Current form data:");
    console.log("   name:", name);
    console.log("   login:", login);
    console.log("   emails:", emails);
    console.log("   phones:", phones);
    console.log("   city:", city);
    console.log("   address:", address);
    console.log("   birthdate:", birthdate);
    console.log("   password (len):", password.length); // не печатаем сам пароль в лог, но можно
    console.log("🔎 Сформированный userData:", userData);

    const requestUrl = "http://localhost:8081/Java_Web_211_war/register";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    console.log("🔎 [Registration] Параметры запроса fetch:", requestUrl, requestOptions);

    // Выполняем запрос
    fetch(requestUrl, requestOptions)
      .then((response) => {
        console.log("🔎 [Registration] Ответ от сервера:", response); // объект Response
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ [Registration] JSON-ответ сервера:", data);
        setResponseMessage(data.message || "Реєстрація пройшла успішно!");

        // Если хотите визуализировать успех
        if (typeof confetti === "function") {
          confetti(); // Запуск конфетти 🎉
        }
      })
      .catch((error) => {
        console.error("❌ [Registration] Ошибка запроса:", error);
        setResponseMessage("Помилка реєстрації. Деталі в консолі браузера.");
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Реєстрація</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ім'я"
        style={styles.input}
      />
      {formErrors.name && <p style={styles.error}>{formErrors.name}</p>}

      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Логін"
        style={styles.input}
      />
      {formErrors.login && <p style={styles.error}>{formErrors.login}</p>}

      <h3 style={styles.subHeading}>Електронні адреси:</h3>
      {emails.map((email, index) => (
        <div key={index} style={styles.row}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              const newEmails = [...emails];
              newEmails[index] = e.target.value;
              setEmails(newEmails);
            }}
            placeholder="Email"
            style={styles.input}
          />
          <button
            onClick={() => setEmails(emails.filter((_, i) => i !== index))}
            style={styles.removeButton}
          >
            -
          </button>
        </div>
      ))}
      <button
        onClick={() => setEmails([...emails, ""])}
        style={styles.addButton}
      >
        + Додати email
      </button>

      <h3 style={styles.subHeading}>Телефони:</h3>
      {phones.map((phone, index) => (
        <div key={index} style={styles.row}>
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              const newPhones = [...phones];
              newPhones[index] = e.target.value;
              setPhones(newPhones);
            }}
            placeholder="Телефон"
            style={styles.input}
          />
          <button
            onClick={() => setPhones(phones.filter((_, i) => i !== index))}
            style={styles.removeButton}
          >
            -
          </button>
        </div>
      ))}
      <button
        onClick={() => setPhones([...phones, ""])}
        style={styles.addButton}
      >
        + Додати телефон
      </button>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Місто"
        style={styles.input}
      />
      {formErrors.city && <p style={styles.error}>{formErrors.city}</p>}

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Адреса"
        style={styles.input}
      />
      {formErrors.address && <p style={styles.error}>{formErrors.address}</p>}

      <input
        type="date"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        style={styles.input}
      />
      {formErrors.birthdate && <p style={styles.error}>{formErrors.birthdate}</p>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        style={styles.input}
      />
      {formErrors.password && <p style={styles.error}>{formErrors.password}</p>}

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Підтвердьте пароль"
        style={styles.input}
      />
      {formErrors.confirmPassword && <p style={styles.error}>{formErrors.confirmPassword}</p>}

      <button onClick={handleRegistration} style={styles.button}>
        Зареєструватися
      </button>

      {responseMessage && <p style={styles.response}>{responseMessage}</p>}
    </div>
  );
};


// Стили
const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", padding: "20px" },
  heading: { fontSize: "2rem", color: "#61dafb", marginBottom: "20px" },
  input: { width: "300px", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "1px solid #444", backgroundColor: "#1e1e1e", color: "#ffffff" },
  button: { backgroundColor: "#61dafb", color: "#121212", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", marginTop: "20px" },
  error: { color: "#f44336", fontSize: "12px" },
  response: { color: "#4caf50", marginTop: "20px" },
};

export default Signup;