import { ReactComponent as DashIcon } from "../../assets/dash.svg";
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

const FiltersPopup = () => {
  return (
    <div className="filters-container">
      <h3>{"Filters"}</h3>
      <form>
        <FormInput
          type="text"
          placeholder="Enter Gene Name"
          title="Gene Name"
          id="geneName"
          name="geneName"
          styleClasses="form-input-distance"
        />

        <div className="select-container form-input-distance">
          <label htmlFor="organism" className="filters-label">
            {"Organism"}
          </label>
          <select
            id="organism"
            name="organism"
            className="filters-select"
            defaultValue=""
          >
            <option value="" disabled>
              {"Select an option\r"}
            </option>
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
            />
            <DashIcon />
            <FormInput
              type="number"
              placeholder="To"
              id="sequenceTo"
              name="sequenceTo"
              styleClasses="sequence-input"
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
            defaultValue=""
          >
            <option value="" disabled>
              {"Select an option\r"}
            </option>
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
            defaultValue=""
          >
            <option value="" disabled>
              {"Select\r"}
            </option>
          </select>
        </div>

        <div className="buttons-container">
          <Button buttonType={ButtonType.WHITE_BASE} styleClasses="filters-btn">
            {"Cancel"}
          </Button>
          <Button buttonType={ButtonType.BASE} styleClasses="filters-btn">
            {"Apply filters"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FiltersPopup;
