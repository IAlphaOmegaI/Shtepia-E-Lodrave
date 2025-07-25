import { api } from './api';
import type { Blog, BlogFilters } from '@/types';

export class BlogService {
  /**
   * Get all blogs with optional filters
   */
  static async getAll(filters?: BlogFilters): Promise<Blog[]> {
    try {
      const response = await api.blogs.getAll(filters);
      return response || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  /**
   * Get latest blogs for homepage
   */
  static async getLatestBlogs(limit: number = 6): Promise<Blog[]> {
    return this.getAll({ 
      limit, 
      order_by: '-created_at',
      is_published: true 
    });
  }

  /**
   * Get blog by slug
   */
  static async getBySlug(slug: string): Promise<Blog | null> {
    try {
      const response = await api.blogs.getBySlug(slug);
      return response;
    } catch (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get blogs by tag
   */
  static async getByTag(tag: string): Promise<Blog[]> {
    return this.getAll({ tag });
  }

  /**
   * Get blogs by author
   */
  static async getByAuthor(author: string): Promise<Blog[]> {
    return this.getAll({ author });
  }

  /**
   * Get published blogs only
   */
  static async getPublishedBlogs(limit?: number): Promise<Blog[]> {
    return this.getAll({ 
      is_published: true,
      limit,
      order_by: '-published_at'
    });
  }

  /**
   * Get related blogs based on tags
   */
  static async getRelatedBlogs(currentBlogId: number, tags: string[], limit: number = 4): Promise<Blog[]> {
    try {
      const allBlogs = await this.getPublishedBlogs();
      
      // Filter blogs that share at least one tag and exclude current blog
      const relatedBlogs = allBlogs
        .filter(blog => 
          blog.id !== currentBlogId && 
          blog.tags.some(blogTag => tags.includes(blogTag.slug))
        )
        .slice(0, limit);
      
      return relatedBlogs;
    } catch (error) {
      console.error('Error fetching related blogs:', error);
      return [];
    }
  }

  /**
   * Format blog date for display
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Calculate estimated reading time
   */
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}