export interface Product {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  offerPrice?: number;
  image: string;
  images?: string[];
  description: string;
  ingredients: string;
  howToUse: string;
  storage: string;
  weight: string;
  isOffer: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive?: boolean;
  stock?: number;
  highlights?: string[];
  nutrition?: string;
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

export interface Category {
  id: string;
  _id?: string;
  name: string;
  value: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: "69a83fe41c2c00db0a9ba523",
    _id: "69a83fe41c2c00db0a9ba523",
    name: "Urad Porridge Mix",
    value: "urad-porridge-mix",
    slug: "urad-porridge-mix"
  },
  {
    id: "69a83fe41c2c00db0a9ba524",
    _id: "69a83fe41c2c00db0a9ba524",
    name: "Black Rice mix",
    value: "black-rice-mix",
    slug: "black-rice-mix"
  },
  {
    id: "69a83fe41c2c00db0a9ba525",
    _id: "69a83fe41c2c00db0a9ba525",
    name: "Millet fusion mix",
    value: "millet-fusion-mix",
    slug: "millet-fusion-mix"
  },
  {
    id: "69a83fe41c2c00db0a9ba526",
    _id: "69a83fe41c2c00db0a9ba526",
    name: "Health drink mix",
    value: "health-drink-mixes",
    slug: "health-drink-mixes"
  },
  {
    id: "69a8facd2fef7ae403186831",
    _id: "69a8facd2fef7ae403186831",
    name: "Combo",
    value: "combos",
    slug: "combos"
  }
];

