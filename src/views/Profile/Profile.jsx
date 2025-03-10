import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
const Profile = () => {
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        birthdate: "Немає",
        role: "Немає",
    });

    // Проверяем авторизацию
    useEffect(() => {
        if (!user || !user.id) {
            console.warn("❌ Користувач не авторизований!");
            return;
        }

        console.log("🔍 Завантажуємо профіль:", user);

        setFormData({
            name: user.name || "",
            email: user.emails?.[0] || "",
            phone: user.phones?.[0] || "",
            city: user.city || "",
            address: user.address || "",
            birthdate: user.birthdate || "Немає",
            role: user.role || "Немає",
        });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
        if (!user || !user.id) {
            alert("❌ Ви не авторизовані!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Помилка: Токен відсутній.");
            return;
        }

        const updatedUser = {
            name: formData.name,
            city: formData.city,
            address: formData.address,
            birthdate: formData.birthdate,
            phones: formData.phone ? [formData.phone] : user.phones,
            emails: formData.email ? [formData.email] : user.emails,
        };

        try {
            const response = await fetch(`http://localhost:8081/Java_Web_211_war/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) throw new Error(`Помилка: ${response.status}`);

            const data = await response.json();
            setUser(data);
            alert("✅ Дані успішно збережені!");
        } catch (err) {
            console.error("❌ Помилка збереження даних:", err);
            alert("❌ Не вдалося зберегти зміни.");
        }
    };

    const deleteAccount = async () => {
        if (!window.confirm("🗑 Таки да? Ви дійсно хочете видалити акаунт?")) return;
    
        if (!user || !user.id) {
            alert("❌ Ви не авторизовані!");
            return;
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Помилка: Токен відсутній.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8081/Java_Web_211_war/users/${user.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
    
            // 🛑 Показуємо жарт перед виходом
            alert("✅ Акаунт успішно видалено.\n\nОдесит питає у друга:\n— Як справи?\n— Видалив акаунт...\n— Ну і дурень! Ти ж у мережі був як риба у воді! 🐟😂");
    
            navigate("/");
        } catch (err) {
            console.error("❌ Помилка видалення акаунта:", err);
            alert("❌ Не вдалося видалити акаунт.");
        }
    };
    

    
    if (!user || !user.id) {
        return (
            <div style={styles.container}>
                <h1 style={styles.greeting}>🌊 Ой, шось ви тут заблукали!</h1>
                <p style={styles.text}>
                    Шо ви робите в чужому профілі без реєстрації? 🙄  
                    Йдіть вже, реєструйтесь, бо мама казала: "Без реєстрації – ні риба, ні м’ясо!"
                </p>
                <button onClick={() => navigate("/signup")} style={styles.button}>
                    🚀 Зареєструватися
                </button>
                <button onClick={() => navigate("/")} style={styles.backButton}>
                    ⬅️ Повернутися на головну
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.greeting}>🎉 Вітаємо, {user.name}!</h1>
            <h2 style={styles.heading}>Мій профіль</h2>

            <div style={styles.formContainer}>
                <div style={styles.column}>
                    <label>Ім'я:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
                    <label>Телефон:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.column}>
                    <label>Місто:</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} style={styles.input} />
                    <label>Адреса:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} style={styles.input} />
                    <label>Дата народження:</label>
                    <input type="text" name="birthdate" value={formData.birthdate} onChange={handleChange} style={styles.input} />
                </div>
            </div>

            <p><strong>Роль:</strong> {formData.role}</p>

            <button onClick={saveChanges} style={styles.button}>💾 Зберегти</button>
            <button onClick={deleteAccount} style={styles.deleteButton}>🗑 Видалити акаунт</button>
            <button onClick={() => navigate("/")} style={styles.backButton}>⬅️ На головну</button>
        </div>
    );
};

/* 🎨 СТИЛІ */
const styles = {
    container: { maxWidth: "600px", margin: "40px auto", padding: "30px", backgroundColor: "#111", color: "#fff", textAlign: "center", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" },
    greeting: { fontSize: "2rem", color: "#FFD700", marginBottom: "10px" },
    heading: { fontSize: "2rem", color: "#61dafb", marginBottom: "20px" },
    text: { fontSize: "1.2rem", marginBottom: "20px", color: "#ccc" },
    input: { width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#222", color: "#fff", border: "1px solid #61dafb", fontSize: "16px", marginBottom: "10px" },
    button: { backgroundColor: "#61dafb", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", color: "#fff", fontSize: "16px", fontWeight: "bold", border: "none" },
    deleteButton: { backgroundColor: "#f44336", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", color: "#fff", fontSize: "16px", fontWeight: "bold", border: "none" },
    backButton: { backgroundColor: "#ffcc00", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", color: "#111", fontSize: "16px", fontWeight: "bold", border: "none", marginTop: "10px" },
};

export default Profile;