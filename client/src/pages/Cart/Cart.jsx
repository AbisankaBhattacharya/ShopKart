import { useContext } from "react";
import CartContext from "../../context/CartContext";

function Cart() {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useContext(CartContext);
    if (cartItems.length === 0) {
        return (
            <div className="container mt-5">
                <h2>Your Cart is Empty</h2>
            </div>
        );
    }

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="container mt-5">

            <h2 className="mb-4">
                Shopping Cart
            </h2>

            {cartItems.map((item) => (

                <div
                    key={item._id}
                    className="card mb-3"
                >
                    <div className="card-body d-flex justify-content-between align-items-center">

                        <div>
                            <h5>{item.name}</h5>

                            <p className="text-success">
                                ₹ {item.price.toLocaleString()}
                            </p>

                            <p>
                                Quantity : {item.quantity}
                            </p>
                        </div>

                        <div>

                            <button
                                className="btn btn-secondary me-2"
                                onClick={() => decreaseQuantity(item._id)}
                            >
                                -
                            </button>

                            <button
                                className="btn btn-secondary me-2"
                                onClick={() => increaseQuantity(item._id)}
                            >
                                +
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() => removeFromCart(item._id)}
                            >
                                Remove
                            </button>

                        </div>

                    </div>
                </div>

            ))}

            <h3 className="mt-4">
                Total : ₹ {total.toLocaleString()}
            </h3>

        </div>
    );
}

export default Cart;
