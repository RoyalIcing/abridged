module.exports = {
  target: "webworker",
  entry: "./index.js", // inferred from "main" in package.json
  node: {
    fs: "empty"
  }
};
