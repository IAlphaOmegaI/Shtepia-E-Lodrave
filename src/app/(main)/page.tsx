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
      <div className="bg-[#FFFAEE] py-20">
        <div className="container mx-auto px-4">
          <BlogsCard 
            title="Blogs" 
            blogs={latestBlogs}
            showSeeMore={true} 
            limit={6}
          />
        </div>
      </div>

      {/* Categories */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: any) => (
              <div
                key={category.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description?.substring(0, 100)}...
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}