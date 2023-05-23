import { ReactComponent as FiltersIcon } from "../../assets/filters.svg";
import Button, { ButtonType } from "../../components/button/button.component";

import "./search-page.style.scss";

const SearchPage = () => {
  return (
    <div className="search-page-container">
      <div className="search-page-header">
        <input
          type="search"
          className="input-search"
          placeholder="Enter search value"
        />
        <Button buttonType={ButtonType.BASE} styleClasses="search-btn">
          {"Search"}
        </Button>
        <Button buttonType={ButtonType.FILTERS}>
          <FiltersIcon />
        </Button>
      </div>
      <p className="no-data-placeholder">
        {"No data to display"}
        <br /> {"Please start search to display results"}
      </p>
    </div>
  );
};

export default SearchPage;
