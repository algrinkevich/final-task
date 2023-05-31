import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";

import { SearchParams, UniprotService } from "../../api/uniprot-service";
import { RootState } from "../store";

export interface SearchItem {
  index: number;
  accession: string;
  id: string;
  organismName: string;
  geneNames: string[];
  ccSubcellularLocation: string[];
  length: number;
}

interface EntriesState {
  items: SearchItem[];
  search: SearchParams;
  nextPageLink: string | null;
  isSearchRunning: boolean;
}

interface UniProtSearchResponse {
  results: {
    primaryAccession: string;
    uniProtkbId: string;
    organism: {
      scientificName: string;
    };
    genes: {
      geneName: { value: string };
    }[];
    comments: {
      subcellularLocations: {
        location: { value: string };
      }[];
    }[];
    sequence: { length: number };
  }[];
}

const INITIAL_STATE: EntriesState = {
  items: [],
  search: { query: "" },
  nextPageLink: null,
  isSearchRunning: false,
};

const searchResultsToStateItems = (searchResults: UniProtSearchResponse) => {
  return searchResults.results.map((r, index) => {
    return {
      index,
      accession: r.primaryAccession,
      id: r.uniProtkbId,
      organismName: r.organism.scientificName,
      geneNames: r.genes?.map((gene) => gene.geneName?.value || "") || [],
      ccSubcellularLocation:
        r.comments?.flatMap((comment) =>
          comment.subcellularLocations?.map((sl) => sl.location.value)
        ) || [],
      length: r.sequence.length,
    };
  });
};

export const entriesSlice = createSlice({
  name: "entries",
  initialState: INITIAL_STATE,
  reducers: {
    setSearchQuery(state, action) {
      state.search.query = action.payload;
    },
    setFilters(state, action) {
      if (isEqual(state.search.filters, action.payload)) {
        return;
      }

      state.search.filters = action.payload;
    },
    setSorting(state, action) {
      if (isEqual(state.search.sort, action.payload)) {
        return;
      }

      state.search.sort = { ...action.payload };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isSearchRunning = true;
      })
      .addCase(
        fetchItems.fulfilled,
        (
          state,
          action: {
            payload: {
              searchResults: UniProtSearchResponse;
              nextPageLink: string | null;
            };
          }
        ) => {
          state.isSearchRunning = false;
          state.nextPageLink = action.payload.nextPageLink;
          state.items = searchResultsToStateItems(action.payload.searchResults);
        }
      )
      .addCase(fetchNextItems.pending, (state) => {
        state.isSearchRunning = true;
      })

      .addCase(
        fetchNextItems.fulfilled,
        (
          state,
          action: {
            payload: {
              searchResults: UniProtSearchResponse;
              nextPageLink: string | null;
            };
          }
        ) => {
          state.isSearchRunning = false;
          state.nextPageLink = action.payload.nextPageLink;
          state.items = [
            ...state.items,
            ...searchResultsToStateItems(action.payload.searchResults),
          ].map((item, index) => ({ ...item, index }));
        }
      );
  },
});

export const fetchItems = createAsyncThunk(
  "entries/fetchItems",
  async (args: SearchParams) => {
    const service = new UniprotService();

    return service.searchAsync(args);
  }
);

export const fetchNextItems = createAsyncThunk(
  "entries/fetchNextItems",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;

    if (!state.entries.nextPageLink) {
      throw new Error("Next page link is empty!");
    }

    const response = await fetch(state.entries.nextPageLink);
    const link = new UniprotService().extractLinkFromResponse(response);
    const data = await response.json();

    return { searchResults: data, nextPageLink: link };
  }
);

export const { setSearchQuery, setFilters, setSorting } = entriesSlice.actions;

export const selectItems = (state: RootState) => state.entries.items;
export const selectSearchQuery = (state: RootState) =>
  state.entries.search.query;
export const selectFilters = (state: RootState) => state.entries.search.filters;
export const selectIsSearchRunning = (state: RootState) =>
  state.entries.isSearchRunning;
export const selectSorting = (state: RootState) => state.entries.search.sort;

export const entriesReducer = entriesSlice.reducer;
