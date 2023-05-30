import { useEffect, useState } from "react";

import { ReactComponent as ExternalLinkIcon } from "../../assets/externalLinkIcon.svg";

import "./publications-tab.styles.scss";

interface PublicationResponse {
  citation: {
    title: string;
    authors?: string[];
    journal: string;
    volume: string;
    firstPage: string;
    lastPage: string;
    publicationDate: string;
    citationCrossReferences?: {
      database: string;
      id: string;
    }[];
  };
  references: {
    sourceCategories: string[];
    referencePositions: string[];
    source: {
      name: string;
    };
  }[];
}


const PublicationsTab = ({ proteinId }: { proteinId: string }) => {
  const [publicationsData, setPublicationsData] = useState<
    PublicationResponse[]
  >([]);

  useEffect(() => {
    async function fetchDataAsync() {
      const response = await fetch(
        `https://rest.uniprot.org/uniprotkb/${proteinId}/publications`
      );

      const responseJSON = await response.json();

      setPublicationsData(responseJSON.results);
    }

    fetchDataAsync();
  }, [proteinId]);

  const getPublicationButtonTitle = (publication: PublicationResponse) => {
    const citation = publication?.citation;

    if (!citation.journal) {
      return;
    }

    return `${citation.journal} ${citation.volume}:${citation.firstPage}-${citation.lastPage} (${citation.publicationDate})`;
  };

  return (
    <div>
      <div className="publications-tab-container">
        {publicationsData.map((publication) => {
          const pubMedId = publication.citation.citationCrossReferences?.find(
            (v) => v.database === "PubMed"
          )?.id;

          const doiId =
            publication.citation.citationCrossReferences?.find(
              (v) => v.database === "DOI"
            )?.id || "";

          const publicationTitle = getPublicationButtonTitle(publication);

          return (
            <div
              className="publication-container"
              key={publication.citation.title}
            >
              <h2>{publication?.citation.title} </h2>
              <p className="authors-names">
                {publication?.citation.authors?.join("")}
              </p>
              <p className="categories">
                <span className="column-title">{"Categories: "}</span>
                {publication?.references
                  .flatMap((v) => v.sourceCategories)
                  .join(", ")}
              </p>
              <p className="column-values">
                <span className="column-title">{"Cited for: "}</span>
                {publication?.references
                  .flatMap((v) => v.referencePositions)
                  .join(", ")}
              </p>
              <p className="column-values">
                <span className="column-title">{"Source: "}</span>
                {publication?.references.map((v) => v.source.name).join(", ")}
              </p>

              <div className="buttons-container">
                {pubMedId && (
                  <div
                    className="external-btn"
                    onClick={() =>
                      window
                        .open(
                          `https://pubmed.ncbi.nlm.nih.gov/${pubMedId}`,
                          "_blank"
                        )
                        ?.focus()
                    }
                  >
                    {"PubMed"}
                    <ExternalLinkIcon />
                  </div>
                )}

                {pubMedId && (
                  <div
                    className="external-btn"
                    onClick={() =>
                      window
                        .open(
                          `https://europepmc.org/article/MED/${pubMedId}`,
                          "_blank"
                        )
                        ?.focus()
                    }
                  >
                    {"Europe PMC"}
                    <ExternalLinkIcon />
                  </div>
                )}

                {publicationTitle && (
                  <div
                    className={`external-btn ${
                      !doiId && "external-btn--disabled"
                    }`}
                    onClick={() =>
                      doiId &&
                      window
                        .open(`https://dx.doi.org/${doiId}`, "_blank")
                        ?.focus()
                    }
                  >
                    {publicationTitle}
                    <ExternalLinkIcon />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicationsTab;
