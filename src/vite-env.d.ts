/// <reference types="vite/client" />

declare module "*.jpeg" {
  const jpegPath: string;
  export default jpegPath;
}

declare module "*.jpg" {
  const jpgPath: string;
  export default jpgPath;
}

declare module "*.png" {
  const pngPath: string;
  export default pngPath;
}

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const svgPath: string;
  export default svgPath;
}
