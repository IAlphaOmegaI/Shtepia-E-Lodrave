export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  details?: string;
  icon?: string;
  language: string;
  translated_languages: any;
  image: any;
  type?: string | null;
}

export interface BlogGalleryItem {
  id: number;
  image: any;
  caption: string;
  order: number;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author: string;
  status?: string;
  featured_image: any;
  tags: BlogTag[];
  gallery?: BlogGalleryItem[];
  reading_time: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at?: string;
  published_at: string;
  is_published: boolean;
}

export interface BlogListResponse {
  data: Blog[];
  paginatorInfo?: {
    total: number;
    current_page: number;
    last_page: number;
    count: number;
    per_page: number;
  };
}

export interface BlogFilters {
  tag?: string;
  author?: string;
  is_published?: boolean;
  limit?: number;
  page?: number;
  order_by?: string;
}