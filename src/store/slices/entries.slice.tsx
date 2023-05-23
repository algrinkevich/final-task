import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface EntriesState {
  items: number[];
}

const INITIAL_STATE: EntriesState = {
  items: [],
};

export const entriesSlice = createSlice({
  name: "entries",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload.results;

     // return action.payload.results;
    });
  },
});

export const fetchItems = createAsyncThunk("entries/fetchItems", () => {
  return fetch(
    "https://rest.uniprot.org/uniprotkb/search?fields=accession,reviewed,id,protein_name,gene_names,organism_name,length,ft_peptide,cc_subcellular_location&query=cancer"
  ).then((response) => response.json());
});

export const selectItems = (state: RootState) => state.entries.items;

export const entriesReducer = entriesSlice.reducer;
