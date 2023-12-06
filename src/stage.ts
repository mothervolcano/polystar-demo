import { Layer } from "paper";
import { paperScope } from "./components/PaperStage";

let view: any;
let layer: any;

let origin: any;

let model: any;

// ----------------------------------------------------------
// AUX

function calculateOrigin(width: number, height: number) {
  const viewRatio = width / height;

  if (viewRatio <= 1.30 && width < 415) {
    return { x: width / 2, y: height - height * 0.45 };
  }

  if (width < 1080) {
    return {x: width/2, y: height * 0.45 }
  }

  return { x: width / 2, y: height * 0.40 };
}

function calculateRadius(width: number, height: number) {
  const viewRatio = width / height;

  if (viewRatio <= 1) {

    return width * 0.75 * 0.5;
  }

  return height * 0.60 * 0.5;
}

export function reset() {
  paperScope.project.clear();
  view = paperScope.project.view;
  layer = new Layer();
}

export function resize({ width, height }: { width: number; height: number }) {
  if (view) {
    view.viewSize = [width, height];
  }
}

// Note: initializes the requested model and creates a state and or context that is used by the other methods: generate, regenerate and redraw;
export function initModel(selectedModel: any) {
  origin = calculateOrigin(view.size.width, view.size.height);
  const radius = calculateRadius(view.size.width, view.size.height);
  model = new selectedModel(radius, origin);
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
