import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-black border-t py-12 max-[500px]:px-7 max-[500px]:py-4 flex justify-center items-center">
            <div className="flex justify-between w-[80vw] max-[500px]:w-full max-[500px]:flex-col-reverse max-[500px]:gap-10">
                <div className="flex flex-col">
                    <p className="text-sm font-thin text-gray-300">ИП Рязанова Светлана Владимировна</p>
                    <p className="text-sm font-thin text-gray-300">105122, г.Москва, Щелковское шоссе, д. 19</p>
                    <p className="text-sm font-thin text-gray-300">+7 (905) 761-23-27</p>
                    <p className="text-sm font-thin text-gray-300 mt-8">&copy; 2025 LikeSvet. Все права защищены</p>
                </div>
                <div className="flex flex-col">
                    <Link href="/terms-and-conditions" className="text-xl text-gray-300 hover:text-white cursor-pointer">Условия и положения</Link>
                    <Link href="/terms-and-conditions#delivery-and-refund" className="text-xl text-gray-300 hover:text-white cursor-pointer">Доставка и возврат</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;