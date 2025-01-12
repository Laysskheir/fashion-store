const fs = require('fs');
const path = require('path');

// Product categories from seed.ts
const categories = {
  men: [
    { name: 'T-Shirts', slug: 'men-tshirts' },
    { name: 'Tank Tops', slug: 'men-tank-tops' },
    { name: 'Hoodies', slug: 'men-hoodies' },
    { name: 'Jackets', slug: 'men-jackets' },
    { name: 'Joggers', slug: 'men-joggers' },
    { name: 'Sweatpants', slug: 'men-sweatpants' },
    { name: 'Shorts', slug: 'men-shorts' },
    { name: 'Pants', slug: 'men-pants' },
    { name: 'Sweaters', slug: 'men-sweaters' },
    { name: 'Polo Shirts', slug: 'men-polo-shirts' },
  ],
  women: [
    { name: 'T-Shirts', slug: 'women-tshirts' },
    { name: 'Tank Tops', slug: 'women-tank-tops' },
    { name: 'Hoodies', slug: 'women-hoodies' },
    { name: 'Jackets', slug: 'women-jackets' },
    { name: 'Leggings', slug: 'women-leggings' },
    { name: 'Shorts', slug: 'women-shorts' },
    { name: 'Dresses', slug: 'women-dresses' },
    { name: 'Skirts', slug: 'women-skirts' },
    { name: 'Pants', slug: 'women-pants' },
    { name: 'Sweaters', slug: 'women-sweaters' },
    { name: 'Blouses', slug: 'women-blouses' },
  ],
  kids: [
    { name: 'T-Shirts', slug: 'kids-tshirts' },
    { name: 'Hoodies', slug: 'kids-hoodies' },
    { name: 'Pants', slug: 'kids-pants' },
    { name: 'Shorts', slug: 'kids-shorts' },
    { name: 'Dresses', slug: 'kids-dresses' },
    { name: 'Sweatpants', slug: 'kids-sweatpants' },
    { name: 'Jackets', slug: 'kids-jackets' },
    { name: 'Sweaters', slug: 'kids-sweaters' },
  ],
};

// Product attributes
const colors = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow'];
const styles = ['Classic', 'Modern', 'Casual', 'Sport', 'Elegant', 'Vintage', 'Urban', 'Essential'];
const materials = [
  '100% Cotton',
  '95% Cotton 5% Elastane',
  '80% Cotton 20% Polyester',
  '100% Polyester',
  '90% Cotton 10% Spandex',
  '70% Cotton 30% Polyester',
  '95% Polyester 5% Spandex',
];
const brands = ['UrbanStyle', 'Elegance', 'SportFit', 'KidsComfort', 'FashionPro', 'StyleLife'];

// Helper functions
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getRandomPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function getRandomWeight() {
  return (Math.random() * (1.2 - 0.2) + 0.2).toFixed(1);
}

function getRandomDimensions() {
  const length = Math.floor(Math.random() * (45 - 20) + 20);
  const width = Math.floor(Math.random() * (35 - 15) + 15);
  const height = Math.floor(Math.random() * (8 - 2) + 2);
  return `${length}x${width}x${height} cm`;
}

// Generate products for each category
function generateProducts() {
  let products = [];
  const sections = ['men', 'women', 'kids'];

  sections.forEach(section => {
    categories[section].forEach(category => {
      // Generate multiple products for each category
      const numProducts = Math.floor(Math.random() * (10 - 5) + 5); // 5-10 products per category
      
      for (let i = 0; i < numProducts; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const style = styles[Math.floor(Math.random() * styles.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        
        const name = `${style} ${color} ${category.name}`;
        const slug = generateSlug(`${style}-${color}-${section}-${category.name}-${i + 1}`);
        const basePrice = getRandomPrice(19.99, 149.99);
        
        const product = {
          name,
          slug,
          description: `${style} ${section}'s ${category.name.toLowerCase()} in ${color}. Made with ${material} for ultimate comfort and style.`,
          basePrice,
          isActive: true,
          brand,
          weight: getRandomWeight(),
          dimensions: getRandomDimensions(),
          material,
          careInstructions: 'Machine wash cold, tumble dry low',
          categoryId: category.slug
        };
        
        products.push(product);
      }
    });
  });

  return products;
}

// Generate CSV content
function generateCSV() {
  const products = generateProducts();
  const headers = Object.keys(products[0]);
  const csvContent = [
    headers.join(','),
    ...products.map(product => 
      headers.map(header => 
        JSON.stringify(product[header] || '')
      ).join(',')
    )
  ].join('\n');

  return csvContent;
}

// Write to file
const csvContent = generateCSV();
fs.writeFileSync(path.join(__dirname, 'fashion_products_sample.csv'), csvContent);
console.log('Generated fashion_products_sample.csv with', csvContent.split('\n').length - 1, 'products');