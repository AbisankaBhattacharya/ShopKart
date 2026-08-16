import { Link } from "react-router-dom";
import { useContext } from "react";
import CartContext from "../../context/CartContext";
function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    return (
        <div className="card h-100 shadow-sm">
            <Link to={`/products/${product._id}`}>
                <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                />
            </Link>
            <div className="card-body">
                <Link to={`/products/${product._id}`}>
                    <h5>{product.name}</h5>

                    <p className="text-success fw-bold">
                        ₹ {product.price.toLocaleString()}
                    </p>
                </Link>
                <button
                    className="btn btn-primary w-100"
                    onClick={() => addToCart(product)}
                >
                    Add To Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
