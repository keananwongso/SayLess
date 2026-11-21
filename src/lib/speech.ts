export function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  const localVoice = window.speechSynthesis.getVoices().find((voice) => voice.localService && voice.lang === "en-US");
  if (localVoice) utterance.voice = localVoice;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
