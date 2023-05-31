export interface SearchParams {
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
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
}

interface UniProtFacets {
  name: string;
  values: {
    label: string;
    value: string;
    count: number;
  }[];
}
export interface UniProtFacetsResponse {
  facets: UniProtFacets[];
}

export interface UniProtSearchResponse {
  facets?: UniProtFacets[];
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

export class UniprotService {
  getSearchUrl() {
    return "https://rest.uniprot.org/uniprotkb/search";
  }

  extractLinkFromResponse(response: Response) {
    const matches = response.headers?.get("Link")?.match(/<.*>/);

    return matches?.length ? matches[0].slice(1, -1) : null;
  }

  filtersToQueryString(args: SearchParams) {
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

    return encodeURI(filteredQuery);
  }

  async searchAsync(args: SearchParams) {
    const filteredQuery = this.filtersToQueryString(args);

    let sortParams = "";

    if (args.sort?.field) {
      const field =
        {
          organismName: "organism_name",
          geneNames: "gene",
        }[args.sort?.field] || args.sort?.field;

      sortParams = `&sort=${field} ${args.sort?.direction}`;
    }

    const response = await fetch(
      `${this.getSearchUrl()}?fields=accession,reviewed,id,protein_name,gene_names,organism_name,length,ft_peptide,cc_subcellular_location&query=${filteredQuery}&size=50${sortParams}`
    );

    const link = this.extractLinkFromResponse(response);
    const data: UniProtSearchResponse = await response.json();

    return { searchResults: data, nextPageLink: link };
  }

  async getFacetsAsync({
    facetName,
    searchParams,
  }: {
    facetName: string;
    searchParams: SearchParams;
  }): Promise<UniProtFacetsResponse> {
    const filteredQuery = this.filtersToQueryString(searchParams);

    const response = await fetch(
      `${this.getSearchUrl()}?facets=${facetName}&query=${filteredQuery}&size=0`
    );

    return await response.json();
  }
}
