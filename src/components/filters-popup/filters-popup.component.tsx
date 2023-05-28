import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";

import {
  selectFilters,
  selectSearchQuery,
  setFilters,
} from "../../store/slices/entries.slice";
import { AppDispatch } from "../../store/store";
import Button, { ButtonType } from "../button/button.component";
import FormInput from "../form-input/form-input.component";

import { ReactComponent as DashIcon } from "../../assets/dash.svg";
import { ReactComponent as ArrowIcon } from "../../assets/selectIcon.svg";

import "./filters-popup.styles.scss";

interface Filter {
  label: string;
  value: string;
}

const FiltersPopup = ({ onClose }: { onClose: () => void }) => {
  const searchQuery = useSelector(selectSearchQuery);
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);
  const [isOrganismLoading, setIsOrganismLoading] = useState(false);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const [isProteinLoading, setIsProteinLoading] = useState(false);
  const [geneName, setGeneName] = useState(filters?.gene);
  const [seqLenFrom, setSeqLenFrom] = useState(filters?.sequence?.from);
  const [seqLenTo, setSeqLenTo] = useState(filters?.sequence?.to);

  const [selectedOrganism, setSelectedOrganism] = useState<Filter | null>(
    filters?.organism
      ? {
          label: filters?.organism?.name,
          value: filters?.organism?.id,
        }
      : null
  );

  const [selectedScore, setSelectedScore] = useState<Filter | null>(
    filters?.annotationScore
      ? { label: filters.annotationScore, value: filters.annotationScore }
      : null
  );

  const [selectedProtein, setSelectedProtein] = useState<Filter | null>(
    filters?.proteinWith
      ? { label: filters.proteinWith.name, value: filters.proteinWith.id }
      : null
  );

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
    setOrganisms([]);
    setIsOrganismLoading(true);

    return fetch(
      ` https://rest.uniprot.org/uniprotkb/search?facets=model_organism&query=${searchQuery}`
    )
      .then((response) => response.json())
      .then((results) => {
        setOrganisms(results.facets[0].values);
        setIsOrganismLoading(false);

        return;
      });
  };

  const handleAnnotationScoreLoading = () => {
    setAnnotationScores([]);
    setIsScoreLoading(true);

    return fetch(
      ` https://rest.uniprot.org/uniprotkb/search?facets=annotation_score&query=${searchQuery}`
    )
      .then((response) => response.json())
      .then((results) => {
        setAnnotationScores(
          results.facets[0].values.map((item: { value: string }) => ({
            value: item.value,
            label: item.value,
          }))
        );
        setIsScoreLoading(false);

        return;
      });
  };

  const handleProteinWithLoading = () => {
    setProteinsWith([]);
    setIsProteinLoading(true);

    return fetch(
      ` https://rest.uniprot.org/uniprotkb/search?facets=proteins_with&query=${searchQuery}`
    )
      .then((response) => response.json())
      .then((results) => {
        setProteinsWith(results.facets[0].values);
        setIsProteinLoading(false);

        return;
      });
  };

  const convertInputToFilters = () => {
    return {
      gene: geneName,
      organism: {
        name: selectedOrganism?.label,
        id: selectedOrganism?.value,
      },
      sequence: {
        from: seqLenFrom,
        to: seqLenTo,
      },
      annotationScore: selectedScore?.value,
      proteinWith: {
        name: selectedProtein?.label,
        id: selectedProtein?.value,
      },
    };
  };

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(setFilters(convertInputToFilters()));

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
          defaultValue={geneName}
          onChange={(event) => setGeneName(event.currentTarget.value)}
        />

        <div className="select-container form-input-distance">
          <label htmlFor="organism" className="filters-label">
            {"Organism"}
          </label>
          <Select
            defaultValue={filters?.organism?.id}
            onDropdownVisibleChange={handleOrganismLoading}
            placeholder="Select an option"
            options={organisms}
            loading={isOrganismLoading}
            allowClear
            suffixIcon={!isOrganismLoading ? <ArrowIcon /> : undefined}
            onSelect={(value) => {
              setSelectedOrganism({
                value,
                label: organisms.find(({ value: v }) => v === value)
                  ?.label as string,
              });
            }}
            onClear={() => setSelectedOrganism(null)}
          />
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
              defaultValue={seqLenFrom}
              onChange={(event) =>
                setSeqLenFrom(
                  event.currentTarget.value === ""
                    ? undefined
                    : +event.currentTarget.value
                )
              }
            />
            <DashIcon />
            <FormInput
              type="number"
              placeholder="To"
              id="sequenceTo"
              name="sequenceTo"
              styleClasses="sequence-input"
              defaultValue={seqLenTo}
              onChange={(event) =>
                setSeqLenTo(
                  event.currentTarget.value === ""
                    ? undefined
                    : +event.currentTarget.value
                )
              }
            />
          </div>
        </div>

        <div className="select-container form-input-distance">
          <label htmlFor="annotationScore" className="filters-label">
            {"Annotation score"}
          </label>
          <Select
            defaultValue={filters?.annotationScore}
            onDropdownVisibleChange={handleAnnotationScoreLoading}
            placeholder="Select an option"
            options={annotationScores}
            loading={isScoreLoading}
            allowClear
            suffixIcon={!isScoreLoading ? <ArrowIcon /> : undefined}
            onClear={() => setSelectedScore(null)}
            onSelect={(value) => {
              setSelectedScore({
                value,
                label: annotationScores.find(({ value: v }) => v === value)
                  ?.label as string,
              });
            }}
          />
        </div>

        <div className="select-container form-input-distance">
          <label htmlFor="proteinWith" className="filters-label">
            {"Protein with"}
          </label>
          <Select
            defaultValue={filters?.proteinWith?.id}
            onDropdownVisibleChange={handleProteinWithLoading}
            placeholder="Select an option"
            options={proteinsWith}
            loading={isProteinLoading}
            allowClear
            suffixIcon={!isProteinLoading ? <ArrowIcon /> : undefined}
            onClear={() => setSelectedProtein(null)}
            onSelect={(value) => {
              setSelectedProtein({
                value,
                label: proteinsWith.find(({ value: v }) => v === value)
                  ?.label as string,
              });
            }}
          />
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
            disabled={[
              geneName,
              selectedOrganism?.value,
              seqLenFrom,
              seqLenTo,
              selectedScore?.value,
              selectedProtein?.value,
            ].every((v) =>
              [null, undefined, ""].includes(v as null | undefined | string)
            )}
          >
            {"Apply filters"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FiltersPopup;
