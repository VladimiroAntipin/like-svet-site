import getBillboards from "@/actions/get-billboards";
import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getReviews from "@/actions/get-reviews";
import AboutUs from "@/components/about-us";
import BillboardCarousel from "@/components/billboard-carousel";
import Contacts from "@/components/contacts";
import EmblaOpacityCarousel from "@/components/embla-opacity-carousel";
import Filters from "@/components/filters";
import FiltersByCategory from "@/components/filters-by-category";
import ProductList from "@/components/product-list";
import ScrollingBanner from "@/components/scrolling-banners";
import ClearFiltersButton from "@/components/ui/clear-filter-button";
import Container from "@/components/ui/container";
import LoadMoreButton from "@/components/ui/load-more-button";

export const dynamic = 'force-dynamic'

export const revalidate = 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HomePageProps {
  searchParams: {
    categoryId?: string;
    limit?: string;
    minPrice?: string;
    maxPrice?: string;
    colorId?: string;
    sort?: "asc" | "desc";
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HomePage: React.FC<any> = async ({ searchParams }: any) => {
  const billboards = await getBillboards();
  const categories = await getCategories();
  const colors = await getColors();
  const reviews = await getReviews();

  const resolvedSearchParams = await searchParams;

  const limit = parseInt(resolvedSearchParams.limit || "8", 10);
  const requestLimit = limit + 1;

  const hasFilters =
    (resolvedSearchParams.minPrice ?? "") !== "" ||
    (resolvedSearchParams.maxPrice ?? "") !== "" ||
    (resolvedSearchParams.colorId ?? "") !== "" ||
    (resolvedSearchParams.sort ?? "") !== "";

  let products = await getProducts({
    categoryId: resolvedSearchParams.categoryId,
    ...(hasFilters ? {} : { limit: requestLimit }),
  });

  if (resolvedSearchParams.minPrice) {
    const min = Number(resolvedSearchParams.minPrice) * 100; // рубли -> копейки
    products = products.filter((p) => Number(p.price) >= min);
  }

  if (resolvedSearchParams.maxPrice) {
    const max = Number(resolvedSearchParams.maxPrice) * 100; // рубли -> копейки
    products = products.filter((p) => Number(p.price) <= max);
  }

  if (resolvedSearchParams.colorId) {
    products = products.filter((p) =>
      p.productColors?.some((c) => c.colorId === resolvedSearchParams.colorId)
    );
  }

  if (resolvedSearchParams.sort) {
    products = products.sort((a, b) =>
      resolvedSearchParams.sort === "asc"
        ? Number(a.price) - Number(b.price)
        : Number(b.price) - Number(a.price)
    );
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
        <div className="space-y-10 pb-10 scroll-mt-15" id="products">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 mt-20 w-[85vw] max-[500px]:w-full">
            <h2 className="font-bold text-3xl">Каталог</h2>
            <ClearFiltersButton />
            <FiltersByCategory
              valueKey="categoryId"
              name="category"
              data={categories}
            />
            <Filters colors={colors} />
            <ProductList title="" items={items} />
            {hasMore && (
              <LoadMoreButton
                limit={limit}
                categoryId={resolvedSearchParams.categoryId}
                minPrice={resolvedSearchParams.minPrice}
                maxPrice={resolvedSearchParams.maxPrice}
                colorId={resolvedSearchParams.colorId}
                sort={resolvedSearchParams.sort}
              />
            )}
            <EmblaOpacityCarousel slides={reviews}/>
            <AboutUs />
            <Contacts />
          </div>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
