"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Loader from "@/components/loader";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

const AuthPage = () => {
  const { loading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(() => {
    const mode = searchParams.get("mode");
    return mode !== "register";
  });

  useEffect(() => {
    const mode = searchParams.get("mode");
    setIsLogin(mode !== "register");
  }, [searchParams]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetErrors = () => {
    setFieldErrors({});
    setGeneralError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Rimuovi l'errore specifico per questo campo quando l'utente inizia a digitare
    if (fieldErrors[e.target.name]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[e.target.name];
      setFieldErrors(newErrors);
    }
    setGeneralError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.password) newErrors.password = "Поле обязательно для заполнения";

    if (!isLogin) {
      // Validazione registrazione
      if (!form.firstName) newErrors.firstName = "Поле обязательно для заполнения";
      if (!form.lastName) newErrors.lastName = "Поле обязательно для заполнения";
      if (!form.birthDate) newErrors.birthDate = "Поле обязательно для заполнения";
      if (!form.phone) newErrors.phone = "Поле обязательно для заполнения";
      else if (!phoneRegex.test(form.phone)) newErrors.phone = "Неверный формат номера";

      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Поле обязательно для заполнения";
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }

      if (!form.email) newErrors.email = "Поле обязательно для заполнения";
      else if (!emailRegex.test(form.email)) newErrors.email = "Неверный формат email";
    } else {
      // Validazione login
      if (!form.identifier) {
        newErrors.identifier = "Введите email или номер телефона";
      } else if (!emailRegex.test(form.identifier) && !phoneRegex.test(form.identifier)) {
        newErrors.identifier = "Неверный формат email или телефона";
      }
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        await login({
          identifier: form.identifier,
          password: form.password,
        });
        router.push("/");
      } else {
        await register({
          firstName: form.firstName,
          lastName: form.lastName,
          birthDate: form.birthDate,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        toast.success("Регистрация успешна 🎉");
        router.push("/auth?mode=login");
      }

      setForm({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        phone: "",
        identifier: "",
        password: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // ✅ Gestione chiara degli errori
      let message = "Ошибка авторизации";

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }

      if (message.toLowerCase().includes("invalid credentials")) {
        setFieldErrors({ identifier: "Нет такого пользователя", password: " " });
      } else if (message.toLowerCase().includes("wrong password")) {
        setFieldErrors({ password: "Неправильный пароль" });
      } else if (message.toLowerCase().includes("пользователь с этим email/номером телефона уже существует")) {
        setFieldErrors({ email: "Пользователь с таким email уже существует" });
      } else {
        setGeneralError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col px-6 py-12">
      {/* Tabs */}
      <div className="flex justify-center gap-12 mb-12">
        <button
          onClick={() => { setIsLogin(true); resetErrors(); router.replace("/auth?mode=login"); }}
          className={`pb-2 text-xl font-medium cursor-pointer ${isLogin ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"}`}
        >
          Вход
        </button>
        <button
          onClick={() => { setIsLogin(false); resetErrors(); router.replace("/auth?mode=register"); }}
          className={`pb-2 text-xl font-medium cursor-pointer ${!isLogin ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"}`}
        >
          Регистрация
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Фамилия</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none ${fieldErrors.lastName ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {fieldErrors.lastName && <p className="text-red-600 text-sm mt-1">{fieldErrors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Имя и Отчество</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none ${fieldErrors.firstName ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {fieldErrors.firstName && <p className="text-red-600 text-sm mt-1">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Дата рождения</label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                autoComplete="bday"
                className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none ${fieldErrors.birthDate ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {fieldErrors.birthDate && <p className="text-red-600 text-sm mt-1">{fieldErrors.birthDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Телефон</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none ${fieldErrors.phone ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {fieldErrors.phone && <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
                className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none ${fieldErrors.email ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
            </div>
          </div>
        )}

        {isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Email или Телефон</label>
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              autoComplete="username"
              className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none ${fieldErrors.identifier ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {fieldErrors.identifier && <p className="text-red-600 text-sm mt-1">{fieldErrors.identifier}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black cursor-pointer"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && fieldErrors.password !== " " && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
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
                autoComplete="new-password"
                className={`w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none pr-10 ${fieldErrors.confirmPassword ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black cursor-pointer"
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {generalError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm font-medium">{generalError}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 hover:bg-gray-800 transition text-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {isLogin ? "Вход..." : "Регистрация..."}
            </div>
          ) : isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;