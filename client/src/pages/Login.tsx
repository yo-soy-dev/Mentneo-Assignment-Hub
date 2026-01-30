import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const submit = async () => {
    try {
      const res = await axios.post("/auth/login", form);

      const token: string = res.data.token;
      const role: "mentor" | "student" = res.data.user.role;

      loginUser(token, role);

      if (role === "mentor") {
        navigate("/mentor");
      } else {
        navigate("/student");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl text-sky-500 font-extrabold mb-6 text-center">
          Welcome Back
        </h2>

         <div className="flex flex-col gap-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={submit}
          className="w-full bg-sky-500 text-white py-2 rounded mt-3"
        >
          Login
        </button>
        </div>

        <p className="text-sm text-center mt-4">
          New here?{" "}
          <Link to="/register" className="text-sky-500">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
