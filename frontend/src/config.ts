export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-render-app-url.onrender.com"
    : "http://localhost:3000";
