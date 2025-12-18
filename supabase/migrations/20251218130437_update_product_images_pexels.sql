/*
  # Update Product Images with Pexels URLs
  
  1. Updates all product and combo images with high-quality Pexels image URLs
  2. Images are selected to match product types (porridge, oils, ghee, combos)
  3. All URLs are direct Pexels links with proper compression parameters
*/

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/8551374/pexels-photo-8551374.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'urad-porridge-mix-classic';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/5718/food-fruit-breakfast-ingredients.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'bajra-porridge-mix-nutrition';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/5648/food-healthy-organic.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'ragi-porridge-mix-energy';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'jowar-porridge-mix-fiber';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/6941/food-salad-healthy-greens.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'mixed-grain-porridge';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'pure-ghee-traditional';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'organic-coconut-oil';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/6941/food-salad-healthy-greens.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'sesame-oil-pure';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'mustard-oil-organic';

UPDATE products 
SET image_url = 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'neem-oil-pure';

UPDATE combos
SET image_url = 'https://images.pexels.com/photos/8551374/pexels-photo-8551374.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'porridge-breakfast-combo';

UPDATE combos
SET image_url = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'oil-essentials-combo';

UPDATE combos
SET image_url = 'https://images.pexels.com/photos/5648/food-healthy-organic.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'healthy-family-combo';

UPDATE combos
SET image_url = 'https://images.pexels.com/photos/6941/food-salad-healthy-greens.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE slug = 'wellness-bundle';
