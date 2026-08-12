export interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  images?: string[];
  slug: string;
  createdAt: string;
  author: string;
  category: string;
  readTime?: string;
  relatedProducts?: { name: string; slug: string; image: string; price: number }[];
}

export const blogPosts: BlogPost[] = [
  {
    _id: "blog-babies-kids-01",
    id: "blog-babies-kids-01",
    slug: "health-mix-for-babies-and-kids",
    title: "Sathu Maavu for Babies & Kids: Complete Guide to Traditional Infant Nutrition",
    excerpt: "Discover why traditional sprouted sathu maavu is the best health mix for infants, growing toddlers, and lactating mothers.",
    category: "Mothers & Children",
    author: "Mansara Nutrition Team",
    createdAt: "2026-08-10T00:00:00.000Z",
    readTime: "5 min read",
    image: "/products/urad-classic-front.jpg",
    content: `
      <h2>The Timeless Goodness of Sathu Maavu for Babies & Infants</h2>
      <p>
        Introducing solid foods to your baby is one of the most significant milestones in early parenthood. In traditional South Indian households, <strong>sathu maavu for babies</strong> has been the gold standard for infant nutrition for generations. Unlike commercial processed cereals loaded with artificial sugars and chemical preservatives, authentic home-style health mix relies on sprouted grains, pulses, and nuts.
      </p>
      <p>
        When searching for the <strong>best health mix for lactating mothers</strong> and weaning infants, sprouted multi-grain porridge provides complex carbohydrates, essential bio-available iron, calcium, and plant proteins necessary for healthy weight gain and cognitive development.
      </p>

      <h3>Why Sprouted Multi-Grains Matter for Growing Children</h3>
      <p>
        Sprouting grains like finger millet (ragi), whole black gram (urad dal), and green gram increases their enzymatic activity. This process breaks down anti-nutrients like phytic acid, making minerals significantly easier for delicate infant digestive tracts to absorb.
      </p>
      <ul>
        <li><strong>No Sugar Health Drink for Kids:</strong> Our health mixes rely solely on the natural subtle sweetness of cardamom, roasted almonds, and sprouted grains.</li>
        <li><strong>Rich in Bio-available Iron & Calcium:</strong> Vital for bone strength, motor skills development, and immunity.</li>
        <li><strong>Easy Digestion:</strong> Traditional slow roasting ensures the porridge is gentle on little stomachs, preventing colic and bloating.</li>
      </ul>

      <h3>Nutritious Breakfast for Kids in India</h3>
      <p>
        Preparing a <strong>healthy breakfast for kids in India</strong> doesn't have to take hours. A quick 10-minute warm bowl of sprouted <strong>millet health mix for children</strong> sweetened with natural palm jaggery or pure honey provides sustained stamina throughout the school day without sugar crashes.
      </p>
      
      <p>
        For nursing mothers, consuming warm urad health porridge daily promotes healthy lactation, restores stamina, and accelerates postpartum recovery naturally.
      </p>
    `,
    relatedProducts: [
      { name: "Nutrimix Super Health Mix", slug: "nutrimix-super-health-mix", image: "/products/urad-classic-front.jpg", price: 160 },
      { name: "Urad Health Mix – Classic", slug: "urad-porridge-mix-classic", image: "/products/urad-classic-front.jpg", price: 70 },
      { name: "Ragi Choco Malt", slug: "ragi-choco-malt", image: "/products/urad-premium-front.jpg", price: 180 }
    ]
  },
  {
    _id: "blog-weight-loss-02",
    id: "blog-weight-loss-02",
    slug: "health-mix-for-weight-loss",
    title: "High Fiber & Protein Rich Health Mix for Sustainable Weight Loss",
    excerpt: "Learn how incorporating traditional high-fiber porridge mixes into your morning routine supports metabolism, satiety, and fat loss.",
    category: "Fitness & Weight Loss",
    author: "Mansara Wellness Team",
    createdAt: "2026-08-11T00:00:00.000Z",
    readTime: "4 min read",
    image: "/products/black-rice-delight-front.jpg",
    content: `
      <h2>Transform Your Morning Routine with Health Mix for Weight Loss</h2>
      <p>
        Maintaining calorie balance while meeting daily micronutrient requirements is the cornerstone of sustainable weight management. If you are searching for an effective <strong>health mix for weight loss</strong>, traditional South Indian porridge mixes offer the perfect combination of high dietary fiber, complex carbohydrates, and plant-based protein.
      </p>

      <h3>Why High Fiber Breakfast Mixes Keep You Satiated</h3>
      <p>
        A typical <strong>high fiber breakfast in India</strong> often relies on heavily processed oats or packaged cereals. However, traditional ancient grains—such as Karuppu Kavuni (Black Rice), sprouted Urad Dal, and Barnyard Millet—possess a significantly higher soluble fiber content.
      </p>
      <p>
        When consumed as a warm <strong>protein rich porridge mix</strong> in the morning, the soluble fiber expands in the digestive system, slowing gastric emptying and stabilizing blood glucose levels. This prevents mid-morning hunger pangs, mindless snacking, and insulin spikes.
      </p>

      <h3>Metabolic Benefits of Ancient Black Rice & Sprouted Urad</h3>
      <ul>
        <li><strong>Anthocyanin Rich Black Rice:</strong> Ancient Kavuni rice is packed with potent antioxidants that reduce systemic inflammation and support metabolic health.</li>
        <li><strong>Sprouted Urad Protein:</strong> Provides rich amino acids for muscle tissue repair while burning more calories during digestion (thermic effect of food).</li>
        <li><strong>Low Glycemic Response:</strong> Prevents rapid insulin spikes that trigger body fat storage.</li>
      </ul>

      <p>
        Replacing sugary breakfast cereals with a savory or naturally sweetened bowl of Mansara Black Rice Delight or Urad Health Mix Premium helps you maintain energy throughout workouts and busy workdays while burning fat naturally.
      </p>
    `,
    relatedProducts: [
      { name: "Health Mix – Black Rice Delight", slug: "black-rice-delight-porridge-mix", image: "/products/black-rice-delight-front.jpg", price: 70 },
      { name: "Urad Health Mix – Premium", slug: "urad-porridge-mix-premium", image: "/products/urad-premium-front.jpg", price: 75 },
      { name: "Nutrimix Super Health Mix", slug: "nutrimix-super-health-mix", image: "/products/urad-classic-front.jpg", price: 160 }
    ]
  },
  {
    _id: "blog-diabetics-03",
    id: "blog-diabetics-03",
    slug: "millet-mix-for-diabetics",
    title: "Low GI Millet Porridge Mix for Diabetics & Senior Health",
    excerpt: "Discover how low glycemic index millets and urad porridge mixes help seniors and diabetic individuals manage blood sugar levels naturally.",
    category: "Diabetic & Senior Care",
    author: "Mansara Health Desk",
    createdAt: "2026-08-11T00:00:00.000Z",
    readTime: "5 min read",
    image: "/products/urad-millet-magic-front.jpg",
    content: `
      <h2>Managing Glycemic Health with Millet Mix for Diabetics</h2>
      <p>
        Finding a nutritious, satisfying breakfast that does not spike blood sugar is a daily challenge for millions living with Type 2 diabetes or pre-diabetes. A carefully formulated <strong>millet mix for diabetics</strong> provides a natural, traditional solution to blood glucose management.
      </p>

      <h3>Understanding Low GI Breakfast Options in India</h3>
      <p>
        The Glycemic Index (GI) measures how rapidly a food elevates blood sugar. White rice and refined wheat flour have high GI values (>70), causing sharp glucose surges. Conversely, ancient South Indian millets—such as Foxtail Millet, Kodo Millet, and Finger Millet combined with Urad Dal—fall into the <strong>low GI breakfast India</strong> category (<55).
      </p>

      <h3>Key Benefits of Health Mix for Elderly & Seniors</h3>
      <p>
        As we age, digestive capacity weakens, joint stiffness increases, and bone density naturally declines. Incorporating a nutrient-dense <strong>health mix for elderly</strong> family members delivers essential benefits:
      </p>
      <ul>
        <li><strong>Joint & Bone Support:</strong> Rich in bio-available calcium and phosphorus from finger millet and whole black gram.</li>
        <li><strong>Gentle Digestibility:</strong> Traditional roasting and grinding break down complex starches into easily digestible meals.</li>
        <li><strong>Cardiovascular Wellness:</strong> Magnesium and dietary potassium help maintain healthy blood pressure levels.</li>
      </ul>

      <p>
        Mansara Urad Health Mix – Millet Magic is crafted specifically to deliver balanced energy, gut comfort, and glycemic stability without added preservatives or sugars.
      </p>
    `,
    relatedProducts: [
      { name: "Urad Health Mix – Millet Magic", slug: "urad-porridge-mix-millet-magic", image: "/products/urad-millet-magic-front.jpg", price: 70 },
      { name: "Health Mix – Black Rice Delight", slug: "black-rice-delight-porridge-mix", image: "/products/black-rice-delight-front.jpg", price: 70 },
      { name: "Millet Fusion Idly Podi", slug: "millet-fusion-idly-podi", image: "/products/MilletFusionIdlyPodiFront.jpg", price: 75 }
    ]
  },
  {
    _id: "blog-nri-shipping-04",
    id: "blog-nri-shipping-04",
    slug: "international-shipping-south-indian-food",
    title: "Buy Sathu Maavu & Authentic Idly Podi Online in USA & Worldwide",
    excerpt: "Learn how Tamil diaspora and NRI families in the USA, UK, UAE, and Europe can order authentic, export-compliant South Indian health mixes online.",
    category: "NRI & Worldwide Delivery",
    author: "Mansara Global Operations",
    createdAt: "2026-08-12T00:00:00.000Z",
    readTime: "4 min read",
    image: "/products/SaltnPepperFront.jpg",
    content: `
      <h2>Bringing Authentic Taste of Home to the Global Tamil Diaspora</h2>
      <p>
        For South Indian families living abroad in North America, Europe, Australia, and the Gulf, craving traditional homemade food is a familiar experience. Searching to <strong>buy sathu maavu online USA</strong> or order <strong>authentic idly podi online delivery</strong> often leads to stale store-bought brands that have been sitting on importer shelves for months.
      </p>
      <p>
        At <strong>Mansara Foods</strong>, we bridge that gap by shipping freshly prepared, export-compliant traditional porridge mixes and idly podis straight from Chennai to your international doorstep.
      </p>

      <h3>Freshly Roasted & Export-Compliant Packaging</h3>
      <p>
        Whether you are looking for <strong>South Indian health mix international shipping</strong> or specialty herbal rice mixes like Moringa or Pirandai Podi, our export quality standards guarantee total freshness:
      </p>
      <ul>
        <li><strong>FSSAI & Export Certified:</strong> Fully compliant with international food safety standards and custom clearances.</li>
        <li><strong>Airtight Moisture-Proof Foil Sealing:</strong> Keeps delicate essential oils, roasted aromas, and crisp podi textures intact across long transit times.</li>
        <li><strong>Direct Home Delivery:</strong> Ships quickly via reliable courier partners to USA, UK, Canada, UAE, Singapore, and Europe.</li>
      </ul>

      <h3>Popular Products for International Shipping</h3>
      <p>
        Our international customers love our value combo packs including 27-ingredient Nutrimix, Urad Health Mixes, and signature Idly Podis. Order online at Mansara Foods to experience genuine home flavor wherever you are in the world.
      </p>
    `,
    relatedProducts: [
      { name: "Nutrimix Super Health Mix", slug: "nutrimix-super-health-mix", image: "/products/urad-classic-front.jpg", price: 160 },
      { name: "Urad Health Mix – Classic 250g", slug: "urad-porridge-mix-classic-250g", image: "/products/urad-classic-front.jpg", price: 165 },
      { name: "Millet Fusion Idly Podi", slug: "millet-fusion-idly-podi", image: "/products/MilletFusionIdlyPodiFront.jpg", price: 75 }
    ]
  }
];

export default blogPosts;
