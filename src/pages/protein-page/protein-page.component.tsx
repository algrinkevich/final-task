import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type TabsProps, Tabs } from "antd";

import Tag from "../../components/tag/tag.component";
import DetailsTab from "../detailes-tab/details-tab.component";
import FeatureViewerTab from "../feature-viewer-tab/feature-viewer-tab.component";
import PublicationsTab from "../publications-tab/publications-tab.component";

import "./protein-page.styles.scss";

export interface ProteinResponse {
  primaryAccession: string;
  uniProtkbId: string;
  organism: {
    scientificName: string;
  };
  proteinDescription: {
    recommendedName?: {
      fullName?: {
        value: string;
      };
    };
  };
  genes?: {
    geneName: {
      value?: string;
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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Details`,
      children: <DetailsTab protein={proteinData} />,
    },
    {
      key: "2",
      label: `Feature viewer`,
      children: proteinId && <FeatureViewerTab accession={proteinId} />,
    },
    {
      key: "3",
      label: `Publications`,
      children: proteinId && <PublicationsTab proteinId={proteinId} />,
    },
  ];

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
            {`${
              proteinData?.proteinDescription.recommendedName?.fullName
                ?.value ?? ""
            }`}
          </span>
        </div>
        <div className="info-block">
          <span className="info-title">{"Gene"}</span>
          <span className="info-description">{`${
            proteinData?.genes?.map((v) => v.geneName?.value).join("") ?? ""
          }`}</span>
        </div>
      </div>

      <Tabs items={items} />
    </div>
  );
};

export default ProteinPage;
