import React from 'react';
import BlogCardItem from './blog-card';
import Link from 'next/link';
import { Routes } from '@/config/routes';
import { ArrowRight } from '@/components/icons';
import type { Blog } from '@/types';

type BlogsCardProps = {
  title?: string;
  blogs: Blog[];
  layout?: 'grid' | 'list';
  showPagination?: boolean;
  showSeeMore?: boolean;
  limit?: number;
};

const BlogsCard = ({
  title,
  blogs,
  layout,
  showPagination,
  showSeeMore,
  limit,
}: BlogsCardProps) => {
  // Apply limit if provided
  const displayBlogs = limit ? blogs.slice(0, limit) : blogs;

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <>
      {title && (
        <h1
          className="text-white text-center font-grandstander font-bold text-[46px] leading-[60px] whitespace-pre-line pb-8"
          style={{
            WebkitTextStrokeWidth: '3px',
            WebkitTextStrokeColor: '#F11602',
          }}
        >
          {title}
        </h1>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {displayBlogs.map((blog) => (
          <BlogCardItem key={blog.id} blog={blog} />
        ))}
      </div>

      {showSeeMore && (
        <div className="flex justify-center mt-12">
          <Link
            href={Routes.blogs}
            className="flex items-center justify-center gap-[10px] h-[52px] px-6 rounded-[8px] bg-[#1A66EA] text-white shadow-[0px_4px_16px_rgba(19,30,69,0.10)] hover:bg-[#1557C7] transition-colors"
          >
            <span className="text-[18px] leading-[24px] font-[600] font-albertsans">
              Shiko më shumë
            </span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </>
  );
};

export default BlogsCard;