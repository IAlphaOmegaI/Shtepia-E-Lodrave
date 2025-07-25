import React from "react";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";
import Image from "next/image";
import styles from "./blog.module.scss";
import { ArrowRight } from "../icons/arrow-right";
import type { Blog } from "@/types";
import { BlogService } from "@/services";

type BlogCardProps = {
  blog: Blog;
  className?: string;
};

const BlogCardItem: React.FC<BlogCardProps> = ({ blog, className }) => {
  // Check if featured_image is valid
  const imageUrl = (blog.featured_image && typeof blog.featured_image === 'string' && blog.featured_image.trim() !== '') 
    ? blog.featured_image 
    : (blog.featured_image?.url || blog.featured_image?.original || '/blog-card.png');

  return (
    <div
      className="flex flex-col h-full cursor-pointer"
      style={{
        boxShadow: "0px 4px 16px 0px rgba(85, 85, 85, 0.16)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Link href={Routes.blog(blog.slug)} className="relative h-[240px] overflow-hidden block">
        <Image
          alt={blog.title}
          src={imageUrl}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="bg-[#FFF] p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>{BlogService.formatDate(blog.published_at)}</span>
          <span>•</span>
          <span>{blog.reading_time} min lexim</span>
        </div>
        
        {blog.title && (
          <Link href={Routes.blog(blog.slug)} className="hover:text-[#D09A16] transition-colors">
            <h2 className={styles.blog_item_title}>
              {blog.title.length > 80
                ? blog.title.substring(0, 80) + "..."
                : blog.title}
            </h2>
          </Link>
        )}
        
        <p className={styles.blog_item_description}>
          {blog.excerpt.length > 150
            ? blog.excerpt.substring(0, 150) + "..."
            : blog.excerpt}
        </p>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link
            href={Routes.blog(blog.slug)}
            className="text-[#D09A16] hover:underline flex items-center gap-1 font-albertsans font-medium"
          >
            Lexo më shumë <ArrowRight className="h-4 w-4" />
          </Link>
          
          {blog.tags.length > 0 && (
            <div className="flex gap-1">
              {blog.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag.id} 
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCardItem;
