import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as DashIcon } from "../../assets/dash.svg";
import {
  selectFilters,
  selectSearchQuery,
  setFilters,
} from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";
import Button, { ButtonType } from "../button/button.component";
import FormInput from "../form-input/form-input.component";

import "./filters-popup.styles.scss";

interface Filter {
  label: string;
  value: string;
}

const FiltersPopup = ({ onClose }: { onClose: () => void }) => {
  const searchQuery = useSelector(selectSearchQuery);
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);

  const [organisms, setOrganisms] = useState<Filter[]>([
    {
      label: filters?.organism?.name || "",
      value: filters?.organism?.id || "",
    },
  ]);

  const [annotationScores, setAnnotationScores] = useState<Filter[]>([
    {
      label: filters?.annotationScore || "",
      value: filters?.annotationScore || "",
    },
  ]);

  const [proteinsWith, setProteinsWith] = useState<Filter[]>([
    {
      label: filters?.proteinWith?.name || "",
      value: filters?.proteinWith?.id || "",
    },
  ]);

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

    const formElements = event.currentTarget.elements;

    const getFormElement = <ElementType extends HTMLElement>(name: string) => {
      return formElements.namedItem(name) as ElementType;
    };

    const geneValue = getFormElement<HTMLInputElement>("geneName").value;

    const { selectedIndex: organismIndex, options: organismOptions } =
      getFormElement<HTMLSelectElement>("organism");

    const { value: organismValue, text: organismName } =
      organismIndex !== 0
        ? organismOptions[organismIndex]
        : { value: "", text: "" };

    const sequenceLengthFromValue = Number.parseInt(
      getFormElement<HTMLInputElement>("sequenceFrom").value
    );

    const sequenceLengthToValue = Number.parseInt(
      getFormElement<HTMLInputElement>("sequenceTo").value
    );

    const annotationScoreValue =
      getFormElement<HTMLSelectElement>("annotationScore").value;

    const { selectedIndex: proteinWithIndex, options: proteinWithOptions } =
      getFormElement<HTMLSelectElement>("proteinWith");

    const { value: proteinWithValue, text: proteinWithName } =
      proteinWithIndex !== 0
        ? proteinWithOptions[proteinWithIndex]
        : { value: "", text: "" };

    dispatch(
      setFilters({
        gene: geneValue,
        organism: { name: organismName, id: organismValue },
        sequence: {
          from: sequenceLengthFromValue,
          to: sequenceLengthToValue,
        },
        annotationScore: annotationScoreValue,
        proteinWith: { name: proteinWithName, id: proteinWithValue },
      })
    );

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
          defaultValue={filters?.gene}
        />

        <div className="select-container form-input-distance">
          <label htmlFor="organism" className="filters-label">
            {"Organism"}
          </label>
          <select
            id="organism"
            name="organism"
            className="filters-select"
            defaultValue={filters?.organism?.id}
            onClick={handleOrganismLoading}
          >
            <option value="" key={0}>
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
              defaultValue={filters?.sequence?.from}
            />
            <DashIcon />
            <FormInput
              type="number"
              placeholder="To"
              id="sequenceTo"
              name="sequenceTo"
              styleClasses="sequence-input"
              defaultValue={filters?.sequence?.to}
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
            defaultValue={filters?.annotationScore}
            onClick={handleAnnotationScoreLoading}
          >
            <option value="" key={0}>
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
            defaultValue={filters?.proteinWith?.id}
            onClick={handleProteinWithLoading}
          >
            <option value="" key={0}>
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