export const products: Product[] = [
  {
    id: "69a83fe51c2c00db0a9ba527",
    _id: "69a83fe51c2c00db0a9ba527",
    slug: "urad-porridge-mix-classic",
    name: "Urad Porridge Mix – Classic",
    category: "urad-porridge-mix",
    categoryId: "69a83fe41c2c00db0a9ba523",
    price: 70,
    offerPrice: 70,
    image: "/products/urad-classic-front.jpg",
    images: ["/products/urad-classic-front.jpg", "/products/urad-classic-back.jpg", "/products/urad-classic-side.jpg"],
    description: "Mansara Classic Urad Porridge Mix is a time-tested nourishing blend made primarily from premium black gram (Urad Dal). It is formulated to be gentle on the stomach while providing essential proteins and energy. This traditional porridge helps in strengthening the body and is an excellent choice for a healthy, easily digestible meal or snack for children, adults, and the elderly.",
    highlights: ["High Protein", "Easy Digestion", "No Preservatives", "Traditional Recipe"],
    ingredients: "Black Gram (Urad Dal), Samba Wheat, Fried Gram, Cardamom.",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "200g", price: 105, offerPrice: 105 }
    ],
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "69a83fe61c2c00db0a9ba528",
    _id: "69a83fe61c2c00db0a9ba528",
    slug: "urad-porridge-mix-salt-pepper",
    name: "Urad Porridge Mix – Salt & Pepper",
    category: "urad-porridge-mix",
    categoryId: "69a83fe41c2c00db0a9ba523",
    price: 70,
    offerPrice: 70,
    image: "/products/urad-salt-pepper-front.jpg",
    images: ["/products/urad-salt-pepper-front.jpg", "/products/urad-salt-pepper-back.jpg", "/products/urad-salt-pepper-side.jpg"],
    description: "Mansara Urad Porridge Mix – Salt & Pepper is a savoury twist on the traditional ulunthankanji, infused into natural spices like pepper and mild seasoning for a comforting yet flavourful experience.",
    highlights: ["No artificial flavours", "Digestive spices", "Savoury taste", "Good for gut health"],
    ingredients: "Black Gram (60.9%), Kavuni Rice (30%), Black Pepper (4.55%), Cumin Seeds (2.73%), Salt (1.82%).",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously to avoid lumps, and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "200g", price: 105, offerPrice: 105 }
    ],
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "69a83fe61c2c00db0a9ba529",
    _id: "69a83fe61c2c00db0a9ba529",
    slug: "urad-porridge-mix-millet-magic",
    name: "Urad Porridge Mix – Millet Magic",
    category: "urad-porridge-mix",
    categoryId: "69a83fe41c2c00db0a9ba523",
    price: 70,
    offerPrice: 70,
    image: "/products/urad-millet-magic-back.jpg",
    images: ["/products/urad-millet-magic-front.jpg", "/products/urad-millet-magic-back.jpg", "/products/urad-millet-magic-side.jpg"],
    description: "Mansara Millet Magic Urad Porridge Mix brings together the muscle-strengthening benefits of black gram with the mineral-rich goodness of diverse millets.",
    highlights: ["Fiber Rich", "Mineral Rich", "Low GI", "Muscle Support"],
    ingredients: "Black Gram, Finger Millet, Foxtail Millet, Pearl Millet, Little Millet, Kodo Millet, Barnyard Millet, Jowar, Bajra, Spices.",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "200g", price: 115, offerPrice: 115 }
    ],
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "69a83fe61c2c00db0a9ba52a",
    _id: "69a83fe61c2c00db0a9ba52a",
    slug: "urad-porridge-mix-premium",
    name: "Urad Porridge Mix – Premium",
    category: "urad-porridge-mix",
    categoryId: "69a83fe41c2c00db0a9ba523",
    price: 70,
    offerPrice: 70,
    image: "/products/urad-premium-front.jpg",
    images: ["/products/urad-premium-front.jpg", "/products/urad-premium-back.jpg", "/products/urad-premium-side.jpg"],
    description: "Mansara Premium Urad Porridge Mix is a carefully crafted blend designed for those who want maximum nutrition in every serving.",
    highlights: ["Finer grind", "Premium processing", "Multi-Grain", "High Nutrition", "Immunity Support"],
    ingredients: "Black Gram, Ragi, Kavuni Rice, Mappillai Samba Rice, Bamboo Rice, Red Rice, Hand-Pounded Rice.",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "200g", price: 125, offerPrice: 125 }
    ],
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "69a83fe61c2c00db0a9ba52b",
    _id: "69a83fe61c2c00db0a9ba52b",
    slug: "black-rice-delight-porridge-mix",
    name: "Black Rice Delight Porridge Mix",
    category: "black-rice-mix",
    categoryId: "69a83fe41c2c00db0a9ba524",
    price: 70,
    offerPrice: 70,
    image: "/products/black-rice-delight-front.jpg",
    images: ["/products/black-rice-delight-front.jpg", "/products/black-rice-delight-back.jpg", "/products/black-rice-delight-side.jpg"],
    description: "Mansara Black Rice Delight Porridge Mix is made using traditional black rice (Karuppu Kavuni Arisi), known for its powerful antioxidant properties and mineral richness.",
    highlights: ["No added spices", "Antioxidant Rich", "Iron Rich", "Heart Healthy"],
    ingredients: "Kavuni Rice (49.50%), Samba Wheat (24.75%), Barley (12.87%), Horse Gram (12.87%).",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "200g", price: 135, offerPrice: 135 }
    ],
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "69a83fe71c2c00db0a9ba52c",
    _id: "69a83fe71c2c00db0a9ba52c",
    slug: "millet-fusion-idly-podi",
    name: "Millet Fusion Idly Podi",
    category: "millet-fusion-mix",
    categoryId: "69a83fe41c2c00db0a9ba525",
    price: 70,
    offerPrice: 70,
    image: "/products/millet-idly-podi-front.jpg",
    images: ["/products/millet-idly-podi-front.jpg", "/products/millet-idly-podi-back.jpg", "/products/millet-idly-podi-side.jpg"],
    description: "Mansara Millet Fusion Idly Podi is a wholesome blend of traditional millets, pulses, and spices, roasted and ground to perfection.",
    highlights: ["No preservatives", "Traditional roast & grind", "Protein Rich", "Spicy & Savoury"],
    ingredients: "Urad Dal, Bengal Gram, Green Gram, Millets (Foxtail, Little, Barnyard, Kodo), Dry Red Chilli, Kashmiri Chilli, Spices.",
    howToUse: "Mix with required quantity of Ghee or Gingelly oil. Use it with Idly, Dosa, Chapatti, Poori, etc.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "200g", price: 145, offerPrice: 145 }
    ],
    isOffer: false,
    isNewArrival: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: "69a83fe71c2c00db0a9ba52d",
    _id: "69a83fe71c2c00db0a9ba52d",
    slug: "ragi-choco-malt",
    name: "Ragi Choco Malt",
    category: "health-drink-mixes",
    categoryId: "69a83fe41c2c00db0a9ba526",
    price: 70,
    offerPrice: 70,
    image: "/products/ragi-choco-malt-label.png",
    images: ["/products/ragi-choco-malt-label.png", "/products/ragi-choco-malt-front.png"],
    description: "Mansara Ragi Choco Malt is a nutritious health drink mix that combines the powerhouse nutrition of Ragi (Finger Millet) with the irresistible taste of premium cocoa.",
    highlights: ["No preservatives", "Millet-based with natural cocoa", "Rich in calcium", "Enriched with Saffron & Almonds"],
    ingredients: "Ragi (Finger Millet), Brown Sugar, Cocoa Powder, Cashew Nuts, Almonds, Dry Ginger, Cardamom, Saffron.",
    howToUse: "Mix 2 tbsp (approx. 25g) with milk or water. Cook on low flame with continuous stirring until smooth.",
    storage: "Store in a cool, dry place. Keep the container tightly closed.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 70, offerPrice: 70 },
      { weight: "250g", price: 180, offerPrice: 180 }
    ],
    isOffer: false,
    isNewArrival: true,
    isFeatured: true,
    isActive: true
  },
  {
    id: "69a8face2fef7ae403186838",
    _id: "69a8face2fef7ae403186838",
    slug: "ultimate-wellness-combo-5-mixes",
    name: "Ultimate Wellness Combo (5 Mixes)",
    category: "combos",
    categoryId: "69a8facd2fef7ae403186831",
    price: 260,
    offerPrice: 260,
    image: "/product-combo-5mixes.jpg",
    images: ["/product-combo-5mixes.jpg"],
    description: "Experience the complete range of Mansara Foods premium porridge mixes. This pack contains all 5 of our signature blends- Urad Porridge Mix (Classic, Premium, Salt & Pepper, Millet Magic) and Black Rice Delight.",
    short_description: "All 5 Premium Porridge Mixes (Excludes Idly Podi)",
    highlights: ["Value Pack", "All 5 Variants", "Perfect for Families"],
    ingredients: "Contains all 5 variants: Classic, Premium, Salt & Pepper, Millet Magic, and Black Rice Delight.",
    howToUse: "Each variant follows its own cooking instructions as detailed on its individual packaging.",
    storage: "Store in a cool, dry place.",
    weight: "1kg (5 x 200g)",
    isOffer: false,
    isNewArrival: false,
    isFeatured: true,
    isActive: true
  }
];

export const combos: Combo[] = [
  {
    id: "69a8face2fef7ae403186838",
    slug: "ultimate-wellness-combo-5-mixes",
    name: "Ultimate Wellness Combo (5 Mixes)",
    products: [
      "69a83fe51c2c00db0a9ba527",
      "69a83fe61c2c00db0a9ba528",
      "69a83fe61c2c00db0a9ba529",
      "69a83fe61c2c00db0a9ba52a",
      "69a83fe61c2c00db0a9ba52b"
    ],
    originalPrice: 275,
    comboPrice: 260,
    image: "/product-combo-5mixes.jpg",
    description: "Experience the complete range of Mansara Foods premium porridge mixes."
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id || p._id === id);
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
  return products.filter(p => p.slug === 'ragi-choco-malt');
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category || p.categoryId === category);
};
