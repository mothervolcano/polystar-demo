import { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";

import { Container, Flex, Stack, Title, Text, DEFAULT_THEME, Space, ColorPicker, Button, Divider } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";

// .......................................................

import { Model, ParamSet } from "./polystar";
import { initModel, configure, draw, extractPath } from "./stage";
import { convertPathToSVG } from "./polystar/util/pathUtils";
import useModel from "./hooks/useModel";
import ShapeContext from "./ShapeContext";

import PaperStage from "./components/PaperStage";
import Gallery from "./components/Gallery";


// --------------------------------------------------------------
// HELPERS

function parseParams(updatedParams: ParamSet) {
  const modelParams: any = {};

  Array.from(updatedParams.values()).forEach((p: any) => {
    modelParams[p.name] = p.value;
  });

  return modelParams;
}

// --------------------------------------------------------------
// LAYOUT COMPONENTS

const Layout = ({ orientation, children }: any) => {
  if (orientation === "LANDSCAPE") {
    return (
      <Flex direction="row">
        <div style={{ position: "relative", minWidth: "300px", maxWidth: "25%", overflowY: "auto" }}>{children[0]}</div>
        <div style={{ position: "relative", minWidth: "250px", flexGrow: "1" }}>{children[1]}</div>
      </Flex>
    );
  } else if (orientation === "PORTRAIT") {
    return (
      <Stack justify="flex-start" align="stretch">
        <div style={{ position: "relative" }}>{children[1]}</div>
        <div style={{ position: "relative", overflowY: "auto" }}>{children[0]}</div>
      </Stack>
    );
  } else {
    return null;
  }
};

function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [models, currentModel, setCurrentModel] = useModel();
  const [consoleParams, setConsoleParams] = useState<ParamSet | null>(null);
  const [hasFill, setHasFill] = useState<boolean>(true);
  const [artColor, setArtColor] = useState("#000000");
  const [scaleCtrl, setScaleCtrl] = useState(3);

  const { shapeCollection, setShapeCollection } = useContext(ShapeContext);

  /**
   * Called by the PaperStage when paper is installed and a PaperScope object is available
   * */
  const onStageReady = (paperScope: paper.PaperScope) => {
    // console.log("STAGE READY! ", paperScope);
    const params = parseParams(currentModel.params);

    const options = {
      fill: hasFill,
      color: artColor,
    };

    initModel(currentModel.model, paperScope);
    configure(options);
    draw(params, scaleCtrl);

    if (!initialized) {
      setInitialized(true);
    }
  };

  /**
   * Called by the PaperStage when the canvas is resized
   * */
  const onStageResize = (view: paper.View) => {
    // console.log("STAGE RESIZED! ", view);
    const params = parseParams(currentModel.params);
    draw(params, scaleCtrl);
  };

  /**
   * Update and parse the params when user input is received on the console
   * */
  useEffect(() => {
    // console.log("2 --> Console Input Received! Checking: ");
    if (!initialized) {
      return;
    }

    const params = parseParams(currentModel.params);
    draw(params, scaleCtrl);
  }, [consoleParams]);

  /**
   * Update the model when new art settings are received
   * */
  useEffect(() => {
    // console.log("3 --> Shape Settings Updated! Checking: ");
    if (!initialized) {
      console.log("PAPER ISN'T LOADED");
      return;
    }

    const params = parseParams(currentModel.params);

    const options = {
      fill: hasFill,
      color: artColor,
    };

    // reset(paperScope);
    configure(options);
    draw(params, scaleCtrl);
  }, [hasFill, artColor]);

  // -------------------------------------------------------------------------------------------------------
  // MEDIA QUERIES

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isPortrait = useMediaQuery("(orientation: portrait)");

  // -------------------------------------------------------------------------------------------------------
  // HANDLERS

  /**
   * Handler for the console
   * */
  const handleParamCtrlInputForModel = (updatedParams: any) => {
    setConsoleParams(updatedParams);
  };

  /**
   * Handler for the gallery save function
   * */
  const saveShape = (event: SyntheticEvent) => {
    // ...
    event.preventDefault();

    const currentShapePath = extractPath();
    const currentShapeSvgData = convertPathToSVG(currentShapePath, 1);

    const shapeToSave = {
      timestamp: null,
      svg: currentShapeSvgData,
      color: artColor,
      width: currentShapePath.bounds.width,
      height: currentShapePath.bounds.height,
    };

    currentShapePath.remove();

    const collection = shapeCollection.slice();
    const nextSlot = collection.findIndex((item) => item.svg === null);
    collection[nextSlot] = shapeToSave;

    setShapeCollection(collection);
  };

  // -------------------------------------------------------------------------------------------------------
  // STYLES

  const frameMargin = 6;
  const dark = DEFAULT_THEME.colors.dark[5];
  const softDark = DEFAULT_THEME.colors.dark[0];
  const light = DEFAULT_THEME.colors.gray[0];
  const softLight = DEFAULT_THEME.colors.gray[2];

  const containerStyle = {
    // position: "relative",
    width: "100%",
    height: "100vh",
    padding: isDesktop ? `${frameMargin}vh` : "0",
  };

  const frameStyle = {
    border: isDesktop ? `1px solid ${dark}` : "none",
    borderRadius: isDesktop ? `10px` : "none",
  };

  const sidebarStyle = {
    borderRadius: isDesktop ? "8px 0 0 0" : "none",
  };

  const stageStyle = {
    height: isLandscape ? `${100 - frameMargin * 2}vh` : `45vh`,
    borderLeft: isLandscape ? `1px solid ${dark}` : "none",
    borderBottom: isLandscape ? "none" : `1px solid ${dark}`,
  };

  const titleStyle = {
    position: "absolute",
    top: "15px",
    left: "15px",
  };

  const consoleLayoutType = isPortrait ? "ROW" : "COL";
  const consoleLayoutMode = isPortrait ? "COMPACT" : "NORMAL";

  // -------------------------------------------------------------------------------------------------------
  // BLOCKS

  const consoleSwitch = (model: Model, layout: string, mode: string) => {
    console.log("switch the console!");
    const Console = model.console;
    return (
      <Console params={currentModel.params} inputHandler={handleParamCtrlInputForModel} layout={layout} mode={mode} />
    );
  };

  const title = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "0.50rem",
          left: "1rem",
        }}
      >
        <Title c={dark}>Polystar</Title>
      </div>
    );
  };

  const saveButton = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: "0px",
          left: "0px",
          width: "100%",
        }}
      >
        <>
          <Flex justify="flex-end">
            <Button style={{}} bg={dark} m="1rem" variant="filled" onClick={saveShape}>
              Save
            </Button>
          </Flex>
          <Gallery />
        </>
      </div>
    );
  };

  const header = () => {
    return (
      <Container fluid w="100%" bg={dark} pt="sm" pb="md" mb="md" style={sidebarStyle}>
        <Title c={light}>Polystar</Title>
        <Space h="md" />
        <Text size="sm" c={softLight}>
          A polygon based shape creator.
        </Text>
      </Container>
    );
  };

  const panel = () => {
    return (
      <div style={{ width: "100%" }}>
        {isLandscape && header()}
        <Stack w={"100%"} pt="0.5rem" pl="1rem" pr="1rem" gap={15}>
          {initialized && currentModel && consoleSwitch(currentModel, consoleLayoutType, consoleLayoutMode)}
          <div style={{}}>
            <Text
              size={isPortrait ? "0.80rem" : "sm"}
              fw={isPortrait ? "400" : "500"}
              c={isPortrait ? "var(--mantine-color-dark-2)" : "var(--mantine-color-dark-3)"}
            >
              Change Fill Color
            </Text>
            <Space h="sm" />
            <ColorPicker size="xs" w="100%" format="hex" value={artColor} onChange={setArtColor} />
          </div>
        </Stack>
      </div>
    );
  };

  return (
    <div>
      <header>
        <div style={containerStyle}>
          <div style={frameStyle}>
            <Layout orientation={isLandscape ? "LANDSCAPE" : "PORTRAIT"}>
              {panel()}
              <PaperStage style={stageStyle} onReady={onStageReady} onResize={onStageResize}>
                {!isLandscape && title()}
                {isLandscape && saveButton()}
              </PaperStage>
            </Layout>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
