import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.jpg";
import NavbarActions from "@/components/navbar-actions";
import { getGiftProductId } from "@/actions/get-gift-product";

export const revalidate = 0;

const Navbar = async () => {
    const giftProductId = await getGiftProductId();

    return (
        <div className="border-none w-full fixed top-0 left-0 z-50 bg-white">
            <Container>
                <div className="relative px-4 lg:px-8 flex h-26 items-center w-full max-[500px]:px-0 max-[750px]:justify-between">
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex gap-x-2 max-[750px]:static max-[750px]:translate-x-0" >
                        <Image src={Logo} alt="logo" priority className="w-[200px] max-[750px]:w-[150px]" />
                    </Link>
                    <NavbarActions giftProductId={giftProductId} />
                </div>
            </Container>
        </div>
    );
};

export default Navbar;