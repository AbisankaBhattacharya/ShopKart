import { useState } from "react";
import CartContext from "./CartContext";

function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    function addToCart(product) {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item._id === product._id
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                );
            }

            return [
                ...prevItems,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    }
    function increaseQuantity(productId) {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQuantity(productId) {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item._id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(productId) {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item._id !== productId)
        );
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;
