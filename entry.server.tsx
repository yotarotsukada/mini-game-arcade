import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
  // loadContext?: AppLoadContext // AppLoadContext is available for Cloudflare
) {
  let html = renderToString(
    <RemixServer context={remixContext} url={remixContext.url} />
  );
  responseHeaders.set("Content-Type", "text/html"); // Ensure Content-Type is set
  html = "<!DOCTYPE html>" + html;
  return new Response(html, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
