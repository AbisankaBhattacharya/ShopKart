import { Link, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import CartContext from "../../context/CartContext";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

          {isAuthenticated ? (
            <>
              <span className="navbar-text text-white-50 px-2">
                {user.name} ({user.email})
              </span>
              <button className="btn btn-link nav-link" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
