import { handleRequest } from "./src/handle";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
