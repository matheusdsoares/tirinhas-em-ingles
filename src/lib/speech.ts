const PREFERRED_MALE_VOICE_NAMES = [
  "david",
  "guy",
  "mark",
  "christopher",
  "james",
  "thomas",
  "matthew",
  "eric",
  "aaron",
  "andrew",
  "brian"
];

function getAmericanEnglishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const americanVoices = voices.filter((voice) =>
    voice.lang.toLowerCase() === "en-us" ||
    voice.lang.toLowerCase().startsWith("en-us-")
  );

  if (americanVoices.length === 0) return undefined;

  // Prefer voices commonly named as male voices on Windows and other platforms.
  const preferredMaleVoice = americanVoices.find((voice) => {
    const name = voice.name.toLowerCase();
    return PREFERRED_MALE_VOICE_NAMES.some((preferredName) =>
      name.includes(preferredName)
    );
  });

  return preferredMaleVoice ?? americanVoices[0];
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.pitch = 1;

  const americanVoice = getAmericanEnglishVoice();
  if (americanVoice) {
    utterance.voice = americanVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
