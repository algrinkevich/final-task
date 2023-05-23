import { useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as FiltersIcon } from "../../assets/filters.svg";
import { ReactComponent as SortIcon } from "../../assets/sortIcon.svg";
import Button, { ButtonType } from "../../components/button/button.component";
import { fetchItems, selectItems } from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";

import "./search-page.style.scss";

interface DataRow {
  number: number;
  entry: string;
  entryNames: string;
}

const SearchPage = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch<AppDispatch>();

  const columns: TableColumn<DataRow>[] = [
    {
      name: "#",
      selector: (row: DataRow) => row.number,
    },
    {
      name: "Entry",
      selector: (row: DataRow) => row.entry,
      sortable: true,
    },
    {
      name: "Entry Names",
      selector: (row: DataRow) => row.entryNames,
      sortable: true,
    },
  ];

  const data = [
    {
      number: 1,
      entry: "Beetlejuice",
      entryNames: "1988",
    },
    {
      number: 2,
      entry: "Cool",
      entryNames: "1955",
    },
  ];

  // useEffect(() => {
  //   dispatch(fetchItems());
  // }, [dispatch]);

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
        //JSON.stringify(items)
        <DataTable
          columns={columns}
          data={data}
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
