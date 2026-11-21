"use client";

import { useEffect, useRef, useState } from "react";
import type { FillerEvent, Take } from "@/lib/practice";
import { stopSpeech } from "@/lib/speech";
import { loadTakeAudio } from "@/lib/take-audio";

export function useTakePlayback() {
  const context = useRef<AudioContext>(null);
  const source = useRef<AudioBufferSourceNode>(null);
  const playbackId = useRef(0);
  const [playing, setPlaying] = useState<Take | FillerEvent>();
  const [playbackError, setPlaybackError] = useState("");

  useEffect(() => () => {
    playbackId.current += 1;
    void context.current?.close().catch(() => undefined);
    context.current = null;
  }, []);

  function stopClip() {
    setPlaybackError("");
    playbackId.current += 1;
    source.current?.stop();
    source.current = null;
    setPlaying(undefined);
  }

  async function playClip(take: Take, event?: FillerEvent) {
    const audio = take.audio;
    if (!audio) return;
    const alreadyPlaying = playing === (event ?? take);
    stopClip();
    stopSpeech();
    if (alreadyPlaying) return;
    const id = playbackId.current;
    try {
      const player = context.current ??= new AudioContext();
      await player.resume();
      const bytes = await loadTakeAudio(audio);
      if (id !== playbackId.current) return;
      const clip = await player.decodeAudioData(bytes.slice(0));
      if (id !== playbackId.current) return;
      const start = event ? Math.max(0, event.startMs / 1000 - 0.18) : 0;
      const end = event ? Math.min(clip.duration, event.endMs / 1000 + 0.25) : clip.duration;
      if (end <= start) throw new Error("Clip offset is outside the recording");
      const node = player.createBufferSource();
      node.buffer = clip;
      node.connect(player.destination);
      node.onended = () => {
        if (id !== playbackId.current) return;
        source.current = null;
        setPlaying(undefined);
      };
      node.start(0, start, end - start);
      source.current = node;
      setPlaying(event ?? take);
    } catch {
      if (id === playbackId.current) setPlaybackError("That clip couldn't play. Try it again.");
    }
  }


  return { playing, playbackError, playClip, stopClip };
}
