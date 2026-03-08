import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/context/StoreContext';
import { Product, Combo } from '@/data/products';

export const useProducts = () => {
  const { products, isLoading, error } = useStore();

  return useQuery({
    queryKey: ['products', products.length], // Include length to trigger re-query if store updates
    queryFn: async () => {
      return products;
    },
    initialData: products,
    enabled: true
  });
};

export const useProductBySlug = (slug: string) => {
  const { getProduct, isLoading } = useStore();

  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      return getProduct(slug) || null;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  const { products, isLoading } = useStore();

  return useQuery({
    queryKey: ['products', 'featured', products.filter(p => p.isFeatured).length],
    queryFn: async () => {
      return products.filter(p => p.isFeatured && p.isActive);
    },
    initialData: products.filter(p => p.isFeatured && p.isActive),
  });
};

export const useOfferProducts = () => {
  const { products } = useStore();

  return useQuery({
    queryKey: ['products', 'offers', products.filter(p => p.isOffer).length],
    queryFn: async () => {
      return products.filter(p => p.isOffer && p.isActive);
    },
    initialData: products.filter(p => p.isOffer && p.isActive),
  });
};

export const useNewArrivals = () => {
  const { products } = useStore();

  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      // Logic from various pages: ragi-choco-malt is the main new arrival
      return products.filter(p => p.slug === 'ragi-choco-malt' && p.isActive);
    },
  });
};

export const useCombos = () => {
  const { combos } = useStore();

  return useQuery({
    queryKey: ['combos', combos.length],
    queryFn: async () => {
      return combos;
    },
    initialData: combos,
  });
};

export const useCategories = () => {
  const { categories } = useStore();

  return useQuery({
    queryKey: ['categories', categories.length],
    queryFn: async () => {
      return categories;
    },
    initialData: categories,
  });
};
