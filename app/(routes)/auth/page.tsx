"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Loader from "@/components/loader";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthPage = () => {
  const { loading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inizializza isLogin in base al query param 'mode'
  const [isLogin, setIsLogin] = useState(() => {
    const mode = searchParams.get("mode");
    return mode === "register" ? false : true;
  });

  // Aggiorna isLogin se il query param cambia
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") setIsLogin(false);
    else setIsLogin(true);
  }, [searchParams]);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setFieldErrors({});
    setGeneralError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    resetErrors();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = "Поле обязательно для заполнения";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!form.password) {
      newErrors.password = "Поле обязательно для заполнения";
    }

    if (!isLogin) {
      if (!form.firstName) newErrors.firstName = "Поле обязательно для заполнения";
      if (!form.lastName) newErrors.lastName = "Поле обязательно для заполнения";
      if (!form.birthDate) newErrors.birthDate = "Поле обязательно для заполнения";

      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Поле обязательно для заполнения";
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        router.push("/"); // vai alla home dopo login
      } else {
        await register({
          firstName: form.firstName,
          lastName: form.lastName,
          birthDate: form.birthDate,
          email: form.email,
          password: form.password,
        });
        toast.success("Регистрация успешна 🎉"); // toast registrazione
        router.push("/auth?mode=login"); // forza il tab login
      }

      setForm({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.message || "Ошибка авторизации";

      if (message.toLowerCase().includes("invalid credentials")) {
        setEmailError("Нет такого пользователя");
      } else if (message.toLowerCase().includes("wrong password")) {
        setPasswordError("Неправильный пароль");
      } else if (message.toLowerCase().includes("user already exists")) {
        setEmailError("Пользователь с таким email уже существует");
      } else {
        setGeneralError(message);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col px-6 py-12">
      {/* Tabs */}
      <div className="flex justify-center gap-12 mb-12">
        <button
          onClick={() => {
            setIsLogin(true);
            resetErrors();
            router.replace("/auth?mode=login"); // aggiorna query param
          }}
          className={`pb-2 text-xl font-medium cursor-pointer ${isLogin
            ? "border-b-2 border-black text-black"
            : "text-gray-500 hover:text-black"
            }`}
        >
          Вход
        </button>
        <button
          onClick={() => {
            setIsLogin(false);
            resetErrors();
            router.replace("/auth?mode=register");
          }}
          className={`pb-2 text-xl font-medium cursor-pointer ${!isLogin
            ? "border-b-2 border-black text-black"
            : "text-gray-500 hover:text-black"
            }`}
        >
          Регистрация
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
              {fieldErrors.firstName && (
                <p className="text-red-600 text-sm">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Фамилия</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
              {fieldErrors.lastName && (
                <p className="text-red-600 text-sm">{fieldErrors.lastName}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Дата рождения</label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
              {fieldErrors.birthDate && (
                <p className="text-red-600 text-sm">{fieldErrors.birthDate}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
          {(emailError || fieldErrors.email) && (
            <p className="text-red-600 text-sm">{emailError || fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {(passwordError || fieldErrors.password) && (
            <p className="text-red-600 text-sm">{passwordError || fieldErrors.password}</p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Повторите пароль</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-red-600 text-sm">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {generalError && (
          <p className="text-red-600 text-sm font-medium">{generalError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 hover:bg-gray-800 transition text-lg cursor-pointer"
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;