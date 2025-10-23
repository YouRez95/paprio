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

export { PORT, ENV, APP_ORIGIN, CLERK_WEBHOOK_SECRET_KEY };
