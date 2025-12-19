import { useQuery } from '@tanstack/react-query';
import {
  products,
  combos,
  getFeaturedProducts,
  getOfferProducts,
  getNewArrivals,
  getProductBySlug
} from '@/data/products';
import { Product, Combo } from '@/data/products';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Return local mock data
      return products;
    },
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const product = getProductBySlug(slug);
      return product || null;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      return getFeaturedProducts();
    },
  });
};

export const useOfferProducts = () => {
  return useQuery({
    queryKey: ['products', 'offers'],
    queryFn: async () => {
      return getOfferProducts();
    },
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      return getNewArrivals();
    },
  });
};

export const useCombos = () => {
  return useQuery({
    queryKey: ['combos'],
    queryFn: async () => {
      return combos;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock categories derived from products or static list
      return [
        { id: '1', name: 'Porridge Mixes', slug: 'porridge-mixes' },
        { id: '2', name: 'Oil & Ghee', slug: 'oil-ghee' }
      ];
    },
  });
};
