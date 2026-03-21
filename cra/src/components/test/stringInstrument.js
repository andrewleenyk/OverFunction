const STRING_FREQUENCIES = [
  82.41, 110.0, 146.83, 196.0, 246.94, 329.63, 392.0, 493.88,
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createNoiseBuffer(context) {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * 0.08));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    channel[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function createStringInstrument() {
  let context = null;
  let compressor = null;
  let master = null;
  let noiseBuffer = null;

  function ensureContext() {
    if (typeof window === "undefined") {
      return null;
    }

    if (!context) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      context = new AudioContextClass();

      compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 14;
      compressor.ratio.value = 3;

      master = context.createGain();
      master.gain.value = 0.18;

      compressor.connect(master);
      master.connect(context.destination);
      noiseBuffer = createNoiseBuffer(context);
    }

    return context;
  }

  async function unlock() {
    const audioContext = ensureContext();

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }
  }

  function pluck({
    stringIndex = 0,
    velocity = 0.5,
    position = 0.5,
    direction = 1,
  }) {
    const audioContext = ensureContext();

    if (
      !audioContext ||
      audioContext.state !== "running" ||
      !compressor ||
      !noiseBuffer
    ) {
      return;
    }

    const now = audioContext.currentTime;
    const safeVelocity = clamp(velocity, 0.08, 1);
    const safePosition = clamp(position, 0, 1);
    const frequency =
      STRING_FREQUENCIES[stringIndex % STRING_FREQUENCIES.length] *
      (1 + safePosition * 0.55);

    const burst = audioContext.createBufferSource();
    burst.buffer = noiseBuffer;

    const burstFilter = audioContext.createBiquadFilter();
    burstFilter.type = "bandpass";
    burstFilter.frequency.value = frequency * (1.8 + safeVelocity);
    burstFilter.Q.value = 0.8 + safeVelocity * 1.6;

    const burstGain = audioContext.createGain();
    burstGain.gain.setValueAtTime(0.0001, now);
    burstGain.gain.exponentialRampToValueAtTime(0.3 * safeVelocity, now + 0.004);
    burstGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    const bodyOsc = audioContext.createOscillator();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.value = frequency;

    const bodyGain = audioContext.createGain();
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.09 + safeVelocity * 0.1, now + 0.008);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9 + safeVelocity * 1.8);

    const shimmerOsc = audioContext.createOscillator();
    shimmerOsc.type = "sine";
    shimmerOsc.frequency.value = frequency * (2.05 + safePosition * 0.6);

    const shimmerGain = audioContext.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.014 + safeVelocity * 0.025, now + 0.01);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    const toneFilter = audioContext.createBiquadFilter();
    toneFilter.type = "lowpass";
    toneFilter.frequency.value = clamp(
      900 + frequency * (1.2 + safePosition * 2.2),
      700,
      4800,
    );

    const panner = audioContext.createStereoPanner();
    panner.pan.value = clamp((safePosition - 0.5) * 1.3 + direction * 0.08, -1, 1);

    burst.connect(burstFilter);
    burstFilter.connect(burstGain);
    burstGain.connect(toneFilter);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(toneFilter);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(toneFilter);

    toneFilter.connect(panner);
    panner.connect(compressor);

    burst.start(now);
    burst.stop(now + 0.07);
    bodyOsc.start(now);
    bodyOsc.stop(now + 2.1);
    shimmerOsc.start(now);
    shimmerOsc.stop(now + 0.22);
  }

  function cleanup() {
    if (!context) {
      return;
    }

    context.close();
    context = null;
    compressor = null;
    master = null;
    noiseBuffer = null;
  }

  return {
    unlock,
    pluck,
    cleanup,
  };
}
