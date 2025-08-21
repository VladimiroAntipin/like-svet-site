"use client";

import { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { updateCustomer } from "@/actions/update-profile"; // <-- importa la funzione

const AccountPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // stati form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [balance, setBalance] = useState(0);
  const [password, setPassword] = useState("");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [saving, setSaving] = useState(false);

  const formatBirthDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // 🚨 redirect se non loggato
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  // Popola i dati del form quando l'utente è caricato
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBirthDate(user.birthDate || "");
      setBalance(user.balance ?? 0);
      setUserImage(user.profileImage || null);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (!user) return null; // evita flash della pagina

const handleSave = async () => {
  setSaving(true);
  try {
    await updateCustomer({
      firstName,
      lastName,
      password: password || undefined, // invia solo se è stato cambiato
      // birthDate è opzionale, puoi rimuoverlo se non vuoi permettere aggiornamento
    });

    alert("Профиль успешно обновлен");
    setPassword("");
  } catch (error) {
    console.error(error);
    alert("Ошибка при обновлении профиля");
  } finally {
    setSaving(false);
  }
};

  const handleReset = () => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBirthDate(user.birthDate || "");
      setBalance(user.balance ?? 0);
      setPassword("");
      setPromoCode("");
    }
  };

  const handleActivatePromo = () => {
    if (!promoCode) return;
    console.log("Активировать промокод:", promoCode);
    setBalance((prev) => prev + 100);
    setPromoCode("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full bg-gray-200 shadow-sm py-4 px-6">
        <h1 className="text-lg font-semibold text-gray-700">Мой профиль</h1>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center flex-1 pt-10 px-6 py-5 bg-white">
        {/* Foto utente */}
        <div className="flex justify-center mb-10">
          {userImage ? (
            <Image
              src={userImage}
              alt="User"
              className="w-32 h-32 rounded-full object-cover shadow"
              width={128}
              height={128}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow">
              <UserIcon className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>

        {/* Layout due colonne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl">
          {/* Colonna sinistra */}
          <aside className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">Имя</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Введите имя"
                className="mt-1 w-full border rounded-none px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Фамилия</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Введите фамилию"
                className="mt-1 w-full border rounded-none px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Дата рождения</label>
              <input
                type="text"
                value={formatBirthDate(birthDate)}
                readOnly
                className="mt-1 w-full border rounded-none px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed font-light"
              />
            </div>
          </aside>

          {/* Colonna destra */}
          <section className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">Новый пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите новый пароль"
                className="mt-1 w-full border rounded-none px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Баланс</label>
              <input
                type="text"
                value={`${balance} ₽`}
                readOnly
                className="mt-1 w-full border rounded-none px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Промокод</label>
              <div className="flex gap-3 mt-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Введите промокод"
                  className="flex-1 border rounded-none px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none font-light"
                />
                <button
                  onClick={handleActivatePromo}
                  className="px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition font-light cursor-pointer"
                >
                  Активировать
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-col max-[500px]:flex-col max-[500px]:gap-3 max-[500px]:mb-10 md:flex-row justify-between items-center w-full max-w-5xl mt-10">
          <Link
            href="/account/my-orders"
            className="px-5 py-2 bg-black text-white text-center rounded-none hover:bg-gray-800 transition font-light w-full md:w-auto"
          >
            Мои заказы
          </Link>

          <div className="flex max-[500px]:flex-col max-[500px]:gap-3 max-[500px]:mt-8 md:flex-row gap-4 w-full md:w-auto mt-3 md:mt-0">
            <button
              onClick={handleReset}
              className="px-5 py-2 border rounded-none hover:bg-gray-100 transition font-light w-full md:w-auto cursor-pointer"
            >
              Сбросить
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-5 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition font-light w-full md:w-auto cursor-pointer ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage
