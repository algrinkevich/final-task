import { useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as FiltersIcon } from "../../assets/filters.svg";
import { ReactComponent as SortIcon } from "../../assets/sortIcon.svg";
import Button, { ButtonType } from "../../components/button/button.component";
import {
  fetchItems,
  SearchItem,
  selectItems,
} from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";

import "./search-page.style.scss";

// interface DataRow {
//   number: number;
//   entry: string;
//   entryNames: string;
//   genes: string;
//   organism: string;
//   subcellularLocation: string;
//   length: number;
// }

const SearchPage = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch<AppDispatch>();

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
      <p className="results-title">{`${items.length} Search Results for "Cancer"`}</p>
      {items.length > 0 ? (
        //JSON.stringify(items)
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
