import { BlogService } from '@/services';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Routes } from '@/config/routes';
import { ArrowPrev } from '@/components/icons';
import type { Metadata } from 'next';

// This function generates metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await BlogService.getBySlug(slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.published_at,
      authors: [blog.author],
    },
  };
}

// This is the main page component
// It runs on the server by default (SSR)
export default async function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  // Fetch blog data on the server
  const blog = await BlogService.getBySlug(slug);
  
  // If blog not found, show 404
  if (!blog) {
    notFound();
  }

  // Get related blogs
  const tagSlugs = blog.tags.map(tag => tag.slug);
  const relatedBlogs = await BlogService.getRelatedBlogs(blog.id, tagSlugs, 3);

  // Check if featured_image is valid, use fallback if not
  const imageUrl = (blog.featured_image && typeof blog.featured_image === 'string' && blog.featured_image.trim() !== '') 
    ? blog.featured_image 
    : (blog.featured_image?.url || blog.featured_image?.original || '/kidplaying.webp');

  return (
    <main className="min-h-screen bg-[#FFFAEE]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* White content box */}
          <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
            {/* Date */}
            <p className="text-[#111111] text-[18px] leading-[24px] font-albertsans mb-6">
              {BlogService.formatDate(blog.published_at)}
            </p>

            {/* Title */}
            <h1 className="text-[#D09A16] font-grandstander font-bold text-[40px] leading-[48px] mb-8">
              {blog.title}
            </h1>

            {/* Featured Image */}
            <div className="relative h-[400px] md:h-[500px] w-full mb-12 rounded-[12px] overflow-hidden">
              <Image
                src={imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Blog Content */}
            <div className="space-y-6">
              <div
                className="blog-content text-[#111111] font-albertsans text-[16px] leading-[28px] space-y-6"
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />
            </div>

            {/* Gallery */}
            {blog.gallery && blog.gallery.length > 0 && (
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blog.gallery
                    .sort((a, b) => a.order - b.order)
                    .map((item) => {
                      const galleryImageUrl =
                        item.image &&
                        typeof item.image === "string" &&
                        item.image.trim() !== ""
                          ? item.image
                          : item.image?.url || item.image?.original || null;

                      if (!galleryImageUrl) return null;

                      return (
                        <div key={item.id} className="relative">
                          <div className="relative h-[300px] rounded-[12px] overflow-hidden">
                            <Image
                              src={galleryImageUrl}
                              alt={item.caption}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {item.caption && (
                            <p className="text-sm text-[#555] mt-2 text-center font-albertsans">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
              <p className="text-right text-[#111111] font-albertsans text-[16px]">
                Autor: <span className="font-semibold">{blog.author}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-[36px] font-bold text-center mb-12 font-grandstander text-[#111111]">
              Blogje të Ngjashme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={Routes.blog(relatedBlog.slug)}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-[0px_4px_16px_rgba(85,85,85,0.16)] overflow-hidden hover:shadow-xl transition-shadow">
                    {relatedBlog.featured_image && (
                      <div className="relative h-[240px]">
                        <Image
                          src={
                            typeof relatedBlog.featured_image === "string"
                              ? relatedBlog.featured_image
                              : "/blog-card.png"
                          }
                          alt={relatedBlog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-[14px] text-[#666] font-albertsans mb-2">
                        {BlogService.formatDate(relatedBlog.published_at)}
                      </p>
                      <h3 className="font-albertsans font-semibold text-[20px] leading-[26px] mb-3 group-hover:text-[#D09A16] transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-[#555] text-[16px] leading-[24px] font-albertsans">
                        {relatedBlog.excerpt.length > 100
                          ? relatedBlog.excerpt.substring(0, 100) + "..."
                          : relatedBlog.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// This function can be used to generate static paths at build time
// For now, we'll use dynamic rendering
export async function generateStaticParams() {
  // You can fetch all blog slugs here if you want to pre-render some pages
  // const blogs = await BlogService.getAll();
  // return blogs.map((blog) => ({
  //   slug: blog.slug,
  // }));
  
  // For now, return empty array for fully dynamic rendering
  return [];
}