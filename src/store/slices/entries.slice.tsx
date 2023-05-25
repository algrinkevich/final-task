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
  searchQuery: string;
}

const INITIAL_STATE: EntriesState = {
  items: [],
  searchQuery: "",
};

export const entriesSlice = createSlice({
  name: "entries",
  initialState: INITIAL_STATE,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      fetchItems.fulfilled,
      (state, action: { payload: UniProtSearchResponse }) => {
        state.items = action.payload.results.map((r, index) => {
          return {
            index,
            accession: r.primaryAccession,
            id: r.uniProtkbId,
            organismName: r.organism.scientificName,
            geneNames: r.genes?.map((gene) => gene.geneName?.value || "") || [],
            ccSubcellularLocation:
              r.comments?.flatMap((comment) =>
                comment.subcellularLocations.map((sl) => sl.location.value)
              ) || [],
            length: r.sequence.length,
          };
        });
      }
    );
  },
});

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

interface FetchItemsArgs {
  query: string;
  filters?: {
    organism: string;
    annotationScore: string;
    proteinWith: string;
  };
}

export const fetchItems = createAsyncThunk(
  "entries/fetchItems",
  (args: FetchItemsArgs) => {
    const filteredQuery = `${args.query} AND (model_organism:${args.filters?.organism}) AND (annotation_score:${args.filters?.annotationScore}) AND (proteins_with:${args.filters?.proteinWith})`;

    return fetch(
      `https://rest.uniprot.org/uniprotkb/search?fields=accession,reviewed,id,protein_name,gene_names,organism_name,length,ft_peptide,cc_subcellular_location&query=${filteredQuery}`
    ).then((response) => response.json());
  }
);

export const { setSearchQuery } = entriesSlice.actions;

export const selectItems = (state: RootState) => state.entries.items;
export const selectSearchQuery = (state: RootState) =>
  state.entries.searchQuery;

export const entriesReducer = entriesSlice.reducer;
