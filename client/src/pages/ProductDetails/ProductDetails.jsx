import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import CartContext from "../../context/CartContext";
import { getApiErrorMessage } from "../../api/axios";
import productApi from "../../api/productApi";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        let isActive = true;

        const loadProduct = async () => {
            try {
                const loadedProduct = await productApi.getProductById(id);

                if (isActive) {
                    setProduct(loadedProduct);
                    setError("");
                    setIsNotFound(false);
                }
            } catch (requestError) {
                if (isActive) {
                    if (requestError.response?.status === 404) {
                        setIsNotFound(true);
                    } else {
                        setError(getApiErrorMessage(requestError, "Unable to load this product."));
                    }
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            isActive = false;
        };
    }, [id]);

    if (isLoading) {
        return <p className="mt-5">Loading product...</p>;
    }

    if (isNotFound) {
        return <h2>Product Not Found</h2>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">

                <div className="col-md-6">
                    <img
                        src={product.image}
                        className="img-fluid"
                        alt={product.name}
                    />
                </div>

                <div className="col-md-6">

                    <h2>{product.name}</h2>

                    <h3 className="text-success">
                        ₹ {product.price.toLocaleString()}
                    </h3>

                    <button className="btn btn-primary mt-3" onClick={() => addToCart(product)}>
                        Add To Cart
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductDetails;
