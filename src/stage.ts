import { Layer } from "paper";
import { paperScope } from "./components/PaperStage";

let view: any;
let layer: any;
let guides: any;

let model: any;

export function reset(width?: number, height?: number) {
  paperScope.project.clear();
  view = paperScope.project.view;
  if (width && height) {
    view.viewSize = [width, height];
  }
  layer = new Layer();
  guides = new Layer();
}

// Note: initializes the requested model and creates a state and or context that is used by the other methods: generate, regenerate and redraw;
export function initModel(selectedModel: any) {
  model = new selectedModel((view.size.width + view.size.height) / 12, [
    view.center.x,
    view.center.y - view.size.height / 9,
  ]);
}

// NOTE: create the model based on the starting parameters
export function configure(options: { fill: boolean; color: string }) {
  model.configure(options);
}

// Note: modifies the model based on user or external input;
export function draw(params: any, scaleCtrl: number) {
  // const { sideCtrl, lengthCtrl, curveCtrl } = params;

  model.draw(params);
  layer.addChild(model.getShapePath());
  // guides.removeChildren();
}

export function extractPath() {
  if (model) {
    const pathForSvg = model.getShapePath().clone();
    pathForSvg.visible = false;
    pathForSvg.pivot = pathForSvg.bounds.topLeft;
    pathForSvg.position = [0, 0];

    return pathForSvg;
  }
}
