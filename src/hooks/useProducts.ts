import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  price: number;
  offer_price?: number | null;
  image_url: string | null;
  images?: any;
  description: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  storage: string | null;
  weight: string | null;
  is_offer: boolean;
  is_new_arrival: boolean;
  is_featured: boolean;
  stock: number;
}

export interface Combo {
  id: string;
  slug: string;
  name: string;
  product_ids: string[];
  original_price: number;
  combo_price: number;
  image_url: string | null;
  description: string | null;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useOfferProducts = () => {
  return useQuery({
    queryKey: ['products', 'offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_offer', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new_arrival', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useCombos = () => {
  return useQuery({
    queryKey: ['combos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Combo[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
};
