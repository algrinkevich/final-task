import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";

import { UniprotService } from "../../api/uniprot-service";
import {
  selectFilters,
  selectSearchQuery,
  setFilters,
  setSearchQuery,
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

  const service = new UniprotService();

  const handleOrganismLoadingAsync = async () => {
    setOrganisms([]);
    setIsOrganismLoading(true);

    const facetsResponse = await service.getFacetsAsync({
      facetName: "model_organism",
      searchParams: { query: searchQuery || "*", filters },
    });

    setOrganisms(facetsResponse.facets[0].values);
    setIsOrganismLoading(false);
  };

  const handleAnnotationScoreLoadingAsync = async () => {
    setAnnotationScores([]);
    setIsScoreLoading(true);

    const facetsResponse = await service.getFacetsAsync({
      facetName: "annotation_score",
      searchParams: { query: searchQuery || "*", filters },
    });

    setAnnotationScores(
      facetsResponse.facets[0].values.map((item: { value: string }) => ({
        value: item.value,
        label: item.value,
      }))
    );
    setIsScoreLoading(false);
  };

  const handleProteinWithLoadingAsync = async () => {
    setProteinsWith([]);
    setIsProteinLoading(true);

    const facetsResponse = await service.getFacetsAsync({
      facetName: "proteins_with",
      searchParams: { query: searchQuery || "*", filters },
    });

    setProteinsWith(facetsResponse.facets[0].values);
    setIsProteinLoading(false);
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

    if (searchQuery === "") {
      dispatch(setSearchQuery("*"));
    }
    dispatch(setFilters(convertInputToFilters()));

    onClose();
  };

  const areFiltersChanged = useMemo(() => {
    const fieldsToCheck = [
      [filters?.gene, geneName],
      [filters?.organism?.id, selectedOrganism?.value],
      [filters?.sequence?.from, seqLenFrom],
      [filters?.sequence?.to, seqLenTo],
      [filters?.annotationScore, selectedScore?.value],
      [filters?.proteinWith?.id, selectedProtein?.value],
    ];

    // eslint-disable-next-line eqeqeq
    return !fieldsToCheck.every(([v1, v2]) => v1 == v2);
  }, [
    filters,
    geneName,
    selectedOrganism,
    seqLenFrom,
    seqLenTo,
    selectedScore,
    selectedProtein,
  ]);

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
          onChange={(event) =>
            setGeneName(event.currentTarget.value || undefined)
          }
        />

        <div className="select-container form-input-distance">
          <label htmlFor="organism" className="filters-label">
            {"Organism"}
          </label>
          <Select
            defaultValue={filters?.organism?.id}
            onDropdownVisibleChange={handleOrganismLoadingAsync}
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
            onDropdownVisibleChange={handleAnnotationScoreLoadingAsync}
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
            onDropdownVisibleChange={handleProteinWithLoadingAsync}
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
            disabled={!areFiltersChanged}
          >
            {"Apply filters"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FiltersPopup;
