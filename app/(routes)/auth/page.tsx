"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // stato visibilità password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login effettuato");
    } else {
      console.log("Registrazione effettuata");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col px-6 py-12">
      {/* Tabs */}
      <div className="flex justify-center gap-12 mb-12">
        <button
          onClick={() => setIsLogin(true)}
          className={`pb-2 text-xl font-medium cursor-pointer ${
            isLogin
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Вход
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`pb-2 text-xl font-medium cursor-pointer ${
            !isLogin
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Регистрация
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full mx-auto space-y-6"
      >
        {!isLogin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                required
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Фамилия</label>
              <input
                type="text"
                required
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Дата рождения
              </label>
              <input
                type="date"
                required
                className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
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
        </div>

        {/* Conferma password solo in registrazione */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Повторите пароль
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
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
          </div>
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
