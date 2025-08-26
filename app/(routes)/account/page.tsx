"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { updateCustomer } from "@/actions/update-profile";
import ImageUpload from "@/components/image-upload";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { redeemPromoCode } from "@/actions/redeem-code";

const AccountPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState(0);
  const [password, setPassword] = useState("");
  const [userImage, setUserImage] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formatBirthDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBirthDate(user.birthDate || "");
      setBalance(user.balance ?? 0);
      setUserImage(user.profileImage ? [user.profileImage] : []);
      setEmail(user.email || "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPhone((user as any).phone || "");
    }
  }, [user]);

  if (loading) return <Loader />;
  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCustomer({
        firstName,
        lastName,
        email,
        phone,
        password: password || undefined,
        profileImage: userImage[0] || undefined,
      });

      toast.success("✅ Профиль успешно обновлен");
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      console.error(error);
      toast.error("❌ Ошибка при обновлении профиля");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBirthDate(user.birthDate || "");
      setEmail(user.email || "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPhone((user as any).phone || "");
      setBalance(user.balance ?? 0);
      setUserImage(user.profileImage ? [user.profileImage] : []);
      setPassword("");
      setPromoCode("");
      setShowPassword(false);
      toast.info("🔄 Данные сброшены");
    }
  };


  const handleActivatePromo = async () => {
    if (!promoCode) return;

    try {
      if (!user?.token) throw new Error("Необхоидмо авторизоваться");

      const res = await redeemPromoCode(promoCode, user.token);

      // prendi il balance corretto dal user ritornato
      const newBalance = Number(res.user.balance ?? 0);

      setBalance(newBalance);
      const increment = (res.user.balance - balance) / 100;
      toast.success(`🎁 Промокод активирован +${increment}₽`);
      setPromoCode("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "❌ Ошибка при активации промокода");
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full bg-gray-200 shadow-sm py-4 px-6">
        <h1 className="text-lg font-semibold text-gray-700">Мой профиль</h1>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center flex-1 pt-10 px-6 py-5 bg-white">
        {/* Foto utente con ImageUpload */}
        <div className="flex flex-col items-center mb-10 w-full max-w-5xl relative">
          {/* Cerchio colorato attorno all'immagine */}
          <div className="relative">
            <div className="rounded-full p-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500">
              <div className="rounded-full overflow-hidden w-32 h-32">
                <ImageUpload
                  value={userImage}
                  onChange={(url) => setUserImage([url])}
                />
              </div>
            </div>
            {/* Percentuale in basso centrale */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-black text-white text-sm px-4 py-1 rounded-md min-w-max">
              Твоя скидка: 3%
            </div>
          </div>
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
              <label className="block text-sm font-bold text-gray-700">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                className="mt-1 w-full border rounded-none px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Дата рождения</label>
              <input
                type="text"
                value={formatBirthDate(birthDate)}
                readOnly
                className="mt-1 w-full border rounded-none px-3 py-2 bg-gray-100 text-gray-600 cursor-auto font-light"
              />
            </div>
          </aside>

          {/* Colonna destra */}
          <section className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">Телефон</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Введите телефон"
                className="mt-1 w-full border rounded-none px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Новый пароль</label>
              <div className="relative mt-1 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                  className="w-full border rounded-none px-3 py-2 pr-10 focus:ring-2 focus:ring-black focus:outline-none font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Баланс</label>
              <input
                type="text"
                value={`${balance / 100} ₽`}
                readOnly
                className="mt-1 w-full border rounded-none px-3 py-2 bg-gray-100 text-gray-600 cursor-auto font-light"
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
              className={`px-5 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition font-light w-full md:w-auto cursor-pointer ${saving ? "opacity-50 cursor-not-allowed" : ""
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

export default AccountPage;