const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || "dev_db",
  },
};
const pro = {
  app: {
    port: parseInt(process.env.PRO_APP_PORT) || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: parseInt(process.env.PRO_DB_PORT) || 27017,
    name: process.env.PRO_DB_NAME || "pro_db",
  },
};

const config = {
  dev,
  pro,
};
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
