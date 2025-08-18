import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import BackButton from "@/components/ui/back-button";
import Container from "@/components/ui/container";
import LoadMoreButton from "@/components/ui/load-more-button";

interface ProductPageProps {
  params: {
    productId: string;
    limit?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductPage: React.FC<ProductPageProps> = async ({ params, searchParams }: any) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const product = await getProduct(resolvedParams.productId);

  const limit = parseInt(resolvedSearchParams?.limit || "8", 10);

  const suggested = await getProducts({
    isFeatured: true,
    limit: limit + 1,
  });

  const suggestedProducts = suggested.filter((p) => p.id !== product.id);
  const items = suggestedProducts.slice(0, limit);
  const hasMore = suggestedProducts.length > limit;

  return (
    <div className="bg-white">
      <Container>
        <div className="py-10 max-[500px]:py-5">
          <BackButton />
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>

          <hr className="my-10 " />

          <ProductList title="Смотрите также" items={items} />
          {hasMore && (
            <div className="flex justify-center mt-8 w-full">
              <LoadMoreButton limit={limit} basePath={`/product/${product.id}`} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;

