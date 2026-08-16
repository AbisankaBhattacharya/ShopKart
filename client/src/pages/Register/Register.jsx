import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../api/axios";
import useAuth from "../../hooks/useAuth";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (formValues.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters long";
    }

    if (!/^\S+@\S+\.\S+$/.test(formValues.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (formValues.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long";
    }

    if (formValues.password !== formValues.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
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
      await register({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      });
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Unable to create your account. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-7 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-4">Create an account</h2>
            {apiError && <div className="alert alert-danger">{apiError}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="register-name">Name</label>
                <input
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="register-name"
                  name="name"
                  onChange={handleChange}
                  value={formValues.name}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="register-email">Email</label>
                <input
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="register-email"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={formValues.email}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="register-password">Password</label>
                <input
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="register-password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formValues.password}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="register-confirm-password">Confirm password</label>
                <input
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  id="register-confirm-password"
                  name="confirmPassword"
                  onChange={handleChange}
                  type="password"
                  value={formValues.confirmPassword}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>
              <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </form>
            <p className="mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
