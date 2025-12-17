/*
  # MANSARA Foods - Seed Initial Data
  
  ## Data Seeded
  
  1. Categories
     - Porridge Mixes
     - Oil & Ghee
  
  2. Products (10 products)
     - 6 Porridge Mix products
     - 4 Oil & Ghee products
  
  3. Combos (4 combo offers)
  
  4. Content Pages
     - About Us
     - Why MANSARA
     - Contact Us
  
  ## Notes
  - Uses placeholder images (to be replaced with actual images)
  - All products marked as active
  - Featured products marked appropriately
*/

-- Insert Categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Porridge Mixes', 'porridge-mixes', 'Nutritious porridge mixes for a wholesome breakfast'),
  ('22222222-2222-2222-2222-222222222222', 'Oil & Ghee', 'oil-ghee', 'Pure, cold-pressed oils and traditional ghee')
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO products (id, name, slug, category_id, price, offer_price, image_url, description, ingredients, how_to_use, storage, weight, stock, is_offer, is_new_arrival, is_featured, is_active) VALUES
  -- Porridge Mixes
  (
    '10000000-0000-0000-0000-000000000001',
    'URAD Porridge Mix – Classic',
    'urad-porridge-mix-classic',
    '11111111-1111-1111-1111-111111111111',
    299.00,
    NULL,
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'Our signature URAD porridge mix, crafted with traditional wisdom for everyday nourishment. Made from carefully selected black gram, this classic blend is perfect for a wholesome breakfast.',
    'Black Gram (Urad Dal), Rice, Cumin, Black Pepper, Asafoetida, Salt',
    'Mix 2 tablespoons with warm water or milk. Cook for 5-7 minutes, stirring occasionally. Add ghee for enhanced taste.',
    'Store in a cool, dry place. Keep away from direct sunlight. Use within 6 months of opening.',
    '500g',
    50,
    false,
    false,
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'URAD Porridge Mix – Salt & Pepper',
    'urad-porridge-mix-salt-pepper',
    '11111111-1111-1111-1111-111111111111',
    329.00,
    279.00,
    'https://images.pexels.com/photos/1030942/pexels-photo-1030942.jpeg',
    'A savory twist on our classic URAD mix, enhanced with the warmth of freshly ground black pepper. Perfect for those who prefer a more robust flavor profile.',
    'Black Gram (Urad Dal), Rice, Black Pepper, Rock Salt, Cumin, Asafoetida',
    'Mix 2 tablespoons with warm water. Cook for 5-7 minutes. Best enjoyed hot with a drizzle of sesame oil.',
    'Store in a cool, dry place. Keep away from direct sunlight. Use within 6 months of opening.',
    '500g',
    35,
    true,
    false,
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'URAD Porridge Mix – Millet Magic',
    'urad-porridge-mix-millet-magic',
    '11111111-1111-1111-1111-111111111111',
    349.00,
    NULL,
    'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
    'The power of millets combined with URAD for a nutritionally superior porridge. Rich in fiber and essential minerals for holistic wellness.',
    'Black Gram (Urad Dal), Finger Millet (Ragi), Foxtail Millet, Cumin, Black Pepper, Salt',
    'Mix 2 tablespoons with warm water or milk. Cook for 7-8 minutes. Add jaggery or honey for natural sweetness.',
    'Store in a cool, dry place. Keep away from direct sunlight. Use within 6 months of opening.',
    '500g',
    40,
    false,
    true,
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'URAD Porridge Mix – Premium',
    'urad-porridge-mix-premium',
    '11111111-1111-1111-1111-111111111111',
    449.00,
    399.00,
    'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg',
    'Our finest selection of URAD porridge mix, featuring premium quality ingredients and enhanced nutritional profile for the discerning health enthusiast.',
    'Premium Black Gram (Urad Dal), Basmati Rice, Organic Cumin, Himalayan Pink Salt, Black Pepper',
    'Mix 2 tablespoons with warm milk. Cook for 5-6 minutes. Garnish with nuts and dried fruits.',
    'Store in a cool, dry place away from direct sunlight. Best consumed within 4 months of opening.',
    '500g',
    25,
    true,
    false,
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Porridge Mix – Black Rice Delight',
    'porridge-mix-black-rice-delight',
    '11111111-1111-1111-1111-111111111111',
    399.00,
    NULL,
    'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
    'Experience the antioxidant-rich goodness of black rice in this unique porridge blend. A modern superfood with traditional preparation methods.',
    'Black Rice (Kavuni), Black Gram, Cardamom, Cinnamon, Natural Vanilla',
    'Soak 2 tablespoons in water for 10 minutes. Cook with milk for 10-12 minutes. Sweeten with jaggery.',
    'Store in an airtight container in a cool, dry place. Use within 5 months of opening.',
    '400g',
    30,
    false,
    true,
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'Idly Powder Mix – Millet Fusion',
    'idly-powder-mix-millet-fusion',
    '11111111-1111-1111-1111-111111111111',
    279.00,
    NULL,
    'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
    'A nutritious millet-based idly powder that adds taste and health to your everyday idlis. Enjoy the traditional South Indian favorite with added wellness benefits.',
    'Mixed Millets, Urad Dal, Dried Red Chili, Curry Leaves, Asafoetida, Sesame Seeds',
    'Sprinkle generously over hot idlis. Mix with ghee or sesame oil for best taste. Can also be used with dosa.',
    'Store in a cool, dry place. Keep the container tightly closed. Use within 3 months of opening.',
    '200g',
    60,
    false,
    true,
    false,
    true
  ),
  -- Oil & Ghee
  (
    '10000000-0000-0000-0000-000000000007',
    'Groundnut Oil – Classic',
    'groundnut-oil-classic',
    '22222222-2222-2222-2222-222222222222',
    549.00,
    499.00,
    'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg',
    'Pure, cold-pressed groundnut oil made from carefully selected peanuts. Our traditional extraction method preserves all natural nutrients and authentic flavor.',
    '100% Pure Groundnut Oil (Cold-Pressed)',
    'Ideal for deep frying, sautéing, and everyday cooking. Perfect for traditional South Indian dishes.',
    'Store in a cool, dark place. Keep away from direct sunlight and heat. Use within 6 months of opening.',
    '1 Litre',
    45,
    true,
    false,
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'Sesame Oil – Classic',
    'sesame-oil-classic',
    '22222222-2222-2222-2222-222222222222',
    599.00,
    NULL,
    'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg',
    'Traditional wood-pressed sesame oil with its characteristic nutty aroma and flavor. A staple in South Indian cooking and Ayurvedic practices.',
    '100% Pure Sesame Oil (Wood-Pressed)',
    'Perfect for tempering, marinades, and traditional recipes. Also suitable for oil pulling and massage.',
    'Store in a cool, dark place. Keep the bottle tightly sealed. Best used within 6 months.',
    '500ml',
    40,
    false,
    false,
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000009',
    'Coconut Oil – Classic',
    'coconut-oil-classic',
    '22222222-2222-2222-2222-222222222222',
    449.00,
    NULL,
    'https://images.pexels.com/photos/2090772/pexels-photo-2090772.jpeg',
    'Pure virgin coconut oil extracted from fresh coconuts using cold-press method. Retains natural aroma and all nutritional benefits.',
    '100% Pure Virgin Coconut Oil (Cold-Pressed)',
    'Excellent for cooking, baking, and as a hair/skin moisturizer. Ideal for Kerala-style dishes.',
    'Store at room temperature. May solidify in cold weather - this is natural. Use within 8 months.',
    '500ml',
    55,
    false,
    false,
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000010',
    'Ghee – Classic',
    'ghee-classic',
    '22222222-2222-2222-2222-222222222222',
    699.00,
    649.00,
    'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
    'Traditional bilona method ghee made from A2 cow milk. Rich in flavor and packed with the goodness of pure clarified butter.',
    '100% Pure A2 Cow Ghee (Bilona Method)',
    'Add to hot rice, rotis, or dal for enhanced taste. Perfect for making sweets and for tempering.',
    'Store in a cool, dry place. No refrigeration needed. Use clean, dry spoon. Best within 6 months.',
    '500g',
    30,
    true,
    false,
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert Combos
INSERT INTO combos (id, name, slug, description, image_url, original_price, combo_price, product_ids, is_active) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    'Morning Wellness Combo',
    'morning-wellness-combo',
    'Start your day right with our URAD Porridge Mix Classic and pure Groundnut Oil. A perfect combination for a wholesome breakfast.',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    848.00,
    749.00,
    '["10000000-0000-0000-0000-000000000001", "10000000-0000-0000-0000-000000000007"]',
    true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Complete Kitchen Essentials',
    'complete-kitchen-essentials',
    'All your cooking essentials in one combo - Groundnut Oil, Sesame Oil, and Premium Ghee for the perfect MANSARA kitchen.',
    'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg',
    1847.00,
    1599.00,
    '["10000000-0000-0000-0000-000000000007", "10000000-0000-0000-0000-000000000008", "10000000-0000-0000-0000-000000000010"]',
    true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Porridge Lovers Pack',
    'porridge-lovers-pack',
    'Try all three variants of our signature URAD Porridge Mix - Classic, Salt & Pepper, and Millet Magic.',
    'https://images.pexels.com/photos/1030942/pexels-photo-1030942.jpeg',
    977.00,
    849.00,
    '["10000000-0000-0000-0000-000000000001", "10000000-0000-0000-0000-000000000002", "10000000-0000-0000-0000-000000000003"]',
    true
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Family Nutrition Bundle',
    'family-nutrition-bundle',
    'Nourish your entire family with Millet Magic Porridge, Black Rice Delight, and Pure Ghee - complete nutrition in one bundle.',
    'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
    1447.00,
    1249.00,
    '["10000000-0000-0000-0000-000000000003", "10000000-0000-0000-0000-000000000005", "10000000-0000-0000-0000-000000000010"]',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert Content Pages
INSERT INTO content_pages (page_key, title, content) VALUES
  (
    'about',
    'About MANSARA',
    'MANSARA was founded in December 2020 with a deep personal purpose — to make pure, nourishing food a part of everyday life, especially for those seeking better balance, wellness, and long-term health. The brand was born from lived experience, care, and conviction — not just an idea.'
  ),
  (
    'why-mansara',
    'Why Choose MANSARA',
    'Because what you eat every day matters. MANSARA is built for families who want honest food, made with care — without shortcuts, exaggerations, or unnecessary complexity.'
  ),
  (
    'contact',
    'Contact Us',
    'We would love to hear from you. Whether you have a question about our products, feedback to share, or would like to collaborate with us, feel free to reach out.'
  )
ON CONFLICT (page_key) DO NOTHING;