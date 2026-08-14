/**
 * FALLBACK DATA - GENERATED AUTOMATICALLY
 * This file is used as the initial state for the frontend to ensure 0ms load times.
 * It is silently replaced by live data from the backend once the API responds.
 * Generated on: 9/4/2026, 7:41:52 am
 */

export interface Product {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  offerPrice?: number;
  originalPrice?: number;
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
  updatedAt?: string;
  createdAt?: string;
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
    "id": "69620cf57f9c4b0e78ddb918",
    "_id": "69620cf57f9c4b0e78ddb918",
    "name": "Urad Porridge Mix",
    "value": "urad-porridge-mix",
    "slug": "urad-porridge-mix"
  },
  {
    "id": "69620cf57f9c4b0e78ddb919",
    "_id": "69620cf57f9c4b0e78ddb919",
    "name": "Black Rice mix",
    "value": "black-rice-mix",
    "slug": "black-rice-mix"
  },
  {
    "id": "69620cf57f9c4b0e78ddb91a",
    "_id": "69620cf57f9c4b0e78ddb91a",
    "name": "Millet fusion mix",
    "value": "millet-fusion-mix",
    "slug": "millet-fusion-mix"
  },
  {
    "id": "6967d5e7c88a08abbf51f09a",
    "_id": "6967d5e7c88a08abbf51f09a",
    "name": "Combos",
    "value": "combos",
    "slug": "combos"
  },
  {
    "id": "69a83fe41c2c00db0a9ba528",
    "_id": "69a83fe41c2c00db0a9ba528",
    "name": "Idly Podi",
    "value": "idly-podi",
    "slug": "idly-podi"
  },
  {
    "id": "69a83fe41c2c00db0a9ba529",
    "_id": "69a83fe41c2c00db0a9ba529",
    "name": "Rice Mixes",
    "value": "rice-mixes",
    "slug": "rice-mixes"
  }
];

