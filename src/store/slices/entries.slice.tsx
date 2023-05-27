import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  search: SearchState;
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

interface SearchState {
  query: string;
  filters?: {
    gene?: string;
    organism?: { name: string; id: string };
    sequence?: {
      from?: number;
      to?: number;
    };
    annotationScore?: string;
    proteinWith?: { name: string; id: string };
  };
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
      state.search.filters = action.payload;
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
  async (args: SearchState) => {
    let filteredQuery = args.query;

    if (args?.filters?.gene) {
      filteredQuery += ` AND (gene:${args.filters?.gene})`;
    }

    if (args?.filters?.organism?.id) {
      filteredQuery += ` AND (model_organism:${args.filters?.organism.id})`;
    }

    if (
      args?.filters?.sequence &&
      (args.filters.sequence.from || args.filters.sequence.to)
    ) {
      filteredQuery += ` AND (length:[${args.filters.sequence.from || "*"} TO ${
        args.filters.sequence.to || "*"
      }])`;
    }

    if (args?.filters?.annotationScore) {
      filteredQuery += ` AND (annotation_score:${args.filters?.annotationScore})`;
    }

    if (args?.filters?.proteinWith?.id) {
      filteredQuery += ` AND (proteins_with:${args.filters?.proteinWith.id})`;
    }

    filteredQuery = encodeURI(filteredQuery);

    const response = await fetch(
      `https://rest.uniprot.org/uniprotkb/search?fields=accession,reviewed,id,protein_name,gene_names,organism_name,length,ft_peptide,cc_subcellular_location&query=${filteredQuery}&size=50`
    );

    const matches = response.headers?.get("Link")?.match(/<.*>/);
    const link = matches?.length ? matches[0].slice(1, -1) : null;
    const data = await response.json();

    return { searchResults: data, nextPageLink: link };
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

    const matches = response.headers?.get("Link")?.match(/<.*>/);
    const link = matches?.length ? matches[0].slice(1, -1) : null;
    const data = await response.json();

    return { searchResults: data, nextPageLink: link };
  }
);

export const { setSearchQuery, setFilters } = entriesSlice.actions;

export const selectItems = (state: RootState) => state.entries.items;
export const selectSearchQuery = (state: RootState) =>
  state.entries.search.query;
export const selectFilters = (state: RootState) => state.entries.search.filters;
export const selectIsSearchRunning = (state: RootState) =>
  state.entries.isSearchRunning;

export const entriesReducer = entriesSlice.reducer;
