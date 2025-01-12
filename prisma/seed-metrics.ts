import { PrismaClient, OrderStatus, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

async function seedMetricsData() {
  // First, ensure we have a category
  let category = await prisma.category.findFirst()
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
        type: 'PRODUCT'
      }
    })
  }

  // Create some test products
  const products = await prisma.product.createMany({
    data: [
      { 
        name: 'Test Skincare Product', 
        slug: 'test-skincare-1', 
        basePrice: new Prisma.Decimal(29.99),
        categoryId: category.id,
        description: 'A test skincare product for metrics',
        brand: 'Test Brand'
      },
      { 
        name: 'Test Makeup Product', 
        slug: 'test-makeup-1', 
        basePrice: new Prisma.Decimal(39.99),
        categoryId: category.id,
        description: 'A test makeup product for metrics',
        brand: 'Test Brand'
      }
    ]
  })

  // Fetch the created products
  const createdProducts = await prisma.product.findMany({
    where: { 
      OR: [
        { slug: 'test-skincare-1' },
        { slug: 'test-makeup-1' }
      ]
    }
  })

  // Ensure a test user exists
  let testUser = await prisma.user.findFirst({
    where: { email: 'test@example.com' }
  })

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  // Create test variants
  const variants = await Promise.all(createdProducts.map(product => 
    prisma.variant.create({
      data: {
        name: `${product.name} - Default Variant`,
        sku: `SKU-${product.slug}`,
        productId: product.id,
        price: new Prisma.Decimal(product.basePrice.toNumber()),
        color: 'Default',
        size: 'One Size',
        inventory: 100
      }
    })
  ))

  // Create test address for test user
  const testAddress = await prisma.address.findFirst({
    where: { userId: testUser.id }
  });

  if (!testAddress) {
    throw new Error('No address found for test user');
  }

  // Create test order
  const order = await prisma.order.create({
    data: {
      userId: testUser.id,
      orderNumber: `TEST-${Date.now()}`, // Generate a unique order number
      status: 'PROCESSING' as OrderStatus,
      total: new Prisma.Decimal(69.98),
      subtotal: new Prisma.Decimal(59.98), // Adjust based on actual subtotal
      tax: new Prisma.Decimal(5.00),
      shipping: new Prisma.Decimal(5.00),
      addressId: testAddress.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Create order items
  await prisma.orderItem.createMany({
    data: variants.map(variant => ({
      orderId: order.id,
      productId: variant.productId,
      variantId: variant.id,
      quantity: 2,
      price: variant.price,
      total: new Prisma.Decimal(variant.price.toNumber() * 2)
    }))
  })

  // Create test reviews
  await prisma.review.createMany({
    data: createdProducts.map(product => ({
      productId: product.id,
      userId: testUser.id,
      rating: 4.5,
      comment: 'Great test product',
      title: 'Test Review', // Add required title
      createdAt: new Date()
    }))
  })

  console.log('Metrics test data seeded successfully')
}

seedMetricsData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())