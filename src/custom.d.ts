declare module "*.jpg" {
  const path: string;
  export default path;
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

declare module "protvista-uniprot" {
  import protvista = require("protvista-uniprot");
  const ProtVistaUniprot: CustomElement = protvista;
  export default ProtVistaUniprot;
}
