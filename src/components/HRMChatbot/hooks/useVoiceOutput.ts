export function useVoiceOutput() {
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };
  return { speak };
}
