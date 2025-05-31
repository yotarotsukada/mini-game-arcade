import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData, // Import useLoaderData
  Form, // Import Form for logout
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"; // Import LoaderFunctionArgs
import { json } from "@remix-run/node"; // Import json

import "./tailwind.css";
import { authenticator, User } from "~/services/auth.server"; // Import authenticator and User type

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Loader to get the user
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  return json({ user });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>() as { user: User | null };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
            My App
          </a>
          <div>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span>
                  {user.displayName || user.email}
                  {user.photoURL && <img src={user.photoURL} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", marginLeft: "0.5rem" }} />}
                </span>
                <Form method="post" action="/logout">
                  <button type="submit">Logout</button>
                </Form>
              </div>
            ) : (
              <a href="/login">Login</a>
            )}
          </div>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
