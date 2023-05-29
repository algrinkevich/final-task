import ProtvistaUniprot from "protvista-uniprot";

import "./feature-viewer-tab.styles.scss";

window.customElements.define("protvista-uniprot", ProtvistaUniprot);

const FeatureViewerTab = ({ accession }: { accession: string }) => {
  return (
    <div>
      <protvista-uniprot accession={accession} />
    </div>
  );
};

export default FeatureViewerTab;
