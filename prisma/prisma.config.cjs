// Load .env so the Prisma CLI sees DATABASE_URL when requiring this config
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
} catch (e) { }

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
