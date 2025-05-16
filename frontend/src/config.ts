export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://build-ai-ws.onrender.com"
    : "http://localhost:3000";
