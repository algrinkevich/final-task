import ProtvistaUniprot from "protvista-uniprot";

import "./feature-viewer-tab.styles.scss";

window.customElements.define("protvista-uniprot", ProtvistaUniprot);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "protvista-uniprot": ProtVistaProps;
    }
  }
}

interface ProtVistaProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  accession: string;
}

const FeatureViewerTab = ({ accession }: { accession: string }) => {
  return (
    <div>
      <protvista-uniprot accession={accession} />
    </div>
  );
};

export default FeatureViewerTab;
