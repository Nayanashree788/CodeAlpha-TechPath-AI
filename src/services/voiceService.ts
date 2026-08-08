export interface VoiceServiceOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  rate?: number;
  pitch?: number;
  lang?: string;
}

export class VoiceService {
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Cleans text before speaking aloud to strip code blocks, markdown symbols, and bullet syntax.
   */
  static cleanTextForSpeech(text: string): string {
    return text
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#+\s*/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-•*]\s*/g, '')
      .trim();
  }

  static speak(text: string, options: VoiceServiceOptions = {}): void {
    if (!VoiceService.isSupported()) {
      options.onError?.('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any active speech utterance
    VoiceService.stopSpeaking();

    const cleanedText = VoiceService.cleanTextForSpeech(text);
    if (!cleanedText) {
      options.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.lang || 'en-US';

    // Choose preferred voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Female') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira') ||
            v.name.includes('Natural'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (err) => {
      options.onError?.(err);
    };

    window.speechSynthesis.speak(utterance);
  }

  static stopSpeaking(): void {
    if (VoiceService.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  static pause(): void {
    if (VoiceService.isSupported()) {
      window.speechSynthesis.pause();
    }
  }

  static resume(): void {
    if (VoiceService.isSupported()) {
      window.speechSynthesis.resume();
    }
  }
}
