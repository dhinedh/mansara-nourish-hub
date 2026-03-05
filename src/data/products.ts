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
  },
  {
    id: "69a83fe41c2c00db0a9ba528",
    _id: "69a83fe41c2c00db0a9ba528",
    name: "Idly Podi",
    value: "idly-podi",
    slug: "idly-podi"
  },
  {
    id: "69a83fe41c2c00db0a9ba529",
    _id: "69a83fe41c2c00db0a9ba529",
    name: "Rice Mixes",
    value: "rice-mixes",
    slug: "rice-mixes"
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
    price: 55,
    offerPrice: 55,
    image: "/products/urad-classic-front.jpg",
    images: ["/products/urad-classic-front.jpg", "/products/urad-classic-back.jpg", "/products/urad-classic-side.jpg"],
    description: "Mansara Classic Urad Porridge Mix is a time-tested nourishing blend made primarily from premium black gram (Urad Dal). It is formulated to be gentle on the stomach while providing essential proteins and energy. This traditional porridge helps in strengthening the body and is an excellent choice for a healthy, easily digestible meal or snack for children, adults, and the elderly.",
    highlights: ["High Protein", "Easy Digestion", "No Preservatives", "Traditional Recipe"],
    ingredients: "Black Gram (Urad Dal), Samba Wheat, Fried Gram, Cardamom.",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 55, offerPrice: 55 },
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
    price: 55,
    offerPrice: 55,
    image: "/products/urad-salt-pepper-front.jpg",
    images: ["/products/urad-salt-pepper-front.jpg", "/products/urad-salt-pepper-back.jpg", "/products/urad-salt-pepper-side.jpg"],
    description: "Mansara Urad Porridge Mix – Salt & Pepper is a savoury twist on the traditional ulunthankanji, infused into natural spices like pepper and mild seasoning for a comforting yet flavourful experience.",
    highlights: ["No artificial flavours", "Digestive spices", "Savoury taste", "Good for gut health"],
    ingredients: "Black Gram (60.9%), Kavuni Rice (30%), Black Pepper (4.55%), Cumin Seeds (2.73%), Salt (1.82%).",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously to avoid lumps, and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 55, offerPrice: 55 },
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
    price: 60,
    offerPrice: 60,
    image: "/products/urad-millet-magic-back.jpg",
    images: ["/products/urad-millet-magic-front.jpg", "/products/urad-millet-magic-back.jpg", "/products/urad-millet-magic-side.jpg"],
    description: "Mansara Millet Magic Urad Porridge Mix brings together the muscle-strengthening benefits of black gram with the mineral-rich goodness of diverse millets.",
    highlights: ["Fiber Rich", "Mineral Rich", "Low GI", "Muscle Support"],
    ingredients: "Black Gram, Finger Millet, Foxtail Millet, Pearl Millet, Little Millet, Kodo Millet, Barnyard Millet, Jowar, Bajra, Spices.",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 60, offerPrice: 60 },
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
    price: 65,
    offerPrice: 65,
    image: "/products/urad-premium-front.jpg",
    images: ["/products/urad-premium-front.jpg", "/products/urad-premium-back.jpg", "/products/urad-premium-side.jpg"],
    description: "Mansara Premium Urad Porridge Mix is a carefully crafted blend designed for those who want maximum nutrition in every serving.",
    highlights: ["Finer grind", "Premium processing", "Multi-Grain", "High Nutrition", "Immunity Support"],
    ingredients: "Black Gram, Ragi, Kavuni Rice, Mappillai Samba Rice, Bamboo Rice, Red Rice, Hand-Pounded Rice.",
    howToUse: "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    storage: "Store in a cool, dry place.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 65, offerPrice: 65 },
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
    category: "idly-podi",
    categoryId: "69a83fe41c2c00db0a9ba528",
    price: 75,
    offerPrice: 75,
    image: "/products/MilletFusionIdlyPodi.PNG",
    images: ["/products/MilletFusionIdlyPodi.PNG", "/products/MilletFusionIdlyPodiLabel.PNG"],
    description: "A nutritious millet-enriched idly podi combining lentils, millets, and spices for a healthy traditional side dish.",
    highlights: ["No preservatives", "Millet enriched formula", "Traditional roast & grind", "Suitable for all age groups"],
    ingredients: "Black Gram (கருப்பு உளுந்து), Bengal Gram (கடலைப்பருப்பு), Green Gram (பாசிப்பருப்பு), Fried Gram (வருத்தக்கடலை), Foxtail Millet (தினை), Little Millet (சாமை), Barnyard Millet (குதிரைவாலி), Kodo Millet (வரகு), Dry Red Chilli (காய்ந்த மிளகாய்), Kashmiri Chilli (காஷ்மீரி மிளகாய்), Toor Dal (துவரம் பருப்பு), Salt (உப்பு), Black Pepper (மிளகு), Asafoetida (பெருங்காயம்)",
    howToUse: "Mix with gingelly oil or ghee and serve with idly, dosa, chapati, or poori.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    weight: "100g",
    variants: [
      { weight: "100g", price: 75, stock: 100 }
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
    image: "/products/RagiChocoMalt.PNG",
    images: ["/products/RagiChocoMalt.PNG", "/products/RagiChocoMaltLabel.PNG"],
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
  },
  {
    id: "prod-nutrimix",
    slug: "nutrimix-super-health-mix",
    name: "NutriMix Super Health Mix",
    category: "health-drink-mixes",
    categoryId: "69a83fe41c2c00db0a9ba526",
    price: 200,
    offerPrice: 200,
    stock: 100,
    weight: "250g",
    image: "/products/NutriMix.PNG",
    images: ["/products/NutriMix.PNG", "/products/NutriMix_Label.PNG"],
    description: "A traditional 27-ingredient multi-grain health mix designed for complete family nutrition and strength.",
    highlights: [
      "No preservatives",
      "27 wholesome ingredients",
      "High protein & high fibre",
      "Suitable for 8+ months to elderly"
    ],
    ingredients: "Ragi, Kollu, Green Gram, Badam, Barley, Red Rice, Samba Wheat, Cashew, Kambu, Kaikuthal Rice, Kavuni Rice, Javvarisi, Yellow Cholam, White Cholam, Rajma, Black Gram, Groundnut, Moongil Arisi, Kaatu Yaanai Rice, Mappillai Samba, Fried Gram (Udacha Kadalai), Thinai, Saamai, Guthirai Vaali, Varagu, Dry Ginger, Cardamom",
    howToUse: "Mix 2 tbsp with water, cook on low flame with stirring till thick. Add milk/salt/jaggery as preferred. Serve warm.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: true,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "250g", price: 200, stock: 100 }
    ]
  },
  {
    id: "prod-traditional-idly-podi",
    slug: "traditional-idly-podi",
    name: "Traditional Idly Podi",
    category: "idly-podi",
    categoryId: "69a83fe41c2c00db0a9ba528",
    price: 80,
    offerPrice: 80,
    stock: 100,
    weight: "100g",
    image: "/products/TraditionalIdlyPodi.PNG",
    images: ["/products/TraditionalIdlyPodi.PNG", "/products/TraditionalIdlyPodiLabel.PNG"],
    description: "A classic South Indian idly podi made from roasted lentils and spices, crafted to enhance the taste of idly and dosa.",
    highlights: [
      "No preservatives",
      "Authentic roast & grind",
      "Homemade taste",
      "Suitable for all age groups"
    ],
    ingredients: "Black Gram (கருப்பு உளுந்து), Bengal Gram (கடலைப்பருப்பு), Green Gram (பாசிப்பருப்பு), Fried Gram (வருத்தக்கடலை), Dry Red Chilli (காய்ந்த மிளகாய்), Kashmiri Chilli (காஷ்மீரி மிளகாய்), Toor Dal (துவரம் பருப்பு), Salt (உப்பு), Black Pepper (மிளகு), Asafoetida (பெருங்காயம்)",
    howToUse: "Mix required quantity with gingelly oil or ghee. Best served with idly, dosa, uthappam, or chapati.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: false,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "100g", price: 80, stock: 100 }
    ]
  },
  {
    id: "prod-home-style-paruppu-podi",
    slug: "home-style-paruppu-podi",
    name: "Home Style Paruppu Podi",
    category: "rice-mixes",
    categoryId: "69a83fe41c2c00db0a9ba529",
    price: 80,
    offerPrice: 80,
    stock: 100,
    weight: "100g",
    image: "/products/HomeStyleParuppu.PNG",
    images: ["/products/HomeStyleParuppu.PNG", "/products/HomeStyleParuppuLabel.PNG"],
    description: "A homestyle protein-rich paruppu podi made from roasted dals and spices, perfect for mixing with hot rice and ghee.",
    highlights: [
      "No preservatives",
      "Protein rich formula",
      "Traditional recipe",
      "Suitable for all age groups"
    ],
    ingredients: "Toor Daal, Bengal Gram, Green Gram, Fried Gram (Udacha Kadalai), Cumin Seeds, Salt, Pepper, Dry Chilli, Kashmiri Chilli, Asafoetida",
    howToUse: "Mix 1–2 tsp with hot rice and ghee or gingelly oil. Also pairs with idly and dosa.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: false,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "100g", price: 80, stock: 100 }
    ]
  },
  {
    id: "prod-karuveppillai-special",
    slug: "karuveppillai-special",
    name: "Karuveppillai Special",
    category: "rice-mixes",
    categoryId: "69a83fe41c2c00db0a9ba529",
    price: 80,
    offerPrice: 80,
    stock: 100,
    weight: "100g",
    image: "/products/KaruveppillaiSpecial.PNG",
    images: ["/products/KaruveppillaiSpecial.PNG", "/products/KaruveppillaiSpecialLabel.PNG"],
    description: "A flavourful curry leaf rice mix blended with lentils and spices for a fragrant traditional meal.",
    highlights: [
      "No preservatives",
      "Curry leaf rich blend",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    ingredients: "Toor Dhal, Urad Dhal, Pepper, Jeera, Salt, Hing, Curry Leaves, Red Chilli, Tamarind",
    howToUse: "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: false,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "100g", price: 80, stock: 100 }
    ]
  },
  {
    id: "prod-kotha-malli-aroma",
    slug: "kotha-malli-aroma",
    name: "Kotha Malli Aroma",
    category: "rice-mixes",
    categoryId: "69a83fe41c2c00db0a9ba529",
    price: 80,
    offerPrice: 80,
    stock: 100,
    weight: "100g",
    image: "/products/KothamalliAroma.PNG",
    images: ["/products/KothamalliAroma.PNG", "/products/KothamalliAromaLabel.PNG"],
    description: "A fragrant coriander-based rice mix with roasted lentils and spices for quick, tasty meals.",
    highlights: [
      "No preservatives",
      "Rich coriander aroma",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    ingredients: "Dhaniya (Coriander), Urad Dhal, Jeera, Red Chilli, Salt, Asafoetida",
    howToUse: "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: false,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "100g", price: 80, stock: 100 }
    ]
  },
  {
    id: "prod-murungai-vital",
    slug: "murungai-vital",
    name: "Murungai Vital",
    category: "rice-mixes",
    categoryId: "69a83fe41c2c00db0a9ba529",
    price: 85,
    offerPrice: 85,
    stock: 100,
    weight: "100g",
    image: "/products/MurungaiVital.PNG",
    images: ["/products/MurungaiVital.PNG", "/products/MurungaiVitalLabel.PNG"],
    description: "A nutritious moringa leaf rice mix blended with lentils and spices for daily wellness.",
    highlights: [
      "No preservatives",
      "Moringa (Drumstick leaf) rich",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    ingredients: "Murungai Keerai (Moringa Leaves), Gram Dhal, Urad Dhal, Tamarind, Salt, Asafoetida",
    howToUse: "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: false,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "100g", price: 85, stock: 100 }
    ]
  },
  {
    id: "prod-pirandai-power",
    slug: "pirandai-power",
    name: "Pirandai Power",
    category: "rice-mixes",
    categoryId: "69a83fe41c2c00db0a9ba529",
    price: 85,
    offerPrice: 85,
    stock: 100,
    weight: "100g",
    image: "/products/PirandaiPower.PNG",
    images: ["/products/PirandaiPower.PNG", "/products/PirandaiPowerLabel.PNG"],
    description: "A traditional pirandai-based rice mix known for its distinctive taste and digestive benefits.",
    highlights: [
      "No preservatives",
      "Traditional herbal recipe",
      "Authentic roast & grind",
      "Suitable for all age groups"
    ],
    ingredients: "Pirandai (Adamant Creeper), Tamarind, Gram Dhal, Urad Dhal, Jeera, Pepper, Salt, Asafoetida",
    howToUse: "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    storage: "Store in a cool, dry place. Keep airtight after opening.",
    isFeatured: false,
    isNewArrival: false,
    isOffer: false,
    isActive: true,
    variants: [
      { weight: "100g", price: 85, stock: 100 }
    ]
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
