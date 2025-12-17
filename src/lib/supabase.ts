import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string | null;
          price: number;
          offer_price: number | null;
          image_url: string | null;
          images: any;
          description: string | null;
          ingredients: string | null;
          how_to_use: string | null;
          storage: string | null;
          weight: string | null;
          stock: number;
          is_offer: boolean;
          is_new_arrival: boolean;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      combos: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          original_price: number;
          combo_price: number;
          product_ids: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          full_name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          address_id: string | null;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          order_status: string;
          created_at: string;
          updated_at: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          combo_id: string | null;
          item_type: string;
          quantity: number;
          price: number;
          subtotal: number;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
        };
      };
      content_pages: {
        Row: {
          id: string;
          page_key: string;
          title: string;
          content: string | null;
          updated_at: string;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          page: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
      };
    };
  };
};
