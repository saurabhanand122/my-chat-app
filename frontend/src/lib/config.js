const DEFAULT_BACKEND_URL = import.meta.env.PROD
  ? "https://my-chat-app-two-delta.vercel.app"
  : "http://localhost:5001";

export const BACKEND_BASE_URL = (
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || DEFAULT_BACKEND_URL
).replace(/\/$/, "");
