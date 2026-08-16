import { Link } from 'react-router-dom';
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
function Navbar() {
const { cartItems } = useContext(CartContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand" to="/">
          ShopKart
        </Link>

        <div className="navbar-nav ms-auto">

          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/products">
            Products
          </Link>

          <Link className="nav-link" to="/cart">
            Cart ({cartItems.length})
          </Link>

          <Link className="nav-link" to="/login">
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;