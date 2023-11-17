import { Dispatch, useReducer } from "react";
import { Model, ParamSet } from "../polystar";

const defaultParamScheme: ParamSet = [];

const models: Model[] = [
  {
    option: "NONE",
    label: "NONE",
    icon: null,
    model: null,
    console: null,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
];

const modelReducer = (state: any, action: any) => {
  let selectedModel;

  switch (action.type) {
    case "...":
      selectedModel =
        models.find((model: Model) => model.option === "...") || models[0];
      break;
    case "...":
      selectedModel =
        models.find((model: Model) => model.option === "...") || models[0];
      break;
    default:
      throw new Error(`ERROR: ${action.type} is not a valid model`);
  }

  return {
    ...selectedModel,
    model: selectedModel,
  };
};

function useModel(): [Model[], Model, Dispatch<any>] {
  const defaultModel =
    models.find((model: Model) => model.default === true) || models[0];

  const model = {
    ...defaultModel,
    model: defaultModel.model,
  };

  const [currentModel, setCurrentModel] = useReducer(modelReducer, model);

  return [models, currentModel, setCurrentModel];
}

export default useModel;
