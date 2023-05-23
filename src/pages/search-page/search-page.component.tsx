import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as FiltersIcon } from "../../assets/filters.svg";
import Button, { ButtonType } from "../../components/button/button.component";
import { fetchItems, selectItems } from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";

import "./search-page.style.scss";

const SearchPage = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

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
      {items.length > 0 ? (
        JSON.stringify(items)
      ) : (
        <p className="no-data-placeholder">
          {"No data to display"}
          <br /> {"Please start search to display results"}
        </p>
      )}
    </div>
  );
};

export default SearchPage;
