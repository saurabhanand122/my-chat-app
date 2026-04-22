import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;

export const authCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "strict",
  secure: isProduction,
};

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    ...authCookieOptions,
  });

  return token;
};

export const getAuthToken = (req) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return req.cookies.jwt;
};
