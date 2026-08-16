import ProductCard from "../../components/product/ProductCard";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../api/axios";
import productApi from "../../api/productApi";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const productList = await productApi.getProducts();

        if (isActive) {
          setProducts(productList);
        }
      } catch (requestError) {
        if (isActive) {
          setError(getApiErrorMessage(requestError, "Unable to load products."));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Latest Products
      </h2>

      {isLoading && <p>Loading products...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && products.length === 0 && (
        <p className="text-muted">No products are available right now.</p>
      )}

      <div className="row">
        {!isLoading && !error && products.map((product) => (

          <div
            className="col-md-3 mb-4"
            key={product._id}
          >
            <ProductCard product={product} />
          </div>

        ))}

      </div>

    </div>
  );
}

export default Home;
