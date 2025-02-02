import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

function App() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [emails, setEmails] = useState([""]);
  const [phones, setPhones] = useState([""]);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

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

  const handleRegistration = () => {
    console.log("Виконання валідації форми...");
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log("Помилки форми:", errors);
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    console.log("Всі поля пройшли валідацію. Дані для відправлення:", {
      name,
      login,
      emails,
      phones,
      city,
      address,
      birthdate,
      password,
    });

    const userData = {
      name,
      login,
      emails,
      phones,
      city,
      address,
      birthdate,
      password,
    };
console.log("Отправляемые данные:", JSON.stringify(userData));
    console.log("Відправлення запиту на сервер...");
    fetch("http://localhost:8081/Java_Web_211_war/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log("Відповідь сервера отримано:", response);
        if (!response.ok) {
          throw new Error(`HTTP Помилка: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Результат обробки сервера:", data);
        setResponseMessage(data.message || "Реєстрація успішна!");
      })
      .catch((error) => {
        console.error("Помилка запиту:", error);
        setResponseMessage("Помилка при відправленні запиту: " + error.message);
      });
  };

  const handleAddField = (setter, array) => {
    setter([...array, ""]);
    console.log("Додано нове поле:", array);
  };

  const handleRemoveField = (setter, array, index) => {
    const updatedArray = array.filter((_, i) => i !== index);
    setter(updatedArray);
    console.log(`Поле видалено. Поточний список:`, updatedArray);
  };

  const handleFieldChange = (setter, array, index, value) => {
    const updatedArray = [...array];
    updatedArray[index] = value;
    setter(updatedArray);
    console.log(`Поле оновлено:`, updatedArray);
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
            onChange={(e) =>
              handleFieldChange(setEmails, emails, index, e.target.value)
            }
            placeholder="Email"
            style={styles.input}
          />
          <button
            onClick={() => handleRemoveField(setEmails, emails, index)}
            style={styles.removeButton}
          >
            -
          </button>
        </div>
      ))}
      <button
        onClick={() => handleAddField(setEmails, emails)}
        style={styles.addButton}
      >
        + Додати email
      </button>
      {formErrors.emails && <p style={styles.error}>{formErrors.emails}</p>}

      <h3 style={styles.subHeading}>Телефони:</h3>
      {phones.map((phone, index) => (
        <div key={index} style={styles.row}>
          <input
            type="text"
            value={phone}
            onChange={(e) =>
              handleFieldChange(setPhones, phones, index, e.target.value)
            }
            placeholder="Телефон"
            style={styles.input}
          />
          <button
            onClick={() => handleRemoveField(setPhones, phones, index)}
            style={styles.removeButton}
          >
            -
          </button>
        </div>
      ))}
      <button
        onClick={() => handleAddField(setPhones, phones)}
        style={styles.addButton}
      >
        + Додати телефон
      </button>
      {formErrors.phones && <p style={styles.error}>{formErrors.phones}</p>}

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
      {formErrors.confirmPassword && (
        <p style={styles.error}>{formErrors.confirmPassword}</p>
      )}

      <button onClick={handleRegistration} style={styles.button}>
        Зареєструватися
      </button>

      {responseMessage && <p style={styles.response}>{responseMessage}</p>}
    </div>
  );
}


// Dark Theme Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#ffffff",
    padding: "20px",
  },
  heading: {
    fontSize: "2rem",
    color: "#61dafb",
    marginBottom: "20px",
  },
  input: {
    width: "300px",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#61dafb",
    color: "#121212",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
  },
  addButton: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginBottom: "10px",
  },
  removeButton: {
    backgroundColor: "#f44336",
    color: "#ffffff",
    padding: "5px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    marginLeft: "10px",
  },
  error: {
    color: "#f44336",
    fontSize: "12px",
  },
  response: {
    color: "#4caf50",
    marginTop: "20px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  subHeading: {
    fontSize: "1.5rem",
    color: "#ffffff",
    marginTop: "20px",
    marginBottom: "10px",
  },
};

export default App;