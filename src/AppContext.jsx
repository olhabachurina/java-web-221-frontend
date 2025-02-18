import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
        fetch("http://localhost:8081/user/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${savedToken}` }
        })
        .then(response => response.json())
        .then(data => {
          console.log("📥 Полученные данные:", data); // Проверяем JSON от сервера
          setUser({
              ...data,
              id: data.user_id,  // ✅ Преобразуем user_id → id
              token: savedToken
          });
      })
        .catch(error => console.error("❌ Ошибка загрузки пользователя:", error));
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;