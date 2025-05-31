import { createCookieSessionStorage } from "@remix-run/node"; // Changed from remix-utils based on common practice for sessions

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
