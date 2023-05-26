import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { ReactComponent as DashIcon } from "../../assets/dash.svg";
import {
  fetchItems,
  selectSearchQuery,
} from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";
import Button, { ButtonType } from "../button/button.component";
import FormInput from "../form-input/form-input.component";

import "./filters-popup.styles.scss";

interface FiltersData {
  geneName: string;
  organism: string;
  sequenceLengthFrom: number | null;
  sequenceLengthTo: number | null;
  annotationScore: string;
  proteinWith: string;
}

// const defaultFormFields: FiltersData = {
//   geneName: "",
//   organism: "",
//   sequenceLengthFrom: null,
//   sequenceLengthTo: null,
//   annotationScore: "",
//   proteinWith: "",
// };
interface Filter {
  label: string;
  value: string;
}

const FiltersPopup = ({
  searchQuery,
  onClose,
}: {
  searchQuery: string;
  onClose: () => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [organisms, setOrganisms] = useState<Filter[]>([
    {
      label: searchParams.get("organismName") || "",
      value: searchParams.get("organismValue") || "",
    },
  ]);

  const [annotationScores, setAnnotationScores] = useState<Filter[]>([
    {
      label: searchParams.get("annotationScoreName") || "",
      value: searchParams.get("annotationScoreValue") || "",
    },
  ]);

  const [proteinsWith, setProteinsWith] = useState<Filter[]>([
    {
      label: searchParams.get("proteinWithName") || "",
      value: searchParams.get("proteinWithValue") || "",
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();

  //const searchQuery = useSelector(selectSearchQuery);

  const handleOrganismLoading = () => {
    return fetch(
      ` https://rest.uniprot.org/uniprotkb/search?facets=model_organism&query=${searchQuery}`
    )
      .then((response) => response.json())
      .then((results) => setOrganisms(results.facets[0].values));
  };

  const handleAnnotationScoreLoading = () => {
    return fetch(
      ` https://rest.uniprot.org/uniprotkb/search?facets=annotation_score&query=${searchQuery}`
    )
      .then((response) => response.json())
      .then((results) =>
        setAnnotationScores(
          results.facets[0].values.map((item: { value: string }) => ({
            value: item.value,
            label: item.value,
          }))
        )
      );
  };

  const handleProteinWithLoading = () => {
    return fetch(
      ` https://rest.uniprot.org/uniprotkb/search?facets=proteins_with&query=${searchQuery}`
    )
      .then((response) => response.json())
      .then((results) => setProteinsWith(results.facets[0].values));
  };

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const geneValue = (
      event.currentTarget.elements.namedItem("geneName") as HTMLInputElement
    ).value;

    const organismValue = (
      event.currentTarget.elements.namedItem("organism") as HTMLSelectElement
    ).value;

    const sequenceLengthFromValue = Number.parseInt(
      (
        event.currentTarget.elements.namedItem(
          "sequenceFrom"
        ) as HTMLInputElement
      ).value
    );

    const sequenceLengthToValue = Number.parseInt(
      (event.currentTarget.elements.namedItem("sequenceTo") as HTMLInputElement)
        .value
    );

    const annotationScoreValue = (
      event.currentTarget.elements.namedItem(
        "annotationScore"
      ) as HTMLSelectElement
    ).value;

    const proteinWithValue = (
      event.currentTarget.elements.namedItem("proteinWith") as HTMLSelectElement
    ).value;

    dispatch(
      fetchItems({
        query: searchQuery,
        filters: {
          gene: geneValue,
          organism: organismValue,
          sequence: {
            from: sequenceLengthFromValue,
            to: sequenceLengthToValue,
          },
          annotationScore: annotationScoreValue,
          proteinWith: proteinWithValue,
        },
      })
    );
    setSearchParams({
      query: searchQuery,
      geneValue,
      organismName:
        organisms.find(({ value }) => value === organismValue)?.label || "",
      organismValue,
      sequenceLengthFromValue: sequenceLengthFromValue.toString(),
      sequenceLengthToValue: sequenceLengthToValue.toString(),
      annotationScoreValue,
      annotationScoreName:
        annotationScores.find(({ value }) => value === annotationScoreValue)
          ?.label || "",
      proteinWithValue,
      proteinWithName:
        proteinsWith.find(({ value }) => value === proteinWithValue)?.label ||
        "",
    });
    onClose();
  };

  return (
    <div className="filters-container">
      <h3>{"Filters"}</h3>
      <form onSubmit={applyFilters}>
        <FormInput
          type="text"
          placeholder="Enter Gene Name"
          title="Gene Name"
          id="geneName"
          name="geneName"
          styleClasses="form-input-distance"
          defaultValue={searchParams.get("geneValue") || ""}
        />

        <div className="select-container form-input-distance">
          <label htmlFor="organism" className="filters-label">
            {"Organism"}
          </label>
          <select
            id="organism"
            name="organism"
            className="filters-select"
            defaultValue={searchParams.get("organismValue") || ""}
            onClick={handleOrganismLoading}
          >
            <option value="" disabled>
              {"Select an option\r"}
            </option>
            {organisms.map((organism) => (
              <option key={organism.value} value={organism.value}>
                {organism.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input-distance">
          <label className="filters-label" htmlFor="sequenceFrom">
            {"Sequence length\r"}
          </label>
          <div className="filters-sequence-container">
            <FormInput
              type="number"
              placeholder="From"
              id="sequenceFrom"
              name="sequenceFrom"
              styleClasses="sequence-input"
              defaultValue={searchParams.get("sequenceLengthFromValue") || ""}
            />
            <DashIcon />
            <FormInput
              type="number"
              placeholder="To"
              id="sequenceTo"
              name="sequenceTo"
              styleClasses="sequence-input"
              defaultValue={searchParams.get("sequenceLengthToValue") || ""}
            />
          </div>
        </div>

        <div className="select-container form-input-distance">
          <label htmlFor="annotationScore" className="filters-label">
            {"Annotation score"}
          </label>
          <select
            id="annotationScore"
            name="annotationScore"
            className="filters-select"
            defaultValue={searchParams.get("annotationScoreValue") || ""}
            onClick={handleAnnotationScoreLoading}
          >
            <option value="" disabled>
              {"Select an option\r"}
            </option>
            {annotationScores.map((score) => (
              <option key={score.value} value={score.value}>
                {score.label}
              </option>
            ))}
          </select>
        </div>

        <div className="select-container form-input-distance">
          <label htmlFor="proteinWith" className="filters-label">
            {"Protein with"}
          </label>
          <select
            id="proteinWith"
            name="proteinWith"
            className="filters-select"
            defaultValue={searchParams.get("proteinWithValue") || ""}
            onClick={handleProteinWithLoading}
          >
            <option value="" disabled>
              {"Select\r"}
            </option>
            {proteinsWith.map((protein) => (
              <option key={protein.value} value={protein.value}>
                {protein.label}
              </option>
            ))}
          </select>
        </div>

        <div className="buttons-container">
          <Button
            buttonType={ButtonType.WHITE_BASE}
            styleClasses="filters-btn"
            type="reset"
            onClick={onClose}
          >
            {"Cancel"}
          </Button>
          <Button
            buttonType={ButtonType.BASE}
            styleClasses="filters-btn"
            type="submit"
          >
            {"Apply filters"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FiltersPopup;
