import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext.jsx";
const API_URL = "http://localhost:8081/Java_Web_211_war/";

function Profile() {
    const { user } = useContext(AppContext);

    useEffect(() => {
        console.log("🔍 Загружаем данные пользователя:", user);
    }, [user]);

    return user && Object.keys(user).length > 0 ? (
        <AuthView user={user} />
    ) : (
        <AnonView />
    );
}

function AuthView({ user }) {
    const { setUser, request } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        city: "",
        address: "",
        birthdate: "",
    });

    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setFormData({
                name: user.name || "",
                phone: user.phones?.[0] || "",  // Берем первый телефон, если есть
                city: user.city || "",
                address: user.address || "",
                birthdate: user.birthdate || "Немає",
                role: user.role || "Немає",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const saveChanges = async () => {
        const userId = user?.id || user?.user_id;  // ✅ Гарантируем, что ID есть
        if (!userId) {
            alert("❌ Помилка: ID користувача відсутній.");
            return;
        }

        const token = user?.token || localStorage.getItem("token");
        if (!token) {
            alert("❌ Помилка: Токен відсутній.");
            return;
        }

        const updatedUser = {
            name: formData.name || user.name,
            city: formData.city || user.city,
            address: formData.address || user.address,
            birthdate: formData.birthdate || user.birthdate,
            phones: formData.phone ? [formData.phone] : user.phones,
        };

        // Гарантированно удаляем `password`, если он вдруг там есть
        delete updatedUser.password;

        // Очищаем от `null` и `undefined`
        const cleanedUser = Object.fromEntries(
            Object.entries(updatedUser).filter(([_, v]) => v !== null && v !== undefined)
        );

        const requestUrl = `${API_URL}/users/${userId}`;
        console.log("=== 📝 Відправка даних ===");
        console.log("🔗 URL:", requestUrl);
        console.log("📤 Дані для відправки:", cleanedUser);
        console.log("🔑 Токен:", token);

        try {
            const response = await fetch(requestUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify(cleanedUser),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("❌ Сервер повернув помилку:", response.status, errorData);
                alert(`Помилка: ${response.status} - ${errorData}`);
                return;
            }

            const data = await response.json();
            console.log("✅ Дані успішно оновлені!", data);
            setUser(data);
            alert("Дані успішно збережені!");
        } catch (err) {
            console.error("❌ Помилка збереження даних:", err);
            alert("Помилка збереження. Перевірте сервер.");
        }
    };

    const deleteAccount = async () => {
        if (!window.confirm(" Ви впевнені, що хочете видалити акаунт?")) return;

        const userId = user?.id || user?.user_id;
        if (!userId) {
            alert("❌ Помилка: ID користувача відсутній.");
            return;
        }

        console.log("=== 🗑 Видалення акаунта ===");
        console.log(`🔗 DELETE /users/${userId}`);

        try {
            await request(`/users/${userId}`, { method: "DELETE" });
            console.log("✅ Акаунт успішно видалено");
            setUser(null);
            navigate("/");
        } catch (err) {
            console.error("❌ Помилка видалення акаунта:", err);
            alert("Помилка видалення. Можливо, сервер недоступний.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Мій профіль</h1>

            <div style={styles.infoBlock}>
                <p><strong>ID:</strong> {user?.id || user?.user_id}</p>
                <p><strong>Логін:</strong> {user?.login}</p>
                <p><strong>Email:</strong> {user?.emails?.[0] || "Немає"}</p>
                <p><strong>Роль:</strong> {user?.role || "Немає"}</p>
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
                    <label>Місто:</label>
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
            </div>

            <div style={styles.buttons}>
                <button onClick={saveChanges} style={styles.saveButton}>Зберегти</button>
                <button onClick={deleteAccount} style={styles.deleteButton}>Видалити акаунт</button>
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