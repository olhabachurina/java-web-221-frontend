import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext.js";

function Profile() {
  const { user } = useContext(AppContext);

  useEffect(() => {
    console.log("Загружаем данные пользователя:", user);
  }, [user]);

  return user && Object.keys(user).length > 0
    ? <AuthView user={user} />
    : <AnonView />;
}

function AuthView({ user }) {
  const { setUser, request } = useContext(AppContext);
  const navigate = useNavigate();

  // Локальный стейт для полей, которые можно редактировать
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    birthdate: "",
    role: "",
  });

  // Заполняем поля, когда user загрузился
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      console.log("Заполняем профиль:", user);
      setFormData({
        name: user.name || "",
        phone: user.phones?.length > 0 ? user.phones[0] : "",
        city: user.city || "",
        address: user.address || "",
        birthdate: user.birthdate || "Немає",
        role: user.role || "Немає",
      });
    }
  }, [user]);

  // Обработчик изменений в полях
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Сохранить изменения
  const saveChanges = () => {
    const updatedUser = {
      ...user,
      ...formData,
      phones: formData.phone ? [formData.phone] : [],
    };
  
    console.log(" Отправка данных на сервер:", updatedUser);
  
    request(`/user/${user.user_id || user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((data) => {
        console.log(" Дані збережено:", data);
        setUser(data);
        alert(" Дані успішно збережені!");
      })
      .catch((err) => console.error(" Помилка збереження:", err));
  };

  // Удалить аккаунт
  const deleteAccount = () => {
    if (!window.confirm("⚠ Ви впевнені, що хочете видалити акаунт?")) return;

    request(`/user/${user.user_id || user.id}`, { method: "DELETE" })
      .then(() => {
        console.log(" Акаунт видалено успішно");
        setUser(null);
        navigate("/");
      })
      .catch((err) => console.error("Помилка видалення:", err));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Мій профіль</h1>

      <div style={styles.infoBlock}>
        <p><strong>ID:</strong> {user.user_id || user.id}</p>
        <p><strong>Логін:</strong> {user.login}</p>
        <p><strong>Email:</strong> {user?.emails?.length > 0 ? user.emails[0] : "Немає"}</p>
        <p>
          <strong>Email підтверджено:</strong>
          {user.isEmailConfirmed ? "  Так" : "  Ні"}
        </p>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label>Ім'я:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Телефон:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label>Город:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Введіть місто"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Адреса:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Введіть адресу"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.infoBlock}>
        <p><strong>Дата народження:</strong> {formData.birthdate}</p>
        <p>
          <strong>Дата реєстрації:</strong>
          {user.registrationDate
            ? new Date(user.registrationDate).toLocaleDateString()
            : "Немає"}
        </p>
        <p>
          <strong>Роль:</strong>{" "}
          <input
            type="text"
            value={formData.role}
            readOnly
            style={styles.readOnly}
          />
        </p>
      </div>

      <div style={styles.buttons}>
        <button onClick={saveChanges} style={styles.saveButton}>
          Зберегти
        </button>
        <button onClick={deleteAccount} style={styles.deleteButton}>
          Видалити акаунт
        </button>
      </div>
    </div>
  );
}

function AnonView() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Доступ заборонено</h1>
      <p>Авторизуйтесь для перегляду профілю</p>
    </div>
  );
}


const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "10px",
    color: "#fff",
    boxShadow: "0 0 30px rgba(0,0,0,0.8)",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#61dafb",
    textShadow: "1px 1px 4px rgba(97, 218, 251, 0.6)",
  },
  infoBlock: {
    margin: "20px 0",
    lineHeight: "1.8",
  },
  formRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "15px",
  },
  formGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #61dafb",
    backgroundColor: "#121212",
    color: "#fff",
    outline: "none",
    transition: "border 0.3s ease",
  },
  readOnly: {
    width: "150px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid gray",
    backgroundColor: "#333",
    color: "#aaa",
    textAlign: "center",
    marginLeft: "10px",
    cursor: "not-allowed",
  },
  buttons: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  saveButton: {
    backgroundColor: "#61dafb",
    color: "#121212",
    border: "none",
    padding: "14px 28px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "transform 0.2s ease",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "transform 0.2s ease",
  },
};

// Добавляем эффект при наведении (лучше через CSS, но для примера — inline)
styles.saveButton[":hover"] = {
  transform: "scale(1.05)",
};
styles.deleteButton[":hover"] = {
  transform: "scale(1.05)",
};

export default Profile;