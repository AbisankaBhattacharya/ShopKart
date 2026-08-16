import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../api/axios";
import useAuth from "../../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required";
    }

    if (!formValues.password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formValues);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Unable to log in. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-4">Login</h2>
            {apiError && <div className="alert alert-danger">{apiError}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="login-email">Email</label>
                <input
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="login-email"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={formValues.email}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="login-password">Password</label>
                <input
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="login-password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formValues.password}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-3 mb-0">
              New to ShopKart? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
