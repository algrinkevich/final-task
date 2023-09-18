import { Tag as AntTag, Tooltip } from "antd";

import "./tag.styles.scss";

interface TagProps {
  key?: string;
  text: string;
}

const Tag = ({ key, text }: TagProps) => {
  return (
    <Tooltip title={text}>
      <AntTag key={key}>{text}</AntTag>
    </Tooltip>
  );
};

export default Tag;
