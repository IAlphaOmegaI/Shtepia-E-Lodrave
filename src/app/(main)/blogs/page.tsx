import { BlogService } from '@/services';
import BlogsCard from '@/components/blogs/blogs';
import { PageHeader } from '@/components/common';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogjet - Shtëpia e Lodrave',
  description: 'Lexoni artikujt më të fundit në blogun tonë rreth lodrave, lojërave dhe këshillave për fëmijë.',
};

export default async function BlogsPage() {
  const blogs = await BlogService.getPublishedBlogs();

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title="Blogs" showClouds={true} />
      
      <div className="bg-[#FFFAEE] py-20">
        <div className="container mx-auto px-4">
          <BlogsCard 
            blogs={blogs}
            showSeeMore={false}
          />
        </div>
      </div>
    </main>
  );
}