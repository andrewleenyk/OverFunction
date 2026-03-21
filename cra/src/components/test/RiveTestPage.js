import React from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

const RIVE_SRC = "/assets/rive/line-repel.riv";

function getDefaultSelection(metadata) {
  if (metadata.stateMachineNames.length) {
    return { mode: "stateMachine", name: metadata.stateMachineNames[0] };
  }

  if (metadata.animationNames.length) {
    return { mode: "animation", name: metadata.animationNames[0] };
  }

  return { mode: "none", name: "" };
}

function RivePreview({ selection, onMetadata, onError }) {
  const layout = React.useMemo(
    () =>
      new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    [],
  );

  const riveParams = React.useMemo(() => {
    const params = {
      src: RIVE_SRC,
      autoplay: true,
      layout,
      onRiveReady: (rive) => {
        const artboards = rive.contents?.artboards ?? [];

        onMetadata({
          activeArtboard: rive.activeArtboard || artboards[0]?.name || "",
          artboards: artboards.map((artboard) => artboard.name),
          animationNames: rive.animationNames,
          stateMachineNames: rive.stateMachineNames,
        });
      },
      onLoadError: (event) => {
        const message =
          typeof event?.data === "string"
            ? event.data
            : "Unable to load the Rive file.";
        onError(message);
      },
    };

    if (selection.mode === "stateMachine" && selection.name) {
      params.stateMachines = selection.name;
    } else if (selection.mode === "animation" && selection.name) {
      params.animations = selection.name;
    }

    return params;
  }, [layout, onError, onMetadata, selection.mode, selection.name]);

  const { RiveComponent } = useRive(riveParams, {
    useDevicePixelRatio: true,
    shouldResizeCanvasToContainer: true,
  });

  return (
    <div className="rive-test__stage">
      <RiveComponent
        className="rive-test__canvas"
        aria-label="Rive animation preview"
      />
    </div>
  );
}

export default function RiveTestPage() {
  const [error, setError] = React.useState("");
  const [selection, setSelection] = React.useState({
    mode: "none",
    name: "",
  });

  const handleMetadata = React.useCallback((nextMetadata) => {
    setError("");
    setSelection((currentSelection) =>
      currentSelection.name
        ? currentSelection
        : getDefaultSelection(nextMetadata),
    );
  }, []);

  return (
    <section className="rive-test">
      <RivePreview
        key={`${selection.mode}:${selection.name || "default"}`}
        selection={selection}
        onMetadata={handleMetadata}
        onError={setError}
      />

      {error ? <p className="rive-test__error">{error}</p> : null}
    </section>
  );
}
