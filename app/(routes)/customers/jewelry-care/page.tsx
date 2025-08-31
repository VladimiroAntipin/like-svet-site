import Link from 'next/link';

const JewelryCarePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center pt-30 bg-gradient-to-br from-white via-pink-50 to-rose-100 text-gray-800 p-6">
            <div className="max-w-2xl text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-wide">
                    Скоро открытие
                </h1>
                <p className="text-lg sm:text-xl mb-8 text-gray-600">
                    Страница в разработке.
                </p>
                <Link href="/">
                    <p className="inline-block px-6 py-3 bg-rose-500 text-white rounded-xl shadow-md hover:bg-rose-600 transition">
                        На главную
                    </p>
                </Link>
            </div>
        </div>
    );
}

export default JewelryCarePage;