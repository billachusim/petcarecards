import { useCallback, useEffect, useRef, useState } from "react";

/** Minimal typing for the browser Web Speech API (Chrome, Edge, Safari). */
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<
    ArrayLike<{ transcript: string }> & { isFinal: boolean }
  >;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

function getCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export interface SpeechRecognitionState {
  supported: boolean;
  listening: boolean;
  finalTranscript: string;
  interimTranscript: string;
  error?: string | undefined;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Wraps the device's own dictation. Audio never leaves the device on this path.
 */
export function useSpeechRecognition(): SpeechRecognitionState {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string>();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const wantsToListen = useRef(false);

  useEffect(() => {
    setSupported(Boolean(getCtor()));
    return () => {
      wantsToListen.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    setError(undefined);
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) continue;
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          setFinalTranscript((current) => `${current} ${text}`.trim());
        } else {
          interim += text;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      const code = event.error ?? "";
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("Microphone access is blocked. Allow it in your browser settings to speak.");
        wantsToListen.current = false;
      } else if (code === "no-speech") {
        setError("We didn't hear anything. Try speaking a little closer to the microphone.");
      } else if (code !== "aborted") {
        setError("Dictation stopped unexpectedly. You can try again or type the details.");
      }
    };

    recognition.onend = () => {
      // Chrome ends the session after a pause; restart while the user is still recording.
      if (wantsToListen.current) {
        try {
          recognition.start();
          return;
        } catch {
          /* fall through to stopped */
        }
      }
      setListening(false);
    };

    recognitionRef.current = recognition;
    wantsToListen.current = true;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("We couldn't start the microphone. Please try again.");
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    wantsToListen.current = false;
    recognitionRef.current?.stop();
    setListening(false);
    setInterimTranscript((interim) => {
      if (interim.trim()) setFinalTranscript((current) => `${current} ${interim}`.trim());
      return "";
    });
  }, []);

  const reset = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
    setError(undefined);
  }, []);

  return { supported, listening, finalTranscript, interimTranscript, error, start, stop, reset };
}
