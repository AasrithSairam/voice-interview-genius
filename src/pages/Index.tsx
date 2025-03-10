
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AIAvatar from '@/components/AIAvatar';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import TeamMember from '@/components/TeamMember';
import { Mic, MicOff } from 'lucide-react';
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
  const { toast } = useToast();

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  const synthesis = window.speechSynthesis;

  useEffect(() => {
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
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
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      stopListening();
    };

    return () => {
      recognition.abort();
      synthesis.cancel();
    };
  }, [currentQuestion]);

  const startListening = () => {
    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition error:', error);
    }
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  const speakQuestion = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      startListening();
    };
    synthesis.speak(utterance);
  };

  const startInterview = () => {
    speakQuestion("Welcome to the Source Coders AI Interview. " + IT_QUESTIONS[0]);
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

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glass-panel p-6 space-y-6">
            <AIAvatar isSpeaking={isSpeaking} />
            <VoiceVisualizer isListening={isListening} />
            <div className="space-y-4">
              <p className="text-lg font-medium text-center">
                {IT_QUESTIONS[currentQuestion]}
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={isListening ? stopListening : startInterview}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      {currentQuestion === 0 ? "Start Interview" : "Answer Question"}
                    </>
                  )}
                </Button>
              </div>
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
      </div>
    </div>
  );
};

export default Index;
