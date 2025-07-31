import { ProductService, CategoryService, BrandService, BlogService } from '@/services';
import LodraBanner from '@/components/banners/lodra-banner';
import FeaturedCategories from '@/components/featuredCategories';
import NewCollections from '@/components/newCollections/newCollections';
import Sponsors from '@/components/sponsors/sponsors';
import BestSellingProducts from '@/components/BestSellingProducts/BestSellingProducts';
import LoyaltyCard from '@/components/LoyaltyCard/loyalty-card';
import BlogsCard from '@/components/blogs/blogs';

export default async function HomePage() {
  // Fetch data on the server using domain-specific services
  const [products, categories, newCollectionProducts, brands, latestBlogs] = await Promise.all([
    ProductService.getProducts(10),
    CategoryService.getAll(),
    ProductService.getNewCollections(20),
    BrandService.getAll(),
    BlogService.getLatestBlogs(6),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <LodraBanner />
      
      {/* Featured Categories */}
      <FeaturedCategories />
      
      {/* New Collections */}
      <NewCollections products={newCollectionProducts} />
      
      {/* Sponsors */}
      <Sponsors brands={brands} />
      
      {/* Best Selling Products */}
      <BestSellingProducts />
      
      {/* Loyalty Card */}
      <LoyaltyCard />
      
      {/* Blogs Section */}
      <div className="bg-[#fff] py-20">
        <div className="container mx-auto px-4">
          <BlogsCard 
            title="Blogs" 
            blogs={latestBlogs}
            showSeeMore={true} 
            limit={6}
          />
        </div>
      </div>

    </main>
  );
}