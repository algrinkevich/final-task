import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type TabsProps, Tabs } from "antd";

import Tag from "../../components/tag/tag.component";

import "./protein-page.styles.scss";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Details`,
    children: `Content of Tab Pane 1`,
  },
  {
    key: "2",
    label: `Feature viewer`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: "3",
    label: `Publication`,
    children: `Content of Tab Pane 3`,
  },
];

interface ProteinResponse {
  primaryAccession: string;
  uniProtkbId: string;
  organism: {
    scientificName: string;
  };
  proteinDescription: {
    recommendedName: {
      fullName: {
        value: string;
      };
    };
  };
  genes: {
    geneName: {
      value: string;
    };
  }[];
  sequence: {
    value: string;
    length: number;
    molWeight: number;
    crc64: string;
  };
  entryAudit: {
    lastSequenceUpdateDate: string;
  };
}

const ProteinPage = () => {
  const { proteinId } = useParams();
  const [proteinData, setProteinData] = useState<ProteinResponse | null>(null);

  useEffect(() => {
    async function fetchDataAsync() {
      const response = await fetch(
        `https://rest.uniprot.org/uniprotkb/${proteinId}`
      );

      setProteinData(await response.json());
    }

    fetchDataAsync();
  }, [proteinId]);

  return (
    <div className="protein-page-container">
      <div className="title-container">
        <h2 className="protein-title">{`${proteinData?.primaryAccession} / ${proteinData?.uniProtkbId}`}</h2>
        <Tag text={`${proteinData?.organism.scientificName}`} />
      </div>
      <div className="protein-info-container">
        <div className="info-block">
          <span className="info-title">{"Protein"}</span>
          <span className="info-description">
            {`${proteinData?.proteinDescription.recommendedName.fullName.value}`}
          </span>
        </div>
        <div className="info-block">
          <span className="info-title">{"Gene"}</span>
          <span className="info-description">{`${proteinData?.genes
            .map((v) => v.geneName.value)
            .join("")}`}</span>
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ProteinPage;
