import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext.jsx";

export default function Category() {
  const { id } = useParams(); // slug
  const navigate = useNavigate();
  const { request } = useContext(AppContext);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [sortOption, setSortOption] = useState("");

  const BASE_URL = "http://localhost:8081/Java_Web_211_war";

  useEffect(() => {
    loadCategoryBySlug(id);
  }, [id]);

  const loadCategoryBySlug = async (slug) => {
    setLoadingCategory(true);
    try {
      const categoryData = await request(`/products?type=category&slug=${slug}`);
      setCategory(categoryData);
      if (categoryData?.categoryId) {
        await loadProductsByCategoryId(categoryData.categoryId);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Помилка при завантаженні категорії:", error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const loadProductsByCategoryId = async (categoryId) => {
    setLoadingProducts(true);
    try {
      const productsData = await request(`/products?type=paged&limit=50&offset=0&categoryId=${categoryId}`);
      setProducts(productsData);
    } catch (error) {
      console.error("❌ Помилка при завантаженні товарів:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Фільтрація продуктів
  const getSortedProducts = () => {
    let sortedProducts = [...products];

    switch (sortOption) {
      case "price_asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

    return sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const categoryImageUrl = category?.categoryImageId?.startsWith("http")
    ? category.categoryImageId
    : `${BASE_URL}/storage/${category?.categoryImageId}`;

  return (
    <div style={styles.container}>
      {loadingCategory ? (
        <div style={styles.skeletonCategory}></div>
      ) : (
        <>
          <h1 style={styles.title}>📂 {category.categoryTitle}</h1>

          <div style={styles.categoryInfo}>
            <img
              src={categoryImageUrl}
              alt={category.categoryTitle}
              style={styles.categoryImage}
            />
          </div>

          <p style={styles.description}>{category.categoryDescription}</p>

          <p style={styles.funDescription}>
            {`Ну шо я вам скажу... Це "${category.categoryTitle}" – така краса, шо аж дух захоплює! А ціни – як на Привозі, тільки не торгуйтесь! 😉`}
          </p>

          <p style={styles.totalProducts}>🔢 Загальна кількість товарів: {products.length}</p>

          <div style={styles.sortingBlock}>
            <label style={styles.sortLabel}>🔽 Сортувати:</label>
            <select onChange={handleSortChange} value={sortOption} style={styles.sortSelect}>
              <option value="">Без сортування</option>
              <option value="price_asc">Ціна: зростання</option>
              <option value="price_desc">Ціна: спадання</option>
              <option value="name_asc">Назва: A-Я</option>
              <option value="name_desc">Назва: Я-A</option>
            </select>
          </div>
        </>
      )}

      <h2 style={styles.subtitle}>🛍️ Товари у цій категорії</h2>

      <div style={styles.productsGrid}>
        {loadingProducts
          ? Array.from({ length: itemsPerPage }).map((_, idx) => (
              <div key={idx} style={styles.skeletonProduct}></div>
            ))
          : getSortedProducts().length > 0 ? (
              getSortedProducts().map((product) => (
                <div
                  key={product.productId}
                  style={styles.productCard}
                  onClick={() => handleProductClick(product.productId)}
                >
                  <img
                    src={`${BASE_URL}/storage/${product.imageId}`}
                    alt={product.name}
                    style={styles.productImage}
                  />
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productPrice}>💰 {product.price} грн</p>
                  <p style={styles.productStock}>📦 {product.stock} шт в наявності</p>
                  <p style={styles.productCode}>🏷️ Код товару: {product.code}</p>
                </div>
              ))
            ) : (
              <p>🤷‍♂️ Товарів поки немає!</p>
            )}
      </div>

      {/* Пагинация */}
      {!loadingProducts && products.length > itemsPerPage && (
        <div style={styles.pagination}>
          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              style={{
                ...styles.pageButton,
                ...(currentPage === index + 1 ? styles.activePageButton : {}),
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "36px",
    textAlign: "center",
    marginBottom: "20px",
  },
  categoryInfo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  categoryImage: {
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  },
  description: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "20px",
    marginBottom: "10px",
  },
  funDescription: {
    textAlign: "center",
    fontSize: "16px",
    fontStyle: "italic",
    color: "#007bff",
    marginBottom: "30px",
  },
  totalProducts: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "20px",
  },
  sortingBlock: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
    gap: "10px",
  },
  sortLabel: {
    fontSize: "16px",
  },
  sortSelect: {
    padding: "8px 12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  subtitle: {
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center",
  },
  productsGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  productCard: {
    width: "250px",
    padding: "15px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  productPrice: {
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  productStock: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "6px",
  },
  productCode: {
    fontSize: "14px",
    color: "#999",
  },
  skeletonCategory: {
    width: "300px",
    height: "300px",
    backgroundColor: "#eee",
    margin: "0 auto 20px auto",
    borderRadius: "10px",
    animation: "pulse 1.5s infinite",
  },
  skeletonProduct: {
    width: "250px",
    height: "320px",
    backgroundColor: "#eee",
    borderRadius: "12px",
    animation: "pulse 1.5s infinite",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    gap: "10px",
  },
  pageButton: {
    padding: "8px 16px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  activePageButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
  },
};

// Добавляем анимацию скелетона
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes pulse {
    0% { background-color: #eee; }
    50% { background-color: #ddd; }
    100% { background-color: #eee; }
  }
`, styleSheet.cssRules.length);
