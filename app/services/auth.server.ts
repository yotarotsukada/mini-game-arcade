import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "./session.server"; // We'll create this next

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not set");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not set");
}

export const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Here you would typically find or create a user in your database
    // For this example, we'll just return the profile information
    // Ensure you handle potential errors here from database operations
    return {
      id: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      photoURL: profile.photos?.[0]?.value,
    };
  }
);

authenticator.use(googleStrategy);

// Utility functions for requiring and getting user ID
import { redirect } from "@remix-run/node";

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    // If the user is not authenticated, redirect to login
    // preserving the path they were trying to access.
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return user.id;
}

export async function getUserId(request: Request): Promise<string | null> {
  const user = await authenticator.isAuthenticated(request);
  return user ? user.id : null;
}
