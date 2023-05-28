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

const ProteinPage = () => {
  return (
    <div className="protein-page-container">
      <div className="title-container">
        <h2 className="protein-title">{"Q9Y238 / DLEC1_HUMAN"}</h2>
        <Tag text="Homo sapiens" />
      </div>
      <div className="protein-info-container">
        <div className="info-block">
          <span className="info-title">{"Protein"}</span>
          <span className="info-description">
            {"Deleted in lung and esophageal cancer protein 1"}
          </span>
        </div>
        <div className="info-block">
          <span className="info-title">{"Gene"}</span>
          <span className="info-description">{"DLEC1"}</span>
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ProteinPage;
