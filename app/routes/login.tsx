import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server"; // Import getSession

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /
  // We redirect to / instead of /auth/google to prevent an infinite loop if Google auth fails
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("google", request);
}

export default function Login() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Login</h1>
      <p>Click the button below to login with your Google account.</p>
      <Form method="post">
        <button type="submit">Login with Google</button>
      </Form>
      <p>
        <Link to="/">Go back to homepage</Link>
      </p>
    </div>
  );
}
