export default {
  // Provide connection URL for Prisma Migrate and Prisma Client
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
