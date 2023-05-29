import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useSearchParams } from "react-router-dom";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import Button, { ButtonType } from "../../components/button/button.component";
import FiltersPopup from "../../components/filters-popup/filters-popup.component";
import InfiniteScroll from "../../components/infinite-scroll/infinite-scroll.component";
import SortIcon from "../../components/sort-icon/sort-icon-component";
import Tag from "../../components/tag/tag.component";
import {
  fetchItems,
  fetchNextItems,
  SearchItem,
  selectFilters,
  selectIsSearchRunning,
  selectItems,
  selectSearchQuery,
  selectSorting,
  setFilters,
  setSearchQuery,
  setSorting,
} from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";

import { ReactComponent as FiltersIcon } from "../../assets/filters.svg";

import "./search-page.style.scss";

const SearchPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [resetScroll, setResetScroll] = useState(false);
  const items = useSelector(selectItems);
  const dispatch = useDispatch<AppDispatch>();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const isSearchRunning = useSelector(selectIsSearchRunning);
  const sorting = useSelector(selectSorting);

  useEffect(() => {
    dispatch(setSearchQuery(searchParams.get("query") || ""));
    dispatch(
      setFilters({
        gene: searchParams.get("geneValue"),
        organism: {
          name: searchParams.get("organismName"),
          id: searchParams.get("organismValue"),
        },
        sequence: {
          from: searchParams.get("sequenceLengthFromValue"),
          to: searchParams.get("sequenceLengthToValue"),
        },
        annotationScore: searchParams.get("annotationScoreValue"),
        proteinWith: {
          name: searchParams.get("proteinWithName"),
          id: searchParams.get("proteinWithValue"),
        },
      })
    );
    dispatch(
      setSorting({
        field: searchParams.get("sortKey"),
        direction: searchParams.get("sortDir"),
      })
    );
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (resetScroll && !isSearchRunning) {
      setResetScroll(false);
    }
  }, [isSearchRunning, resetScroll]);

  useEffect(() => {
    dispatch(fetchItems({ query: searchQuery, filters, sort: sorting }));
    setResetScroll(true);

    const queryString = {
      query: searchQuery,
      geneValue: filters?.gene,
      organismName: filters?.organism?.name,
      organismValue: filters?.organism?.id,
      sequenceLengthFromValue: filters?.sequence?.from
        ? filters?.sequence?.from?.toString()
        : null,
      sequenceLengthToValue: filters?.sequence?.to
        ? filters?.sequence?.to?.toString()
        : null,
      annotationScoreValue: filters?.annotationScore,
      proteinWithValue: filters?.proteinWith?.id,
      proteinWithName: filters?.proteinWith?.name,
      sortKey: sorting?.field,
      sortDir: sorting?.direction,
    };

    const cleanedUpQueryString = Object.fromEntries(
      Object.entries(queryString).filter(([_, v]) => !!v)
    ) as {
      [key: string]: string;
    };

    setSearchParams(cleanedUpQueryString);
  }, [searchQuery, dispatch, filters, setSearchParams, sorting]);

  const onSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newSearchQuery = (
        event.currentTarget.elements.namedItem("search") as HTMLInputElement
      ).value;

      dispatch(setSearchQuery(newSearchQuery || "*"));
    },
    [dispatch]
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

  const convertToSorting = (
    fieldName: string,
    direction: string | null | undefined
  ) => {
    return {
      field: fieldName,
      direction: direction === "descend" ? "desc" : "asc",
    };
  };

  const getSortOrder = useCallback(
    (fieldName: string) => {
      if (sorting?.field !== fieldName) {
        return;
      }

      if (sorting.direction === "asc") {
        return "ascend";
      } else if (sorting.direction === "desc") {
        return "descend";
      }

      return;
    },
    [sorting]
  );

  const columns: ColumnsType<SearchItem> = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        key: "1",
        width: "5%",
      },
      {
        title: (
          <SortIcon
            direction={
              sorting?.field === "accession" ? sorting?.direction : undefined
            }
          >
            {"Entry"}
          </SortIcon>
        ),
        dataIndex: "accession",
        key: "2",
        sorter: true,
        sortOrder: getSortOrder("accession"),
        width: "10%",
        render: (text, _) => {
          return <NavLink to={`/protein/${text}`}>{text}</NavLink>;
        },
      },
      {
        title: (
          <SortIcon
            direction={sorting?.field === "id" ? sorting?.direction : undefined}
          >
            {"Entry Names"}
          </SortIcon>
        ),
        dataIndex: "id",
        key: "3",
        sorter: true,
        sortOrder: getSortOrder("id"),
        width: "10%",
      },
      {
        title: (
          <SortIcon
            direction={
              sorting?.field === "geneNames" ? sorting?.direction : undefined
            }
          >
            {"Genes"}
          </SortIcon>
        ),
        dataIndex: "geneNames",
        sorter: true,
        sortOrder: getSortOrder("geneNames"),
        key: "4",
        width: "10%",
        render: (_, record) => record.geneNames.join(", "),
      },
      {
        title: (
          <SortIcon
            direction={
              sorting?.field === "organismName" ? sorting?.direction : undefined
            }
          >
            {"Organism"}
          </SortIcon>
        ),
        dataIndex: "organismName",
        sorter: true,
        width: "10%",
        key: "5",
        sortOrder: getSortOrder("organismName"),
        render: (text, _, index) => (
          <Tag key={`${text}-${index}`} text={text} />
        ),
      },
      {
        title: "Subcellular Location",
        dataIndex: "ccSubcellularLocation",
        sorter: false,
        width: "25%",
        key: "6",
        render: (_, record) => record.ccSubcellularLocation.join(", "),
      },
      {
        title: (
          <SortIcon
            direction={
              sorting?.field === "length" ? sorting?.direction : undefined
            }
          >
            {"Length"}
          </SortIcon>
        ),
        dataIndex: "length",
        key: "7",
        sorter: true,
        sortOrder: getSortOrder("length"),
        width: "10%",
      },
    ],
    [sorting, getSortOrder]
  );

  return (
    <div className="search-page-container">
      <form className="search-page-form" onSubmit={onSearch}>
        <input
          type="search"
          name="search"
          className="input-search"
          placeholder="Enter search value"
          ref={searchRef}
          defaultValue={searchQuery === "*" ? "" : searchQuery}
        />
        <Button buttonType={ButtonType.BASE} styleClasses="search-btn">
          {"Search"}
        </Button>
        <Button
          buttonType={ButtonType.FILTERS}
          onClick={() => setShowFilters((prev) => !prev)}
          type="button"
        >
          <FiltersIcon />
        </Button>
      </form>

      {showFilters && <FiltersPopup onClose={() => setShowFilters(false)} />}

      {showSearchResultsTitle()}

      {items.length > 0 ? (
        <Fragment>
          <Table
            id="mytable"
            columns={columns}
            dataSource={items}
            className="table-container"
            scroll={{
              x: true,
              y: "calc(100vh - 16.5em)",
              scrollToFirstRowOnChange: true,
            }}
            pagination={false}
            loading={isSearchRunning}
            onChange={(_, __, sorter) => {
              dispatch(
                setSorting(
                  (sorter as { order: string | undefined }).order
                    ? convertToSorting(
                        (sorter as { field: string }).field,
                        (sorter as { order: string }).order
                      )
                    : null
                )
              );
            }}
          />
          <InfiniteScroll
            loadMore={() => dispatch(fetchNextItems())}
            reset={resetScroll}
          />
        </Fragment>
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