export const products: Product[] = [
  {
    "id": "69620f7e7f9c4b0e78ddbc4d",
    "_id": "69620f7e7f9c4b0e78ddbc4d",
    "slug": "urad-porridge-mix-classic",
    "updatedAt": "2026-08-01T10:00:00.000Z",
    "name": "Urad Health Mix – Classic",
    "category": "urad-porridge-mix",
    "categoryId": "69620cf57f9c4b0e78ddb918",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/urad-classic-front.jpg",
    "images": [
      "/products/urad-classic-front.jpg",
      "/products/urad-classic-back.jpg",
      "/products/urad-classic-side.jpg"
    ],
    "description": "Mansara Classic Urad Health Mix is a time-tested nourishing blend made primarily from premium black gram (Urad Dal).",
    "ingredients": "Black Gram (Urad Dal), Samba Wheat, Fried Gram, Cardamom.",
    "howToUse": "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    "storage": "Store in a cool, dry place.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": false,
    "isFeatured": false,
    "isActive": true,
    "stock": 49,
    "highlights": [
      "High Protein",
      "Easy Digestion",
      "No Preservatives",
      "Traditional Recipe"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "A traditional, wholesome porridge made with simple, time-tested ingredients for daily nourishment and easy digestion.",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 50
      },
      {
        "weight": "250g",
        "price": 165,
        "offerPrice": 160,
        "stock": 50
      }
    ]
  },
  {
    "id": "69620f7e7f9c4b0e78ddbc4e",
    "_id": "69620f7e7f9c4b0e78ddbc4e",
    "slug": "urad-porridge-mix-salt-pepper",
    "updatedAt": "2026-08-02T11:30:00.000Z",
    "name": "Urad Health Mix – Salt n Pepper",
    "category": "urad-porridge-mix",
    "categoryId": "69620cf57f9c4b0e78ddb918",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/urad-salt-pepper-front.jpg",
    "images": [
      "/products/urad-salt-pepper-front.jpg",
      "/products/urad-salt-pepper-back.jpg",
      "/products/urad-salt-pepper-side.jpg"
    ],
    "description": "Mansara Urad Health Mix – Salt n Pepper is a savoury twist on the traditional ulunthankanji.",
    "ingredients": "Black Gram (60.9%), Kavuni Rice (30%), Black Pepper (4.55%), Cumin Seeds (2.73%), Salt (1.82%).",
    "howToUse": "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously to avoid lumps, and serve warm.",
    "storage": "Store in a cool, dry place.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": false,
    "isFeatured": false,
    "isActive": true,
    "stock": 50,
    "highlights": [
      "No artificial flavours",
      "Digestive spices",
      "Savoury taste",
      "Good for gut health"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "A savoury porridge variant infused with pepper and cumin, ideal for light meals and comfort food needs.",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 50
      },
      {
        "weight": "250g",
        "price": 165,
        "offerPrice": 160,
        "stock": 50
      }
    ]
  },
  {
    "id": "69620f7f7f9c4b0e78ddbc4f",
    "_id": "69620f7f7f9c4b0e78ddbc4f",
    "slug": "urad-porridge-mix-millet-magic",
    "updatedAt": "2026-08-03T09:15:00.000Z",
    "name": "Urad Health Mix – Millet Magic",
    "category": "urad-porridge-mix",
    "categoryId": "69620cf57f9c4b0e78ddb918",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/urad-millet-magic-front.jpg",
    "images": [
      "/products/urad-millet-magic-front.jpg",
      "/products/urad-millet-magic-back.jpg",
      "/products/urad-millet-magic-side.jpg"
    ],
    "description": "Mansara Millet Magic Urad Health Mix brings together the muscle-strengthening benefits of black gram with the mineral-rich goodness of diverse millets.",
    "ingredients": "Black Gram, Finger Millet, Foxtail Millet, Pearl Millet, Little Millet, Kodo Millet, Barnyard Millet, Jowar, Bajra, Spices.",
    "howToUse": "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    "storage": "Store in a cool, dry place.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": false,
    "isFeatured": false,
    "isActive": true,
    "stock": 50,
    "highlights": [
      "Fiber Rich",
      "Mineral Rich",
      "Low GI",
      "Muscle Support"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "A nutritious porridge mix crafted with premium black gram and a carefully balanced selection of traditional millets.",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 50
      },
      {
        "weight": "250g",
        "price": 165,
        "offerPrice": 160,
        "stock": 50
      }
    ]
  },
  {
    "id": "69620f7f7f9c4b0e78ddbc50",
    "_id": "69620f7f7f9c4b0e78ddbc50",
    "slug": "urad-porridge-mix-premium",
    "updatedAt": "2026-08-04T14:20:00.000Z",
    "name": "Urad Health Mix – Premium",
    "category": "urad-porridge-mix",
    "categoryId": "69620cf57f9c4b0e78ddb918",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/urad-premium-front.jpg",
    "images": [
      "/products/urad-premium-front.jpg",
      "/products/urad-premium-back.jpg",
      "/products/urad-premium-side.jpg"
    ],
    "description": "Mansara Premium Urad Porridge Mix is a carefully crafted blend designed for those who want maximum nutrition in every serving. It includes enhanced proportions of protein-rich pulses and traditional ingredients to support strength, stamina, and immunity. This variant is ideal during recovery phases, high physical activity, or nutritional gaps.",
    "ingredients": "Black Gram, Ragi, Kavuni Rice, Mappillai Samba Rice, Bamboo Rice, Red Rice, Hand-Pounded Rice.",
    "howToUse": "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    "storage": "Store in a cool, dry place.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 50,
    "highlights": [
      "Finer grind",
      "Premium processing",
      "Multi-Grain",
      "High Nutrition",
      "Immunity Support"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "A premium porridge blend formulated with black gram, ragi, and a diverse selection of traditional Indian rice varieties.",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 49
      },
      {
        "weight": "250g",
        "price": 165,
        "offerPrice": 160,
        "stock": 50
      }
    ]
  },
  {
    "id": "69620f7f7f9c4b0e78ddbc51",
    "_id": "69620f7f7f9c4b0e78ddbc51",
    "slug": "black-rice-delight-porridge-mix",
    "updatedAt": "2026-08-05T16:45:00.000Z",
    "name": "Health Mix – Black Rice Delight",
    "category": "black-rice-mix",
    "categoryId": "69620cf57f9c4b0e78ddb919",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/black-rice-delight-front.jpg",
    "images": [
      "/products/black-rice-delight-front.jpg",
      "/products/black-rice-delight-back.jpg",
      "/products/black-rice-delight-side.jpg"
    ],
    "description": "Mansara Black Rice Delight Porridge Mix is made using traditional black rice (Karuppu Kavuni Arisi), known for its powerful antioxidant properties and mineral richness. Naturally high in iron, fibre, and anthocyanins, this porridge supports heart health, improved digestion, and sustained energy. Its earthy flavour and rich colour make it both nutritious and visually appealing.",
    "ingredients": "Kavuni Rice (49.50%), Samba Wheat (24.75%), Barley (12.87%), Horse Gram (12.87%).",
    "howToUse": "Take 2 tablespoons of mix. Add 250 ml of water, cook on medium flame for 10 minutes stirring continuously. Add Salt/Pepper/Jaggery to taste and serve warm.",
    "storage": "Store in a cool, dry place.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 50,
    "highlights": [
      "No added spices",
      "Grain-forward",
      "Antioxidant Rich",
      "Iron Rich",
      "Heart Healthy"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "A wholesome porridge blend formulated with traditional black rice (kavuni) and a balanced mix of grains including wheat and barley.",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 50
      },
      {
        "weight": "250g",
        "price": 165,
        "offerPrice": 160,
        "stock": 50
      }
    ]
  },
  {
    "id": "69620f7f7f9c4b0e78ddbc52",
    "_id": "69620f7f7f9c4b0e78ddbc52",
    "slug": "millet-fusion-idly-podi",
    "updatedAt": "2026-08-06T08:10:00.000Z",
    "name": "Idly Podi – Millet Fusion",
    "category": "idly-podi",
    "categoryId": "69a83fe41c2c00db0a9ba528",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/MilletFusionIdlyPodi.PNG",
    "images": [
      "/products/MilletFusionIdlyPodi.PNG",
      "/products/MilletFusionIdlyPodiLabel.PNG"
    ],
    "description": "A nutritious millet-enriched idly podi combining lentils, millets, and spices for a healthy traditional side dish.",
    "ingredients": "Black Gram (கருப்பு உளுந்து), Bengal Gram (கடலைப்பருப்பு), Green Gram (பாசிப்பருப்பு), Fried Gram (வருத்தக்கடலை), Foxtail Millet (தினை), Little Millet (சாமை), Barnyard Millet (குதிரைவாலி), Kodo Millet (வரகு), Dry Red Chilli (காய்ந்த மிளகாய்), Kashmiri Chilli (காஷ்மீரி மிளகாய்), Toor Dal (துவரம் பருப்பு), Salt (உப்பு), Black Pepper (மிளகு), Asafoetida (பெருங்காயம்)",
    "howToUse": "Mix with gingelly oil or ghee and serve with idly, dosa, chapati, or poori.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": false,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Millet enriched formula",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "A flavourful South Indian-style condiment formulated with a combination of lentils, traditional millets, and natural spices.",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  },
  {
    "id": "6967d5e7c88a08abbf51f0ac",
    "_id": "6967d5e7c88a08abbf51f0ac",
    "slug": "ultimate-wellness-combo-5-mixes",
    "updatedAt": "2026-08-07T12:00:00.000Z",
    "name": "Ultimate Wellness Combo (5 Mixes)",
    "category": "combos",
    "categoryId": "6967d5e7c88a08abbf51f09a",
    "price": 330,
    "offerPrice": 330,
    "originalPrice": 350,
    "image": "/product-combo-5mixes.jpg",
    "images": [],
    "description": "Experience the complete range of Mansara Foods premium porridge mixes. This pack contains all 5 of our signature blends- Urad Porridge Mix (Classic, Premium, Salt & Pepper, Millet Magic) and Black Rice Delight.",
    "ingredients": "",
    "howToUse": "",
    "storage": "",
    "weight": "",
    "isOffer": false,
    "isNewArrival": true,
    "isFeatured": true,
    "isActive": true,
    "stock": 50,
    "highlights": [],
    "nutrition": "",
    "compliance": "",
    "short_description": "All 5 Premium Porridge Mixes (Excludes Idly Podi)",
    "variants": []
  },
  {
    "id": "69a91a0c4ee07f2c99a1aea1",
    "_id": "69a91a0c4ee07f2c99a1aea1",
    "slug": "ragi-choco-malt",
    "updatedAt": "2026-08-08T15:30:00.000Z",
    "name": "Ragi Choco Malt",
    "category": "",
    "price": 250,
    "offerPrice": 245,
    "originalPrice": 250,
    "image": "/products/RagiChocoMalt.PNG",
    "images": [
      "/products/RagiChocoMalt.PNG",
      "/products/RagiChocoMaltLabel.PNG"
    ],
    "description": "Mansara Ragi Choco Malt is a nutritious health drink mix that combines the powerhouse nutrition of Ragi (Finger Millet) with the irresistible taste of premium cocoa.",
    "ingredients": "Ragi (Finger Millet), Brown Sugar, Cocoa Powder, Cashew Nuts, Almonds, Dry Ginger, Cardamom, Saffron.",
    "howToUse": "Mix 2 tbsp (approx. 25g) with milk or water. Cook on low flame with continuous stirring until smooth.",
    "storage": "Store in a cool, dry place. Keep the container tightly closed.",
    "weight": "250g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": true,
    "isActive": true,
    "stock": 50,
    "highlights": [
      "No preservatives",
      "Millet-based with natural cocoa",
      "Rich in calcium",
      "Enriched with Saffron & Almonds"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "250g",
        "price": 250,
        "offerPrice": 245,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b4091c2c00db0a9bf83e",
    "_id": "69a9b4091c2c00db0a9bf83e",
    "slug": "nutrimix-super-health-mix",
    "updatedAt": "2026-08-09T10:25:00.000Z",
    "name": "Nutriminix – Multi Grain Health Mix",
    "category": "",
    "price": 200,
    "offerPrice": 195,
    "originalPrice": 200,
    "image": "/products/NutriMix.PNG",
    "images": [
      "/products/NutriMix.PNG",
      "/products/NutriMix_Label.PNG"
    ],
    "description": "A traditional 27-ingredient multi-grain health mix designed for complete family nutrition and strength.",
    "ingredients": "Ragi, Kollu, Green Gram, Badam, Barley, Red Rice, Samba Wheat, Cashew, Kambu, Kaikuthal Rice, Kavuni Rice, Javvarisi, Yellow Cholam, White Cholam, Rajma, Black Gram, Groundnut, Moongil Arisi, Kaatu Yaanai Rice, Mappillai Samba, Fried Gram (Udacha Kadalai), Thinai, Saamai, Guthirai Vaali, Varagu, Dry Ginger, Cardamom",
    "howToUse": "Mix 2 tbsp with water, cook on low flame with stirring till thick. Add milk/salt/jaggery as preferred. Serve warm.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "250g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": true,
    "isActive": true,
    "stock": 99,
    "highlights": [
      "No preservatives",
      "27 wholesome ingredients",
      "High protein & high fibre",
      "Suitable for 8+ months to elderly"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "250g",
        "price": 200,
        "offerPrice": 195,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b40c1c2c00db0a9bf83f",
    "_id": "69a9b40c1c2c00db0a9bf83f",
    "slug": "traditional-idly-podi",
    "updatedAt": "2026-08-10T13:40:00.000Z",
    "name": "Idly Podi – Traditional",
    "category": "idly-podi",
    "categoryId": "69a83fe41c2c00db0a9ba528",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/TraditionalIdlyPodi.PNG",
    "images": [
      "/products/TraditionalIdlyPodi.PNG",
      "/products/TraditionalIdlyPodiLabel.PNG"
    ],
    "description": "Mansara Traditional Idly Podi (Classic Gunpowder) is an authentic South Indian breakfast condiment expertly blended to bring the genuine taste of home-cooked tiffins to your dining table. Crafted from a balanced combination of four roasted pulses—black gram (Urad Dal), Bengal gram, green gram, and fried gram—this podi is enriched with whole dried red chilies, Kashmiri chili for vibrant color, black pepper, toor dal, and aromatic asafoetida.\n\nEvery batch is slow-roasted over low flame to extract the deep, nutty aromas of the lentils before being ground to a coarse, textured perfection. To serve, mix two tablespoons with pure sesame (gingelly) oil, melted ghee, or coconut oil to form a savory paste, and dip soft warm idlies, crispy dosas, uthappams, or pooris. Packed with plant protein and dietary fiber, Mansara Traditional Idly Podi contains zero preservatives, synthetic colors, or artificial flavor enhancers, making it an essential pantry staple for every South Indian food lover.",
    "ingredients": "Black Gram (கருப்பு உளுந்து), Bengal Gram (கடலைப்பருப்பு), Green Gram (பாசிப்பருப்பு), Fried Gram (வருத்தக்கடலை), Dry Red Chilli (காய்ந்த மிளகாய்), Kashmiri Chilli (காஷ்மீரி மிளகாய்), Toor Dal (துவரம் பருப்பு), Salt (உப்பு), Black Pepper (மிளகு), Asafoetida (பெருங்காயம்)",
    "howToUse": "Mix required quantity with gingelly oil or ghee. Best served with idly, dosa, uthappam, or chapati.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Authentic roast & grind",
      "Homemade taste",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b40e1c2c00db0a9bf840",
    "_id": "69a9b40e1c2c00db0a9bf840",
    "slug": "home-style-paruppu-podi",
    "updatedAt": "2026-08-11T09:50:00.000Z",
    "name": "Home Style Paruppu Podi",
    "category": "rice-mixes",
    "categoryId": "69a83fe41c2c00db0a9ba529",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/HomeStyleParuppu.PNG",
    "images": [
      "/products/HomeStyleParuppu.PNG",
      "/products/HomeStyleParuppuLabel.PNG"
    ],
    "description": "Mansara Home Style Paruppu Podi is a wholesome, protein-dense lentil spice powder formulated to recreate the comforting flavor of traditional South Indian grandmother recipes. \"Paruppu\" (meaning lentils or pulses) forms the heart of this blend, combining slow-roasted Toor Dal, Bengal Gram, Green Gram, and Fried Gram (Udacha Kadalai) with cumin seeds, black pepper, dry red chilies, and digestive asafoetida.\n\nHigh in dietary protein and essential minerals, this versatile podi provides instant nourishment for the entire family. It is best enjoyed by mixing one or two teaspoons into a steaming bowl of hot rice drizzled with melted cow ghee or sesame oil, served alongside papad (appalam). It also offers a gentle, non-spicy alternative for kids and elderly family members seeking quick, digestible meal solutions. Free from preservatives, artificial colors, and chemical additives, Mansara Paruppu Podi delivers pure, authentic home-style comfort in every bite.",
    "ingredients": "Toor Daal, Bengal Gram, Green Gram, Fried Gram (Udacha Kadalai), Cumin Seeds, Salt, Pepper, Dry Chilli, Kashmiri Chilli, Asafoetida",
    "howToUse": "Mix 1–2 tsp with hot rice and ghee or gingelly oil. Also pairs with idly and dosa.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Protein rich formula",
      "Traditional recipe",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b4111c2c00db0a9bf841",
    "_id": "69a9b4111c2c00db0a9bf841",
    "slug": "karuveppillai-special",
    "updatedAt": "2026-08-12T11:15:00.000Z",
    "name": "Curry Leaves Rice Podi Mix",
    "category": "rice-mixes",
    "categoryId": "69a83fe41c2c00db0a9ba529",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/KaruveppillaiSpecial.PNG",
    "images": [
      "/products/KaruveppillaiSpecial.PNG",
      "/products/KaruveppillaiSpecialLabel.PNG"
    ],
    "description": "Mansara Curry Leaves Rice Podi Mix (Karuveppillai Special) is an authentic South Indian herb-and-lentil condiment crafted from farm-fresh curry leaves, hand-picked spices, and slow-roasted pulses. In traditional Tamil households, curry leaves are celebrated not only for their rich, earthy aroma but also for their high iron content, antioxidant properties, and are traditionally valued for digestion. This unique blend combines fresh Karuveppillai with protein-rich Toor Dal, Urad Dal, whole black pepper, and cumin seeds, creating a fragrant spice mix that elevates plain warm rice into a wholesome meal.\n\nPerfectly balanced with mild red chili warmth and tangy tamarind undertones, this curry leaf podi is ideal for busy mornings or light evening meals. Simply mix one to two teaspoons with steaming hot rice and a spoonful of cold-pressed gingelly oil or pure cow ghee. Beyond hot rice, it serves as a versatile seasoning for roasted vegetables, tiffin items, or idly and dosa. Free from added preservatives, artificial colors, and synthetic flavor enhancers, Mansara Curry Leaves Podi provides pure, home-style South Indian nutrition in every spoonful.",
    "ingredients": "Toor Dhal, Urad Dhal, Pepper, Jeera, Salt, Hing, Curry Leaves, Red Chilli, Tamarind",
    "howToUse": "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Curry leaf rich blend",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b4131c2c00db0a9bf842",
    "_id": "69a9b4131c2c00db0a9bf842",
    "slug": "kotha-malli-aroma",
    "updatedAt": "2026-08-13T14:00:00.000Z",
    "name": "Coriander Rice Podi Mix",
    "category": "rice-mixes",
    "categoryId": "69a83fe41c2c00db0a9ba529",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/KothamalliAroma.PNG",
    "images": [
      "/products/KothamalliAroma.PNG",
      "/products/KothamalliAromaLabel.PNG"
    ],
    "description": "Mansara Coriander Rice Podi Mix (Kothamalli Aroma) brings together the soothing, citrusy fragrance of roasted coriander seeds (Dhaniya) and wholesome South Indian lentils. Coriander has long been valued in traditional Indian cooking for its cooling digestive properties, ability to soothe the stomach, and rich dietary fiber profile. This aromatic rice seasoning is prepared by slow-roasting whole coriander seeds alongside Urad Dal, cumin, dried red chilies, and a hint of asafoetida (hing) to capture peak essential oils and flavor.\n\nOffering a refreshing departure from heavy spicy powders, Kothamalli Podi delivers a subtle, savory warmth that appeals to all age groups. It pairs wonderfully with warm white rice, brown rice, or millet rice drizzled with fresh ghee or sesame oil. It can also be sprinkled over dahi rice (curd rice) for an instant flavor upgrade. Hand-crafted in small batches without artificial additives or preservatives, Mansara Coriander Podi is your go-to solution for quick, digestive-friendly, and comforting home meals.",
    "ingredients": "Dhaniya (Coriander), Urad Dhal, Jeera, Red Chilli, Salt, Asafoetida",
    "howToUse": "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": false,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Rich coriander aroma",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b4151c2c00db0a9bf843",
    "_id": "69a9b4151c2c00db0a9bf843",
    "slug": "murungai-vital",
    "updatedAt": "2026-08-13T16:30:00.000Z",
    "name": "Moringa Rice Podi Mix",
    "category": "rice-mixes",
    "categoryId": "69a83fe41c2c00db0a9ba529",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/MurungaiVital.PNG",
    "images": [
      "/products/MurungaiVital.PNG",
      "/products/MurungaiVitalLabel.PNG"
    ],
    "description": "Mansara Moringa Rice Podi Mix (Murungai Vital) infuses the powerhouse nutrition of fresh drumstick leaves (Murungai Keerai) with slow-roasted lentils and aromatic Indian spices. Recognized globally as a plant-based superfood, moringa leaves are traditionally valued as a nutrient-dense addition to daily meals, naturally containing iron, calcium, and antioxidants.\n\nWe source young, tender moringa leaves, shade-dry them to preserve their vivid green color and micronutrients, and blend them with roasted Bengal gram, Urad dal, tamarind, and black pepper. The result is a savory, nutrient-dense podi that makes incorporating greens into your daily family diet effortless. Simply stir a generous spoon into warm cooked rice with ghee, or sprinkle over idlies, dosas, and parathas. Free from chemicals, artificial thickeners, and preservatives, Mansara Moringa Rice Podi offers a delicious, traditional pathway to daily vitality and wellness.",
    "ingredients": "Murungai Keerai (Moringa Leaves), Gram Dhal, Urad Dhal, Tamarind, Salt, Asafoetida",
    "howToUse": "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Moringa (Drumstick leaf) rich",
      "Traditional roast & grind",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  },
  {
    "id": "69a9b4251c2c00db0a9bf844",
    "_id": "69a9b4251c2c00db0a9bf844",
    "slug": "pirandai-power",
    "updatedAt": "2026-08-14T09:00:00.000Z",
    "name": "Pirandai Rice Podi Mix",
    "category": "rice-mixes",
    "categoryId": "69a83fe41c2c00db0a9ba529",
    "price": 75,
    "offerPrice": 70,
    "originalPrice": 75,
    "image": "/products/PirandaiPower.PNG",
    "images": [
      "/products/PirandaiPower.PNG",
      "/products/PirandaiPowerLabel.PNG"
    ],
    "description": "Mansara Pirandai Rice Podi Mix (Pirandai Power) is a specialized herbal-lentil blend featuring fresh Pirandai (Veldt Grape / Cissus quadrangularis), an ancient climbing herb traditionally used in Siddha cooking for digestive wellness. Because fresh Pirandai requires careful harvesting and roasting to eliminate natural itchiness, our expert recipe prepares it according to time-tested traditional methods.\n\nCombined with protein-rich Urad Dal, Bengal gram, cumin, black pepper, and tangy tamarind, this podi transforms a therapeutic herb into a delicious daily rice mix. It features a unique, tangy-spicy flavor profile that stimulates appetite and aids digestion after heavy meals. Enjoy it stirred into hot rice with sesame oil or ghee, or as a flavorful accompaniment to breakfast tiffins. Prepared without synthetic colors or chemical preservatives, Mansara Pirandai Podi is a genuine health-restorative specialty.",
    "ingredients": "Pirandai (Adamant Creeper), Tamarind, Gram Dhal, Urad Dhal, Jeera, Pepper, Salt, Asafoetida",
    "howToUse": "Mix with hot rice and ghee or gingelly oil. Serve warm.",
    "storage": "Store in a cool, dry place. Keep airtight after opening.",
    "weight": "100g",
    "isOffer": true,
    "isNewArrival": true,
    "isFeatured": false,
    "isActive": true,
    "stock": 100,
    "highlights": [
      "No preservatives",
      "Traditional herbal recipe",
      "Authentic roast & grind",
      "Suitable for all age groups"
    ],
    "nutrition": "",
    "compliance": "",
    "short_description": "",
    "variants": [
      {
        "weight": "100g",
        "price": 75,
        "offerPrice": 70,
        "stock": 100
      }
    ]
  }
];

export const combos: Combo[] = [
  {
    "id": "6967d5e7c88a08abbf51f0ac",
    "slug": "ultimate-wellness-combo-5-mixes",
    "name": "Ultimate Wellness Combo (5 Mixes)",
    "products": [
      "69620f7e7f9c4b0e78ddbc4d",
      "69620f7e7f9c4b0e78ddbc4e",
      "69620f7f7f9c4b0e78ddbc4f",
      "69620f7f7f9c4b0e78ddbc50",
      "69620f7f7f9c4b0e78ddbc51"
    ],
    "originalPrice": 350,
    "comboPrice": 330,
    "image": "/product-combo-5mixes.jpg",
    "description": "Experience the complete range of Mansara Foods premium porridge mixes. This pack contains all 5 of our signature blends- Urad Porridge Mix (Classic, Premium, Salt & Pepper, Millet Magic) and Black Rice Delight."
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
