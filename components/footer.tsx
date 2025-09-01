import Link from "next/link";
import Image from "next/image";
import AlfaBank from "@/public/alfa-bank-logo.png";
import PayMethod from "@/public/pay-method.png";

const Footer = () => {
    return (
        <footer className="bg-black border-t py-12 max-[500px]:px-7 max-[500px]:py-4 flex justify-center items-center max-[780px]:mt-10">
            <div className="flex flex-col w-[80vw] max-[500px]:w-full gap-12">
                <div className="flex justify-between max-[1100px]:flex-col-reverse max-[1100px]:gap-10">
                    <div className="flex flex-col">
                        <p className="text-sm font-thin text-gray-300">ИП Рязанова Светлана Владимировна</p>
                        <p className="text-sm font-thin text-gray-300">105122, г.Москва, Щелковское шоссе, д. 19</p>
                        <p className="text-sm font-thin text-gray-300">+7 (905) 761-23-27</p>
                        <p className="text-sm font-thin text-gray-300 mt-auto max-[1100px]:mt-6">&copy; 2025 LikeSvet. Все права защищены</p>
                    </div>
                    <div className="flex flex-col">
                        <Link href="/terms-and-conditions" className="text-medium font-thin text-gray-300 hover:text-white cursor-pointer">Условия и положения</Link>
                        <Link href="/terms-and-conditions#delivery-and-refund" className="text-medium font-thin text-gray-300 hover:text-white cursor-pointer">Доставка и возврат</Link>

                        {/* Sezione pagamento Alfa-Bank */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-thin text-gray-300 mt-6 max-[1100px]:mt-12">
                                Оплата банковскими картами осуществляется через АО «АЛЬФА-БАНК».
                            </p>
                            <Image
                                src={AlfaBank}
                                alt="Alfa-Bank Logo"
                                width={120}
                                height={40}
                                className="object-contain"
                            />

                            <p className="text-sm font-thin text-gray-300 mt-2">
                                К оплате принимаются карты VISA, MasterCard, МИР.
                            </p>
                            <Image
                                src={PayMethod}
                                alt="Card Logos"
                                width={200}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;