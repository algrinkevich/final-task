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
}

const INITIAL_STATE: EntriesState = {
  items: [],
};

export const entriesSlice = createSlice({
  name: "entries",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchItems.fulfilled,
      (state, action: { payload: UniProtSearchResponse }) => {
        state.items = action.payload.results.map((r, index) => {
          return {
            index: index,
            accession: r.primaryAccession,
            id: r.uniProtkbId,
            organismName: r.organism.scientificName,
            geneNames: r.genes.map((gene) => gene.geneName.value),
            ccSubcellularLocation: r.comments.flatMap((comment) =>
              comment.subcellularLocations.map((sl) => sl.location.value)
            ),
            length: r.sequence.length,
          };
        });

        // return action.payload.results;
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

export const fetchItems = createAsyncThunk("entries/fetchItems", () => {
  return fetch(
    "https://rest.uniprot.org/uniprotkb/search?fields=accession,reviewed,id,protein_name,gene_names,organism_name,length,ft_peptide,cc_subcellular_location&query=*&size=500"
  ).then((response) => response.json());
});

export const selectItems = (state: RootState) => state.entries.items;

export const entriesReducer = entriesSlice.reducer;
