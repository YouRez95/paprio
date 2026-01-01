const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const PORT = getEnv("PORT", "8080");
const ENV = getEnv("NODE_ENV", "development");
const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
const CLERK_WEBHOOK_SECRET_KEY = getEnv("CLERK_WEBHOOK_SECRET_KEY");
const DATABASE_URL = getEnv("DATABASE_URL");
const R2_ACCOUNT_ID = getEnv("R2_ACCOUNT_ID");
const R2_BUCKET_NAME = getEnv("R2_BUCKET_NAME");
const PDF_SECRET = getEnv("PDF_SECRET");
const DEFAULT_PDF_URL = getEnv("DEFAULT_PDF_URL", "/pdfs/default.pdf");

export {
  PORT,
  ENV,
  APP_ORIGIN,
  CLERK_WEBHOOK_SECRET_KEY,
  DATABASE_URL,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  PDF_SECRET,
  DEFAULT_PDF_URL,
};
