
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AIAvatar from '@/components/AIAvatar';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import TeamMember from '@/components/TeamMember';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Mic, MicOff, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const IT_QUESTIONS = [
  "Tell me about your experience with software development.",
  "How do you handle debugging complex issues?",
  "What programming languages are you most comfortable with?",
  "Describe a challenging project you worked on.",
  "How do you stay updated with new technologies?",
];

const TEAM_MEMBERS = [
  {
    name: "Ponguru Aasrith Sairam",
    role: "Lead Developer",
    image: "/placeholder.svg"
  },
  {
    name: "Lalit Chandran",
    role: "Technical Architect",
    image: "/placeholder.svg"
  },
  {
    name: "Ravi Varman",
    role: "Project Manager",
    image: "/placeholder.svg"
  },
  {
    name: "Muhammed Afshan",
    role: "Full Stack Developer",
    image: "/placeholder.svg"
  }
];

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const { toast } = useToast();
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedApiKey = localStorage.getItem('google_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }

    // Initialize speech synthesis
    if (window.speechSynthesis) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      // Clean up speech resources
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const answer = event.results[0][0].transcript;
        toast({
          title: "Your Answer",
          description: answer,
        });
        stopListening();
        
        if (currentQuestion < IT_QUESTIONS.length - 1) {
          setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            speakQuestion(IT_QUESTIONS[currentQuestion + 1]);
          }, 2000);
        } else {
          setTimeout(() => {
            speakQuestion("Thank you for completing the interview!");
            setInterviewStarted(false);
          }, 2000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
        toast({
          title: "Error",
          description: "There was an issue with speech recognition. Please try again.",
          variant: "destructive",
        });
      };
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition. Please try using Chrome.",
        variant: "destructive",
      });
    }
  }, [apiKey, currentQuestion]);

  const startListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakQuestion = (text: string) => {
    if (!synthesisRef.current) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Only auto-start listening when in the middle of the interview
      if (interviewStarted && text !== "Thank you for completing the interview!") {
        startListening();
      }
    };
    synthesisRef.current.speak(utterance);
  };

  const startInterview = () => {
    setCurrentQuestion(0);
    setInterviewStarted(true);
    speakQuestion("Welcome to the Source Coders AI Interview. " + IT_QUESTIONS[0]);
  };

  const resetInterview = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setCurrentQuestion(0);
    setIsListening(false);
    setIsSpeaking(false);
    setInterviewStarted(false);
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Source Coders AI Interview
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience our innovative AI-powered interview system. Speak your answers naturally, and our AI will guide you through the process.
          </p>
        </header>

        {!apiKey && (
          <div className="max-w-md mx-auto">
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        )}

        {apiKey && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-panel p-6 space-y-6">
              <AIAvatar isSpeaking={isSpeaking} />
              <VoiceVisualizer isListening={isListening} />
              <div className="space-y-4">
                <p className="text-lg font-medium text-center">
                  {interviewStarted ? IT_QUESTIONS[currentQuestion] : "Ready to start your interview?"}
                </p>
                <div className="flex justify-center gap-3">
                  {!interviewStarted ? (
                    <Button
                      onClick={startInterview}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Start Interview
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        className={isListening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                        disabled={isSpeaking}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Answer Question
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetInterview}
                        variant="outline"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </>
                  )}
                </div>
                {interviewStarted && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {IT_QUESTIONS.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {isListening ? "Listening to your answer..." : isSpeaking ? "AI is speaking..." : "Click 'Answer Question' to respond"}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6">Our Team</h2>
              <div className="grid grid-cols-2 gap-4">
                {TEAM_MEMBERS.map((member, index) => (
                  <TeamMember key={index} {...member} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
