import { Dispatch, useReducer } from "react";
import { Model, ParamSet } from "../polystar";

import Polystar from "../polystar/models/polystar";
import TopoTest from "../polystar/models/topoTest";
import DefaultConsole from "../components/consoles/default";

const defaultParams: ParamSet = [
  {
    id: "p0",
    name: "sideCtrl",
    value: 5,
    range: [3, 12],
    step: 1,
    label: "Sides",
    rank: 1,
  },
  {
    id: "p1",
    name: "expansionCtrl",
    value: 0.5,
    range: [0, 1],
    step: 0.01,
    label: "Push <> Pull",
    rank: 2,
  },
  {
    id: "p2",
    name: "twirlCtrl",
    value: 1,
    range: [0, 2],
    step: 0.01,
    label: "Twirl <>",
    rank: 1,
  },
  {
    id: "p5",
    name: "extendCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Tip Length",
    rank: 2,
  },
  {
    id: "p3",
    name: "tipRoundnessCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Tip Roundness",
    rank: 1,
  },
  {
    id: "p4",
    name: "joinRoundessCtrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "Join Roundness",
    rank: 2,
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
    default: false,
    checked: false,
  },
  {
  option: "TEST",
    label: "Topo Test",
    icon: null,
    model: TopoTest,
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
    case "TEST":
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
