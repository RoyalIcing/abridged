/**
 * Respond with hello worker text
 * @param {Request} request
 */
export async function handleRequest(request) {
  console.log(request);
  const url = new URL(request.url);
  const limit = parseFloat(url.searchParams.get("limit")) || undefined;
  const selectorPattern = url.searchParams.get("selectorPattern") || ".";

  const selectorRegex = new RegExp(selectorPattern);

  console.log("URL", url.pathname);

  if ("/tailwindcss@1.8.10" === url.pathname) {
    const tailwindSource = await fetch(
      new URL("https://unpkg.com/tailwindcss@1.8.10/dist/tailwind.min.css")
    ).then(r => r.text());

    let input = tailwindSource.slice(0, limit);

    input = input.replace(/\/\*.+?\*\//, "");

    const targetRegex = /\B(\.[^{@]+)[{][^}]+?}/g;
    const output = input.replace(targetRegex, (...args) => {
      const selectorRaw = args[1];
      const selectors = selectorRaw.split(/\s*,\s*/);
      if (selectors.some(selector => selectorRegex.test(selector))) {
        return args[0];
      } else {
        return "";
      }
    });

    return new Response(output, {
      headers: { "content-type": "text/css" }
    });
  }

  return new Response("Hello worker!", {
    headers: { "content-type": "text/plain" }
  });
}
