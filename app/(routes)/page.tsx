import getBillboards from "@/actions/get-billboards";
import getProducts from "@/actions/get-products";
import BillboardCarousel from "@/components/billboard-carousel";
import ProductList from "@/components/product-list";
import ScrollingBanner from "@/components/scrolling-banners";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
    const billboards = await getBillboards();
    const products = await getProducts({ isFeatured: true });

    return (
        <>
            <div className="flex justify-center">
                <BillboardCarousel billboards={billboards} />
            </div>

            <ScrollingBanner />
            <Container>
                <div className="space-y-10 pb-10">
                    <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 mt-20 w-[85vw] ">
                        <ProductList title="Новинки" items={products} />
                    </div>
                </div>
            </Container>
        </>
    );
}

export default HomePage;