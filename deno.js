import { handleRequest } from "./src/handle.js";

const request = new Request({
  url: "http://localhost:8787/tailwindcss@1.8.10?selectorPattern=(text-)"
});
Deno.stdout.write(handleRequest(request));
