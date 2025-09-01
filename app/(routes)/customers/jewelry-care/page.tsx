import Image from "next/image";

const JewelryCarePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br text-gray-800">
            <div className="max-w-5xl mx-auto px-6 py-16 max-[500px]:py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-black tracking-wide">
                            Правила ухода за украшениями
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                            ДЛЯ ТОГО ЧТОБЫ ВАШИ ЛЮБИМЫЕ УКРАШЕНИЯ ПРОСЛУЖИЛИ ВАМ НАМНОГО ДОЛЬШЕ,
                            ВАЖНО ПРИДЕРЖИВАТЬСЯ ПРОСТЫХ ПРАВИЛ УХОДА И НОШЕНИЯ.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <Image
                            src="/cares.jpg"
                            alt="Jewelry care"
                            width={600}
                            height={400}
                            className="rounded-none shadow-lg object-cover w-full"
                        />
                    </div>
                </div>

                {/* Rules */}
                <div className="mt-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                    <ol className="space-y-4 text-gray-700 text-lg leading-relaxed list-decimal list-inside">
                        <li>
                            Украшения желательно хранить в закрытом и сухом месте, т.к. при длительном
                            воздействии света тон украшений может слегка меняться.
                        </li>
                        <li>
                            Кладите украшения так, чтобы они не соприкасались друг с другом, и твердой поверхностью,
                            во избежании царапин.
                        </li>
                        <li>
                            Не распыляйте духи, лаки для волос или дезодоранты, когда бижутерия уже надета на вас.
                        </li>
                        <li>
                            Снимайте бижутерию перед купанием (особенно в соленой воде или в бассейнах),
                            перед посещением бани и сауны.
                        </li>
                        <li>
                            Для ухода за бижутерией не используйте абразивные чистящие средства.
                        </li>
                        <li>
                            Время от времени протирайте вашу бижутерию фланелью.
                        </li>
                        <li>
                            Удалять жир с изделий необходимо, вымыв их в теплой воде и высушив.
                        </li>
                        <li>
                            Бижутерию стоит снимать во время занятий спортом и перед сном, чтобы избежать деформации.
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default JewelryCarePage;
