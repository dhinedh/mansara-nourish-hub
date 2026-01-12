export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "porridge-mixes" | "oil-ghee";
  price: number;
  offerPrice?: number;
  image: string;
  description: string;
  ingredients: string;
  howToUse: string;
  storage: string;
  weight: string;
  isOffer: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  stock: number;
  highlights?: string[];
  nutrition?: string; // HTML or text content
  compliance?: string;
  short_description?: string;
  variants?: {
    weight: string;
    price: number;
    offerPrice?: number;
    stock?: number;
    sku?: string;
  }[];
}

export interface Combo {
  id: string;
  slug: string;
  name: string;
  products: string[];
  originalPrice: number;
  comboPrice: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "urad-porridge-mix-classic",
    name: "Classic Urad Porridge Mix",
    category: "porridge-mixes",
    price: 55,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "A simple and nourishing porridge mix made primarily from premium black gram. Light on the stomach and easy to prepare, ideal for everyday nourishment for all age groups.",
    highlights: [
      "Made with carefully selected grains & pulses",
      "No artificial colours or preservatives",
      "Easy to cook, suitable for all age groups",
      "Traditional nutrition with modern convenience"
    ],
    ingredients: "Black Gram (Urad Dal), Black Rice (Kavuni Dal), Dry Ginger, Cardamom",
    howToUse: "1. Take 2 tablespoons of MansaraFoods Classic Urad Porridge Mix in a clean pan.\n2. Add 250 ml of water then cook on medium flame for 10 minutes, stirring continuously to avoid lump formation.\n3. Add Salt/Pepper/jaggery as per your taste, stir well, and serve warm.",
    nutrition: "Testing in progress",
    storage: "Store in a cool, dry place.\nKeep away from moisture.\nOnce opened, store in an airtight container.",
    compliance: "FSSAI License No: [Pending]",
    weight: "100g",
    isOffer: false,
    isNewArrival: false,
    isFeatured: true,
    stock: 50,
    variants: [
      { weight: "100g", price: 55, stock: 100 },
      { weight: "200g", price: 105, stock: 100 }
    ]
  },
  {
    id: "2",
    slug: "urad-porridge-mix-salt-pepper",
    name: "URAD Porridge Mix – Salt & Pepper",
    category: "porridge-mixes",
    price: 55,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "A savory twist on our classic URAD mix, enhanced with the warmth of freshly ground black pepper. Perfect for those who prefer a more robust flavor profile.",
    ingredients: "Black Gram (Urad Dal), Rice, Black Pepper, Rock Salt, Cumin, Asafoetida",
    howToUse: "Mix 2 tablespoons with warm water. Cook for 5-7 minutes. Best enjoyed hot with a drizzle of sesame oil.",
    storage: "Store in a cool, dry place. Keep away from direct sunlight. Use within 6 months of opening.",
    weight: "100g",
    isOffer: false,
    isNewArrival: false,
    isFeatured: true,
    stock: 35,
    variants: [
      { weight: "100g", price: 55, stock: 100 },
      { weight: "200g", price: 105, stock: 100 }
    ]
  },
  {
    id: "3",
    slug: "urad-porridge-mix-millet-magic",
    name: "URAD Porridge Mix – Millet Magic",
    category: "porridge-mixes",
    price: 60,
    image: "https://images.unsplash.com/photo-1644433159048-436d4df13117?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "The power of millets combined with URAD for a nutritionally superior porridge. Rich in fiber and essential minerals for holistic wellness.",
    ingredients: "Black Gram (Urad Dal), Finger Millet (Ragi), Foxtail Millet, Cumin, Black Pepper, Salt",
    howToUse: "Mix 2 tablespoons with warm water or milk. Cook for 7-8 minutes. Add jaggery or honey for natural sweetness.",
    storage: "Store in a cool, dry place. Keep away from direct sunlight. Use within 6 months of opening.",
    weight: "100g",
    isOffer: false,
    isNewArrival: true,
    isFeatured: true,
    stock: 40,
    variants: [
      { weight: "100g", price: 60, stock: 100 },
      { weight: "200g", price: 115, stock: 100 }
    ]
  },
  {
    id: "4",
    slug: "urad-porridge-mix-premium",
    name: "URAD Porridge Mix – Premium",
    category: "porridge-mixes",
    price: 65,
    image: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Our finest selection of URAD porridge mix, featuring premium quality ingredients and enhanced nutritional profile for the discerning health enthusiast.",
    ingredients: "Premium Black Gram (Urad Dal), Basmati Rice, Organic Cumin, Himalayan Pink Salt, Black Pepper",
    howToUse: "Mix 2 tablespoons with warm milk. Cook for 5-6 minutes. Garnish with nuts and dried fruits.",
    storage: "Store in a cool, dry place away from direct sunlight. Best consumed within 4 months of opening.",
    weight: "100g",
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    stock: 25,
    variants: [
      { weight: "100g", price: 65, stock: 100 },
      { weight: "200g", price: 125, stock: 100 }
    ]
  },
  {
    id: "5",
    slug: "porridge-mix-black-rice-delight",
    name: "Porridge Mix – Black Rice Delight",
    category: "porridge-mixes",
    price: 70,
    image: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Experience the antioxidant-rich goodness of black rice in this unique porridge blend. A modern superfood with traditional preparation methods.",
    ingredients: "Black Rice (Kavuni), Black Gram, Cardamom, Cinnamon, Natural Vanilla",
    howToUse: "Soak 2 tablespoons in water for 10 minutes. Cook with milk for 10-12 minutes. Sweeten with jaggery.",
    storage: "Store in an airtight container in a cool, dry place. Use within 5 months of opening.",
    weight: "100g",
    isOffer: false,
    isNewArrival: true,
    isFeatured: true,
    stock: 30,
    variants: [
      { weight: "100g", price: 70, stock: 100 },
      { weight: "200g", price: 135, stock: 100 }
    ]
  },
  {
    id: "6",
    slug: "idly-powder-mix-millet-fusion",
    name: "Idly Powder Mix – Millet Fusion",
    category: "porridge-mixes",
    price: 75,
    image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "A nutritious millet-based idly powder that adds taste and health to your everyday idlis. Enjoy the traditional South Indian favorite with added wellness benefits.",
    ingredients: "Mixed Millets, Urad Dal, Dried Red Chili, Curry Leaves, Asafoetida, Sesame Seeds",
    howToUse: "Sprinkle generously over hot idlis. Mix with ghee or sesame oil for best taste. Can also be used with dosa.",
    storage: "Store in a cool, dry place. Keep the container tightly closed. Use within 3 months of opening.",
    weight: "100g",
    isOffer: false,
    isNewArrival: true,
    isFeatured: false,
    stock: 60,
    variants: [
      { weight: "100g", price: 75, stock: 100 },
      { weight: "200g", price: 145, stock: 100 }
    ]
  },
  {
    id: "7",
    slug: "groundnut-oil-classic",
    name: "Groundnut Oil – Classic",
    category: "oil-ghee",
    price: 549,
    offerPrice: 499,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd03a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Pure, cold-pressed groundnut oil made from carefully selected peanuts. Our traditional extraction method preserves all natural nutrients and authentic flavor.",
    ingredients: "100% Pure Groundnut Oil (Cold-Pressed)",
    howToUse: "Ideal for deep frying, sautéing, and everyday cooking. Perfect for traditional South Indian dishes.",
    storage: "Store in a cool, dark place. Keep away from direct sunlight and heat. Use within 6 months of opening.",
    weight: "1 Litre",
    isOffer: true,
    isNewArrival: false,
    isFeatured: true,
    stock: 45
  },
  {
    id: "8",
    slug: "sesame-oil-classic",
    name: "Sesame Oil – Classic",
    category: "oil-ghee",
    price: 599,
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Traditional wood-pressed sesame oil with its characteristic nutty aroma and flavor. A staple in South Indian cooking and Ayurvedic practices.",
    ingredients: "100% Pure Sesame Oil (Wood-Pressed)",
    howToUse: "Perfect for tempering, marinades, and traditional recipes. Also suitable for oil pulling and massage.",
    storage: "Store in a cool, dark place. Keep the bottle tightly sealed. Best used within 6 months.",
    weight: "500ml",
    isOffer: false,
    isNewArrival: false,
    isFeatured: true,
    stock: 40
  },
  {
    id: "9",
    slug: "coconut-oil-classic",
    name: "Coconut Oil – Classic",
    category: "oil-ghee",
    price: 449,
    image: "https://images.unsplash.com/photo-1590487372295-8669e2c65768?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Pure virgin coconut oil extracted from fresh coconuts using cold-press method. Retains natural aroma and all nutritional benefits.",
    ingredients: "100% Pure Virgin Coconut Oil (Cold-Pressed)",
    howToUse: "Excellent for cooking, baking, and as a hair/skin moisturizer. Ideal for Kerala-style dishes.",
    storage: "Store at room temperature. May solidify in cold weather - this is natural. Use within 8 months.",
    weight: "500ml",
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    stock: 55
  },
  {
    id: "10",
    slug: "ghee-classic",
    name: "Ghee – Classic",
    category: "oil-ghee",
    price: 699,
    offerPrice: 649,
    image: "https://images.unsplash.com/photo-1621966144883-8a3d5e2e8310?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Traditional bilona method ghee made from A2 cow milk. Rich in flavor and packed with the goodness of pure clarified butter.",
    ingredients: "100% Pure A2 Cow Ghee (Bilona Method)",
    howToUse: "Add to hot rice, rotis, or dal for enhanced taste. Perfect for making sweets and for tempering.",
    storage: "Store in a cool, dry place. No refrigeration needed. Use clean, dry spoon. Best within 6 months.",
    weight: "500g",
    isOffer: true,
    isNewArrival: false,
    isFeatured: true,
    stock: 30
  }
];

