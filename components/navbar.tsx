import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.jpg";
import MainNav from "@/components/main-nav";
import getCategories from "@/actions/get-categories";
import NavbarActions from "@/components/navbar-actions";

export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <div className="border-none w-full fixed top-0 left-0 z-50 bg-white">
            <Container>
                <div className="relative px-4 lg:px-8 flex h-26 items-center w-full max-[500px]:px-0">
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex gap-x-2" >
                        <Image src={Logo} alt="logo" className="w-[200px] max-[500px]:w-[150px]" />
                    </Link>
                    {/*<MainNav data={categories}/>*/}
                    <NavbarActions />
                </div>
            </Container>
        </div>
    );
};

export default Navbar;