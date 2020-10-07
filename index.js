import cssTree from "css-tree";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const limit = parseFloat(url.searchParams.get("limit")) || undefined;
  const selectorPattern = url.searchParams.get("selectorPattern") || ".";

  const selectorRegex = new RegExp(selectorPattern);

  console.log("URL", url.pathname);

  if ("/tailwindcss@1.8.10" === url.pathname) {
    const tailwindSource = await fetch(
      new URL("https://unpkg.com/tailwindcss@1.8.10/dist/tailwind.min.css")
    ).then(r => r.text());

    const input = tailwindSource.slice(0, limit);

    // return new Response(input, {
    //   headers: { "content-type": "text/css" }
    // });

    const ast = cssTree.parse(input);

    const output = [];

    /**
     * @type {import("css-tree").WalkOptionsVisit<import("css-tree").Rule>}
     */
    const classSelectorWalk = {
      visit: "Rule",
      leave(node, item, list) {
        let shouldRemove = false;

        cssTree.walk(node, {
          visit: "ClassSelector",
          leave(node, item, list) {
            if (selectorRegex.test(node.name)) {
              output.push(node);
            } else {
              shouldRemove = true;
            }
          }
        });

        if (shouldRemove) {
          // node.block.children = new cssTree.List();
          // node.block.children.clear();
          list.remove(item);
        }
      }
    };
    cssTree.walk(ast, classSelectorWalk);

    // ast.children.filter()

    // const ast = css.parse(input);
    // ast.stylesheet.rules = ast.stylesheet.rules.filter(rule => {
    //   if (rule.type === "rule") {
    //     const { selectors } = rule;
    //     if (selectors.some(selector => selectorRegex.test(selector))) {
    //       return true;
    //     }
    //   }

    //   return false;
    // });

    // return new Response(JSON.stringify(output, null, 2), {
    //   headers: { "content-type": "application/json" }
    // });

    const output2 = cssTree.generate(ast);
    return new Response(output2, {
      headers: { "content-type": "text/css" }
    });
  }

  return new Response("Hello worker!", {
    headers: { "content-type": "text/plain" }
  });
}
