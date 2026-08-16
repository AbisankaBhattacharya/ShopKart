import { useParams } from "react-router-dom";
import products from "../../data/product";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext)
    const product = products.find((item) => item.id === Number(id));

    if (!product) {
        return <h2>Product Not Found</h2>;
    }

    return (
        <div className="container mt-5">
            <div className="row">

                <div className="col-md-6">
                    <img
                        src={product.image}
                        className="img-fluid"
                        alt={product.title}
                    />
                </div>

                <div className="col-md-6">

                    <h2>{product.title}</h2>

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