import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

/**
 * VoiceRecorder Component
 * 
 * Uses Web Speech API for voice-to-text conversion
 * Supports multiple languages: English, Tamil, Hindi
 * 
 * How it works:
 * 1. Creates SpeechRecognition instance with selected language
 * 2. Starts listening when user clicks mic button
 * 3. Converts speech to text in real-time
 * 4. Returns transcript to parent component
 */

const VoiceRecorder = ({ language, onTranscriptChange, currentTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // Language codes for Web Speech API
  const languageCodes = {
    english: 'en-IN',
    tamil: 'ta-IN',
    hindi: 'hi-IN'
  };

  // Keep ref in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show results as user speaks
    recognition.lang = languageCodes[language] || 'en-IN';
    recognition.maxAlternatives = 1;

    // Handle speech results
    recognition.onresult = (event) => {
      let transcript = '';
      
      // Combine all results
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      // Update parent component with transcript
      onTranscriptChange(transcript);
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Don't stop on no-speech, just continue listening
        console.log('No speech detected, continuing to listen...');
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in browser settings.');
        setIsListening(false);
      } else if (event.error === 'aborted') {
        // Ignore aborted errors
        console.log('Recognition aborted');
      } else {
        setIsListening(false);
      }
    };

    // Handle end of recognition - restart if still listening
    recognition.onend = () => {
      console.log('Recognition ended');
      // If we're still supposed to be listening, restart
      if (isListeningRef.current) {
        console.log('Restarting recognition...');
        try {
          recognition.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscriptChange]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
        <p className="text-red-700 text-sm">
          Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Microphone Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
          }`}
        >
          {isListening ? (
            <MicOff className="w-16 h-16 text-white" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        {isListening ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
            <p className="text-lg font-semibold text-[#2563EB]">
              Listening... Click mic to stop
            </p>
          </div>
        ) : (
          <p className="text-slate-600">
            Click the microphone to start speaking
          </p>
        )}
      </div>

      {/* Transcript Display */}
      {currentTranscript && (
        <div className="bg-blue-50 border-2 border-[#2563EB] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#1F3A5F] mb-2">
            Transcript:
          </p>
          <p className="text-slate-700">
            {currentTranscript}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
