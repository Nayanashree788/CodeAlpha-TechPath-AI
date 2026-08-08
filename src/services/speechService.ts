export interface SpeechServiceListener {
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  onStart: () => void;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  static startListening(listeners: SpeechServiceListener): boolean {
    if (!SpeechService.isSupported()) {
      listeners.onError('Speech recognition is not supported in this browser.');
      return false;
    }

    try {
      if (SpeechService.recognition) {
        SpeechService.stopListening();
      }

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false; // Turn-based listening
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        SpeechService.isListening = true;
        listeners.onStart();
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        listeners.onTranscript(text, Boolean(finalTranscript));
      };

      recognition.onerror = (event: any) => {
        SpeechService.isListening = false;
        listeners.onError(event.error || 'Speech recognition error occurred');
      };

      recognition.onend = () => {
        SpeechService.isListening = false;
        listeners.onEnd();
      };

      recognition.start();
      SpeechService.recognition = recognition;
      return true;
    } catch (err: any) {
      listeners.onError(err.message || 'Failed to initialize speech recognition');
      return false;
    }
  }

  static stopListening(): void {
    if (SpeechService.recognition) {
      try {
        SpeechService.recognition.stop();
      } catch (e) {
        // ignore
      }
      SpeechService.recognition = null;
    }
    SpeechService.isListening = false;
  }

  static getIsListening(): boolean {
    return SpeechService.isListening;
  }
}
