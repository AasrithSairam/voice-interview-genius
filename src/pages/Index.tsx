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
  "What is your understanding of agile methodologies?",
  "How do you approach testing and quality assurance?",
  "Describe your experience with version control systems.",
  "How do you handle technical debt?",
  "What's your approach to code reviews?",
];

const ADVANCED_IT_QUESTIONS = [
  "Explain your approach to writing maintainable code.",
  "How do you ensure code quality in your projects?",
  "Describe your experience with cloud infrastructure.",
  "How do you approach system design for scalable applications?",
  "What CI/CD practices have you implemented?",
  "How do you handle database optimization?",
  "Explain your experience with microservices.",
  "How do you approach API security?",
  "Describe your experience with containerization.",
  "What monitoring and logging practices do you follow?",
];

const TECH_LEADERSHIP_QUESTIONS = [
  "How do you mentor junior developers?",
  "Describe how you've led a technical project.",
  "How do you balance technical debt with new features?",
  "Tell me about a difficult technical decision you made.",
  "How do you promote knowledge sharing?",
  "How do you handle conflicts in a team?",
  "Describe your approach to technical planning.",
  "How do you ensure team productivity?",
  "What's your approach to technical interviews?",
  "How do you handle project deadlines?",
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
  const [questionSet, setQuestionSet] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const { toast } = useToast();
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('google_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }

    if (window.speechSynthesis) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
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

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const answer = event.results[0][0].transcript;
        toast({
          title: "Your Answer",
          description: answer,
        });
        
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestion] = answer;
        setUserAnswers(updatedAnswers);
        
        const score = Math.floor(Math.random() * 31) + 70;
        const updatedScores = [...scores];
        updatedScores[currentQuestion] = score;
        setScores(updatedScores);
        
        stopListening();
        
        if (currentQuestion < questionSet.length - 1) {
          setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            speakQuestion(questionSet[currentQuestion + 1]);
          }, 2000);
        } else {
          const avgScore = updatedScores.reduce((sum, score) => sum + score, 0) / updatedScores.length;
          setTotalScore(Math.round(avgScore));
          
          setTimeout(() => {
            speakQuestion(`Thank you for completing the interview! Your overall score is ${Math.round(avgScore)} out of 100.`);
            setInterviewComplete(true);
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
  }, [apiKey, currentQuestion, questionSet, scores, userAnswers]);

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
    
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (interviewStarted && text !== "Thank you for completing the interview!") {
        startListening();
      }
    };
    synthesisRef.current.speak(utterance);
  };

  const startInterview = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScores([]);
    setInterviewComplete(false);
    
    const allQuestions = [
      ...IT_QUESTIONS,
      ...ADVANCED_IT_QUESTIONS,
      ...TECH_LEADERSHIP_QUESTIONS,
    ];
    
    const shuffledQuestions = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    setQuestionSet(shuffledQuestions);
    setInterviewStarted(true);
    speakQuestion("Welcome to the Source Coders AI Interview. " + shuffledQuestions[0]);
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
    setInterviewComplete(false);
    setUserAnswers([]);
    setScores([]);
    setQuestionSet([]);
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
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
            <Card className="glass-panel p-6 space-y-6 transform transition-all duration-300 hover:shadow-xl">
              <AIAvatar isSpeaking={isSpeaking} />
              <VoiceVisualizer isListening={isListening} />
              
              <div className="space-y-4">
                <p className="text-lg font-medium text-center">
                  {interviewStarted ? questionSet[currentQuestion] : 
                   interviewComplete ? "Interview Complete!" : "Ready to start your interview?"}
                </p>
                
                {interviewComplete && (
                  <div className="mt-4 bg-gradient-to-r from-purple-100 to-indigo-100 p-5 rounded-lg shadow-inner">
                    <h3 className="text-xl font-bold text-center text-purple-800 mb-4">Interview Results</h3>
                    <div className="space-y-4">
                      {userAnswers.map((answer, index) => (
                        <div key={index} className="mb-3 p-3 bg-white/50 rounded-lg">
                          <p className="font-medium text-indigo-800">Question {index + 1}: {questionSet[index]}</p>
                          <p className="text-gray-700 mt-1">{answer}</p>
                          <div className="mt-2 flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                                style={{ width: `${scores[index]}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-indigo-800">{scores[index]}%</span>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4 border-t border-purple-200">
                        <p className="text-2xl font-bold text-purple-800">
                          Overall Score: {totalScore}%
                        </p>
                        <p className="text-gray-600 mt-2">
                          {totalScore >= 90 ? "Excellent! You're a perfect candidate." :
                           totalScore >= 80 ? "Great job! You performed very well." :
                           totalScore >= 70 ? "Good effort! You have potential." :
                           "Keep practicing to improve your interview skills."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center gap-3">
                  {!interviewStarted ? (
                    <Button
                      onClick={startInterview}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Start Interview
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        className={isListening 
                          ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600" 
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"}
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
                        className="border-purple-300 hover:bg-purple-50"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </>
                  )}
                </div>
                
                {interviewStarted && !interviewComplete && (
                  <div className="mt-4 bg-indigo-50 p-3 rounded-md border border-indigo-100 shadow-inner">
                    <p className="text-sm text-indigo-800 font-medium">
                      Question {currentQuestion + 1} of {questionSet.length}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                        style={{ width: `${((currentQuestion + 1) / questionSet.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-indigo-600 mt-2">
                      {isListening ? "Listening to your answer..." : isSpeaking ? "AI is speaking..." : "Click 'Answer Question' to respond"}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-800">Our Team</h2>
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
