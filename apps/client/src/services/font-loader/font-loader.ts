// todo: list all used fonts here
const USED_FONTS = [
  "normal 300 1em Poppins",
  "normal 400 1em Poppins",
  "normal 500 1em Poppins",
  "normal 600 1em Poppins",
];

async function loadFonts(fontNames: string[] = USED_FONTS) {
  await Promise.all(fontNames.map((fontName) => document.fonts.load(fontName)));
  await document.fonts.ready;
}

const FontLoaderService = {
  loadFonts,
};

export default FontLoaderService;