export const combos: Combo[] = [
  {
    id: "combo-1",
    slug: "morning-wellness-combo",
    name: "Morning Wellness Combo",
    products: ["1", "7"],
    originalPrice: 848,
    comboPrice: 749,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Start your day right with our URAD Porridge Mix Classic and pure Groundnut Oil. A perfect combination for a wholesome breakfast."
  },
  {
    id: "combo-2",
    slug: "complete-kitchen-essentials",
    name: "Complete Kitchen Essentials",
    products: ["7", "8", "10"],
    originalPrice: 1847,
    comboPrice: 1599,
    image: "https://images.unsplash.com/photo-1516668705353-c9183cc66148?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "All your cooking essentials in one combo - Groundnut Oil, Sesame Oil, and Premium Ghee for the perfect MANSARA kitchen."
  },
  {
    id: "combo-3",
    slug: "porridge-lovers-pack",
    name: "Porridge Lovers Pack",
    products: ["1", "2", "3"],
    originalPrice: 977,
    comboPrice: 849,
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Try all three variants of our signature URAD Porridge Mix - Classic, Salt & Pepper, and Millet Magic."
  },
  {
    id: "combo-4",
    slug: "family-nutrition-bundle",
    name: "Family Nutrition Bundle",
    products: ["3", "5", "10"],
    originalPrice: 1447,
    comboPrice: 1249,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Nourish your entire family with Millet Magic Porridge, Black Rice Delight, and Pure Ghee - complete nutrition in one bundle."
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isFeatured);
};

export const getOfferProducts = (): Product[] => {
  return products.filter(p => p.isOffer);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(p => p.isNewArrival);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};
