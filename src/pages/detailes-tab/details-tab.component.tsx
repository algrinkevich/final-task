import { useState } from "react";
import { Tooltip } from "antd";

import { ProteinResponse } from "../protein-page/protein-page.component";

import { ReactComponent as CopyIcon } from "../../assets/copyIcon.svg";

import "./details-tab.styles.scss";

const DetailsTab = ({ protein }: { protein: ProteinResponse | null }) => {
  const [isTextCopied, setIsTextCopied] = useState(false);

  return (
    <div className="details-tab-container">
      <h2>{"Sequence"}</h2>

      <div className="details-info-container">
        <div className="details-info-column">
          <div className="details-block">
            <span className="details-title">{"Length"}</span>
            <span className="details-value">{protein?.sequence.length}</span>
          </div>
          <div className="details-block">
            <span className="details-title">{"Mass (Da)"}</span>
            <span className="details-value">{protein?.sequence.molWeight}</span>
          </div>
        </div>
        <div className="details-info-column">
          <div className="details-block">
            <span className="details-title">{"Last updated"}</span>
            <span className="details-value">
              {protein?.entryAudit.lastSequenceUpdateDate}
            </span>
          </div>
          <div className="details-block">
            <span className="details-title">{"Checksum"}</span>
            <span className="details-value">{protein?.sequence.crc64}</span>
          </div>
        </div>
      </div>

      <Tooltip title={!isTextCopied ? "Click to copy" : "Copied!"}>
        <div
          className="copy-btn"
          onClick={() => {
            if (protein?.sequence.value) {
              // eslint-disable-next-line no-restricted-globals
              navigator.clipboard.writeText(protein?.sequence.value);
              setIsTextCopied(true);
              setTimeout(() => {
                setIsTextCopied(false);
              }, 500);
            }
          }}
        >
          <CopyIcon />
          <span>{"Copy"}</span>
        </div>
      </Tooltip>

      <div className="sequence-value">{protein?.sequence.value}</div>
    </div>
  );
};

export default DetailsTab;
