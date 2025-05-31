import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/login" });
}

// You can also add a loader if you want to redirect GET requests to this route,
// or if you want to display a confirmation message before logging out.
// For simplicity, this example only includes the action.
// export async function loader() {
//   return redirect("/login"); // Or some other page
// }
