import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

interface ProductPageProps {
    params: {
        productId: string
    }
};

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.productId);

    const suggestedProducts = (await getProducts({
        categoryId: product?.category?.id
    })).filter((p) => p.id !== product.id);

    return (
        <div className="bg-white">
            <Container>
                <div className="flex flex-col gap-y-8 mt-0 w-[85vw] max-[500px]:w-[95vw] ">

                    <div className="py-10 max-[500px]:py-5">
                        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                            <Gallery images={product.images} />
                            <div className="mt-10  sm:mt-16 sm:px-0 lg:mt-0">
                                <Info data={product}/>
                            </div>
                        </div>
                        <hr className="my-10 " />

                        <ProductList title="Смотрите также" items={suggestedProducts} />
                    </div>

                </div>
            </Container>
        </div>
    );
}

export default ProductPage;