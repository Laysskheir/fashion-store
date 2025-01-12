import { PrismaClient, CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDatabase() {
  // Delete in order of dependencies
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("Database cleaned");
}

async function seedCategories() {
  console.log("Seeding categories...");

  // Clean the database first
  await cleanDatabase();

  const men = await prisma.category.create({
    data: {
      name: "Men",
      slug: "men",
      type: CategoryType.PRODUCT,
      level: 0,
      children: {
        create: [
          {
            name: "T-Shirts",
            slug: "men-tshirts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Tank Tops",
            slug: "men-tank-tops",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Hoodies",
            slug: "men-hoodies",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Jackets",
            slug: "men-jackets",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Joggers",
            slug: "men-joggers",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Sweatpants",
            slug: "men-sweatpants",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Shorts",
            slug: "men-shorts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Pants",
            slug: "men-pants",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Sweaters",
            slug: "men-sweaters",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Polo Shirts",
            slug: "men-polo-shirts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
        ],
      },
    },
    include: {
      children: true,
    },
  });

  const women = await prisma.category.create({
    data: {
      name: "Women",
      slug: "women",
      type: CategoryType.PRODUCT,
      level: 0,
      children: {
        create: [
          {
            name: "T-Shirts",
            slug: "women-tshirts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Tank Tops",
            slug: "women-tank-tops",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Hoodies",
            slug: "women-hoodies",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Jackets",
            slug: "women-jackets",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Leggings",
            slug: "women-leggings",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Shorts",
            slug: "women-shorts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Dresses",
            slug: "women-dresses",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Skirts",
            slug: "women-skirts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Pants",
            slug: "women-pants",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Sweaters",
            slug: "women-sweaters",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Blouses",
            slug: "women-blouses",
            level: 1,
            type: CategoryType.PRODUCT,
          },
        ],
      },
    },
    include: {
      children: true,
    },
  });

  const kids = await prisma.category.create({
    data: {
      name: "Kids",
      slug: "kids",
      type: CategoryType.PRODUCT,
      level: 0,
      children: {
        create: [
          {
            name: "T-Shirts",
            slug: "kids-tshirts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Hoodies",
            slug: "kids-hoodies",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Pants",
            slug: "kids-pants",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Shorts",
            slug: "kids-shorts",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Dresses",
            slug: "kids-dresses",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Sweatpants",
            slug: "kids-sweatpants",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Jackets",
            slug: "kids-jackets",
            level: 1,
            type: CategoryType.PRODUCT,
          },
          {
            name: "Sweaters",
            slug: "kids-sweaters",
            level: 1,
            type: CategoryType.PRODUCT,
          },
        ],
      },
    },
    include: {
      children: true,
    },
  });

  console.log("\nCategories seeded!");
}

async function main() {
  await seedCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
