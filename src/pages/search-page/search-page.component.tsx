import { useCallback, useEffect, useRef, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { ReactComponent as FiltersIcon } from "../../assets/filters.svg";
import { ReactComponent as SortIcon } from "../../assets/sortIcon.svg";
import Button, { ButtonType } from "../../components/button/button.component";
import FiltersPopup from "../../components/filters-popup/filters-popup.component";
import {
  fetchItems,
  SearchItem,
  selectItems,
} from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";

import "./search-page.style.scss";

const SearchPage = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch<AppDispatch>();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const columns: TableColumn<SearchItem>[] = [
    {
      name: "#",
      selector: (row) => row.index,
    },
    {
      name: "Entry",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Entry Names",
      selector: (row) => row.accession,
      sortable: true,
    },
    {
      name: "Genes",
      selector: (row) => row.geneNames.join(", "),
      sortable: true,
    },
    {
      name: "Organism",
      selector: (row) => row.organismName,
      sortable: true,
    },
    {
      name: "Subcellular Location",
      selector: (row) => row.ccSubcellularLocation.join(", "),
      sortable: true,
    },
    {
      name: "Length",
      selector: (row) => row.length,
      sortable: true,
    },
  ];

  useEffect(() => {
    dispatch(fetchItems(searchQuery));
  }, [searchQuery, dispatch]);

  const onSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const query = searchRef.current?.value || "*";

      setSearchQuery(query);

      setSearchParams({ query });
    },
    [setSearchParams]
  );

  const showSearchResultsTitle = () => {
    if (items.length > 0 && searchQuery === "*") {
      return (
        <p className="results-title">{`${items.length} Search Results for "All"`}</p>
      );
    } else if (items.length > 0 && searchQuery) {
      return (
        <p className="results-title">{`${items.length} Search Results for "${searchQuery}"`}</p>
      );
    } else if (items.length === 0 && searchQuery) {
      return (
        <p className="results-title">{`0 Search Results for "${searchQuery}"`}</p>
      );
    }
  };

  return (
    <div className="search-page-container">
      <form className="search-page-form" onSubmit={onSearch}>
        <input
          type="search"
          className="input-search"
          placeholder="Enter search value"
          ref={searchRef}
          defaultValue={searchQuery}
        />
        <Button buttonType={ButtonType.BASE} styleClasses="search-btn">
          {"Search"}
        </Button>
        <Button buttonType={ButtonType.FILTERS}>
          <FiltersIcon />
        </Button>
      </form>
      <FiltersPopup />
      {showSearchResultsTitle()}
      {items.length > 0 ? (
        <DataTable
          columns={columns}
          data={items}
          sortIcon={<SortIcon className="icon" />}
        />
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
