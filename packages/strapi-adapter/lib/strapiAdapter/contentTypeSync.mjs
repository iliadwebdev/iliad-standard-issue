import "../chunk-QZ7TP4HQ.mjs";
async function downloadContentTypes(hermes, { outDir }) {
  console.log("Downloading content types");
  return await hermes.axios.get("/content-types", void 0);
}
export {
  downloadContentTypes
};
