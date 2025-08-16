import getBillboards from "@/actions/get-billboards";
import getCategories from "@/actions/get-categories";
import getProducts from "@/actions/get-products";
import BillboardCarousel from "@/components/billboard-carousel";
import Filters from "@/components/filters";
import ProductList from "@/components/product-list";
import ScrollingBanner from "@/components/scrolling-banners";
import ClearFiltersButton from "@/components/ui/clear-filter-button";
import Container from "@/components/ui/container";
import LoadMoreButton from "@/components/ui/load-more-button";

export const revalidate = 0;

interface HomePageProps {
  searchParams: {
    categoryId?: string;
    limit?: string;
  };
}

const HomePage: React.FC<HomePageProps> = async ({ searchParams }) => {
  const billboards = await getBillboards();
  const categories = await getCategories();
  const resolvedSearchParams = await searchParams;

  const limit = parseInt(resolvedSearchParams.limit || "8", 10);

  // pattern fetch +1 per sapere se ci sono altri prodotti
  const requestLimit = limit + 1;

  let products;
  if (resolvedSearchParams.categoryId) {
    // categoria selezionata
    products = await getProducts({
      categoryId: resolvedSearchParams.categoryId,
      limit: requestLimit,
    });
  } else {
    // homepage -> tutti i prodotti
    products = await getProducts({ limit: requestLimit });
  }

  const items = products.slice(0, limit);
  const hasMore = products.length > limit;

  return (
    <>
      <div className="flex justify-center">
        <BillboardCarousel billboards={billboards} />
      </div>

      <ScrollingBanner />
      <Container>
        <div className="space-y-10 pb-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 mt-20 w-[85vw] max-[500px]:w-full">
            <ClearFiltersButton />
            <Filters valueKey="categoryId" name="category" data={categories} />
            <ProductList title="" items={items} />
            {hasMore && (
              <LoadMoreButton
                limit={limit}
                categoryId={resolvedSearchParams.categoryId}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
