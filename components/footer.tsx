const Footer = () => {
    return (
        <footer className="bg-black border-t p-10">
            <div className="flex justify-between w-full max-[500px]:flex-col-reverse max-[500px]:gap-10">
                <div className="flex flex-col">
                    <p className="text-xl text-gray-300">ИП Рязанова Светлана Владимировна</p>
                    <p className="text-xl text-gray-300">105122, г.Москва, Щелковское шоссе, д. 19</p>
                    <p className="text-xl text-gray-300">+7 (905) 761-23-27</p>
                    <p className="text-sm text-gray-300 mt-8">&copy; 2025 LikeSvet. Все права защищены</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-xl text-gray-300">Условия и положения</p>
                    <p className="text-xl text-gray-300">Доставка и возврат</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;