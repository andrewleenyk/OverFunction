import React from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { createStringInstrument } from "./stringInstrument";

const RIVE_SRC = "/assets/rive/line-repel.riv";
const STRING_COUNT = 8;
const STRING_TOP = 0.18;
const STRING_BOTTOM = 0.82;
const STRING_COOLDOWN_MS = 40;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getStringLane(index) {
  if (STRING_COUNT === 1) {
    return 0.5;
  }

  return (
    STRING_TOP + (index / (STRING_COUNT - 1)) * (STRING_BOTTOM - STRING_TOP)
  );
}

function getNormalizedPoint(event, element) {
  const rect = element.getBoundingClientRect();

  return {
    x: clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1),
    y: clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1),
    time: performance.now(),
  };
}

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
  const stageRef = React.useRef(null);
  const instrumentRef = React.useRef(null);
  const lastPointRef = React.useRef(null);
  const stringCooldownsRef = React.useRef(
    Array.from({ length: STRING_COUNT }, () => 0),
  );

  if (!instrumentRef.current) {
    instrumentRef.current = createStringInstrument();
  }

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

  React.useEffect(() => {
    const instrument = instrumentRef.current;

    return () => {
      instrument?.cleanup();
    };
  }, []);

  const triggerPluck = React.useCallback((stringIndex, x, deltaY, speed) => {
    const now = performance.now();

    if (now - stringCooldownsRef.current[stringIndex] < STRING_COOLDOWN_MS) {
      return;
    }

    stringCooldownsRef.current[stringIndex] = now;
    instrumentRef.current?.pluck({
      stringIndex,
      position: x,
      direction: deltaY >= 0 ? 1 : -1,
      velocity: clamp(speed / 1.5, 0.12, 1),
    });
  }, []);

  const handlePointerDown = React.useCallback(async (event) => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    await instrumentRef.current?.unlock();
    lastPointRef.current = getNormalizedPoint(event, stage);
  }, []);

  const handlePointerEnter = React.useCallback((event) => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    lastPointRef.current = getNormalizedPoint(event, stage);
  }, []);

  const handlePointerLeave = React.useCallback(() => {
    lastPointRef.current = null;
  }, []);

  const handlePointerMove = React.useCallback(
    (event) => {
      const stage = stageRef.current;

      if (!stage) {
        return;
      }

      const point = getNormalizedPoint(event, stage);
      const previousPoint = lastPointRef.current;
      lastPointRef.current = point;

      if (!previousPoint) {
        return;
      }

      const deltaX = point.x - previousPoint.x;
      const deltaY = point.y - previousPoint.y;
      const elapsedSeconds = Math.max(
        (point.time - previousPoint.time) / 1000,
        1 / 240,
      );
      const speed = Math.abs(deltaY) / elapsedSeconds;

      if (Math.abs(deltaY) < 0.002 || speed < 0.08) {
        return;
      }

      for (let i = 0; i < STRING_COUNT; i += 1) {
        const lane = getStringLane(i);
        const crossed =
          (previousPoint.y <= lane && point.y >= lane) ||
          (previousPoint.y >= lane && point.y <= lane);

        if (!crossed) {
          continue;
        }

        const progress =
          Math.abs(deltaY) < 0.000001
            ? 0.5
            : clamp((lane - previousPoint.y) / deltaY, 0, 1);
        const x = clamp(previousPoint.x + deltaX * progress, 0, 1);

        triggerPluck(i, x, deltaY, speed);
      }
    },
    [triggerPluck],
  );

  return (
    <div
      ref={stageRef}
      className="rive-test__stage"
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
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
