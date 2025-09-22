"use client";

import { useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="py-2 mb-6 bg-transparent hover:opacity-75 text-gray-900 cursor-pointer"
    >
      ← Вернуться в каталог
    </button>
  );
};

export default BackButton;