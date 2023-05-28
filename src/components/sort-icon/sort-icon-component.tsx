import { Fragment } from "react";

import { ReactComponent as SortingIcon } from "../../assets/sortIcon.svg";

import "./sort-icon-styles.scss";

const SortIcon = ({
  direction,
  children,
}: {
  direction?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Fragment>
      {children}
      <SortingIcon
        className={
          {
            asc: "sort-icon-active sort-icon-asc",
            desc: "sort-icon-active",
            notSet: "",
          }[direction || "notSet"]
        }
      />
    </Fragment>
  );
};

export default SortIcon;
