// app/(routes)/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-800 px-4 mt-25">
      <h1 className="text-6xl font-extrabold mb-4 text-pink-600 animate-pulse">404</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
        Упс! Страница не найдена
      </h2>
      <p className="text-center mb-8 max-w-md">
        Страница, которую вы ищете, не существует, была удалена или ссылка неверна.
        Посмотрите наши коллекции и найдите свой стиль!
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition"
      >
        Вернуться на главную
      </Link>

      {/* Decorazione semplice con cerchi colorati */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <span className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-300 rounded-full animate-bounce"></span>
        <span className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
}
