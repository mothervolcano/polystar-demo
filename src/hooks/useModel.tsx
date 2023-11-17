import { Dispatch, useReducer } from "react";
import { Model, ParamSet } from "../polystar";

import Polystar from "../polystar/models/polystar";
import DefaultConsole from "../components/consoles/default";

const defaultParams: ParamSet = [
  {
    id: "p0",
    name: "sideCtrl",
    value: 5,
    range: [3, 12],
    step: 1,
    label: "Sides",
  },
  {
    id: "p1",
    name: "expansionCtrl",
    value: 0.5,
    range: [0, 1],
    step: 0.01,
    label: "Push <> Pull",
  },
  {
    id: "p2",
    name: "twirlCtrl",
    value: 1,
    range: [0, 2],
    step: 0.01,
    label: "Twirl <>",
  },
  {
    id: "p3",
    name: "tipRoundnessCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Tip Roundness",
  },
  {
    id: "p4",
    name: "joinRoundessCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Join Roundness",
  },
  {
    id: "p5",
    name: "extendCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Tip Length",
  },
  {
    id: "p6",
    name: "shrinkCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Body",
  },
];

const models: Model[] = [
  {
    option: "POLYGON",
    label: "Polygon",
    icon: null,
    model: Polystar,
    console: DefaultConsole,
    params: defaultParams,
    default: true,
    checked: false,
  },
];

const modelReducer = (state: any, action: any) => {
  let selectedModel;

  switch (action.type) {
    case "POLYGON":
      selectedModel =
        models.find((model: Model) => model.option === "POLYGON") || models[0];
      break;
    case "STAR":
      selectedModel =
        models.find((model: Model) => model.option === "STAR") || models[0];
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
