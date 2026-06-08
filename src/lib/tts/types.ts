export type MandarinVoicePreference = {
  voiceName?: string;
  languageCode: "cmn-CN" | "cmn-TW";
  speed: number;
};

export type SynthesizedAudioResult = {
  audioUrl: string;
  storagePath: string;
  cached: boolean;
  voiceName: string;
};
