import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext.jsx";

// Validation Schema using Yup
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loginAs, setLoginAs] = useState("user");

  async function handleSubmit(values, { setSubmitting }) {
    setError("");

    try {
      // Login using context
      await login(values.email, values.password);

      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (loginAs === "admin") {
          if (payload.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            setError("This account is not an admin. Try logging in as a user.");
            return;
          }
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #9a4ce9ff, #f1f8e9)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Login</h3>
        <p style={{ textAlign: "center", color: "gray" }}>
          Welcome back! Please login.
        </p>

        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#842029",
              padding: "8px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Role selection */}
              <div style={{ marginBottom: "15px", textAlign: "center" }}>
                <label style={{ marginRight: "10px" }}>Login as:</label>
                <label style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    name="loginAs"
                    value="user"
                    checked={loginAs === "user"}
                    onChange={() => setLoginAs("user")}
                  />{" "}
                  User
                </label>
                <label>
                  <input
                    type="radio"
                    name="loginAs"
                    value="admin"
                    checked={loginAs === "admin"}
                    onChange={() => setLoginAs("admin")}
                  />{" "}
                  Admin
                </label>
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: "15px" }}>
                <label>Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: "red", fontSize: "14px" }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: "15px" }}>
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red", fontSize: "14px" }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#4c8bf5",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
