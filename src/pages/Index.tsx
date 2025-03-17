
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AIAvatar from '@/components/AIAvatar';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import { Mic, MicOff, RefreshCw, Info } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import ApiKeyInput from '@/components/ApiKeyInput';

// Question sets for different topics
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

/**
 * Evaluates the quality of an answer based on multiple factors
 * @param answer The candidate's answer to evaluate
 * @param question The original question that was asked
 * @returns A score between 0-100
 */
const evaluateAnswer = (answer: string, question: string): number => {
  // Base score starts at 50
  let score = 50;
  
  // 1. Length evaluation - answers should be comprehensive but not too short
  const wordCount = answer.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 5) {
    // Very short answers are penalized heavily
    score -= 30;
  } else if (wordCount < 15) {
    // Short answers get a smaller penalty
    score -= 15;
  } else if (wordCount >= 30 && wordCount < 100) {
    // Good length answers get a bonus
    score += 10;
  } else if (wordCount >= 100) {
    // Very long answers get a small bonus, but less than concise ones
    score += 5;
  }
  
  // 2. Grammar and language evaluation (basic)
  const grammarIssues = [
    // Common grammar issues to check
    { pattern: /\b(i|Im)\b(?![a-z'])/gi, penalty: 2 }, // Not capitalizing "I"
    { pattern: /\b(dont|cant|wont|didnt|couldnt|wouldnt|shouldnt)\b/gi, penalty: 2 }, // Missing apostrophes
    { pattern: /\s[,.?!]/g, penalty: 1 }, // Space before punctuation
    { pattern: /\b(there|their|they're|your|you're|its|it's|to|too|two)\b/gi, penalty: 0 }, // Common confusions (no penalty, just flagged)
    { pattern: /\b(is|was|were|am|are)\b\s\1\b/gi, penalty: 3 }, // Repeated words
    { pattern: /[,.!?][A-Za-z]/g, penalty: 2 }, // No space after punctuation
  ];
  
  let grammarScore = 15; // Max grammar score
  
  grammarIssues.forEach(issue => {
    const matches = (answer.match(issue.pattern) || []).length;
    grammarScore -= matches * issue.penalty;
  });
  
  // Ensure grammar score doesn't go negative
  grammarScore = Math.max(0, grammarScore);
  score += grammarScore;
  
  // 3. Relevance to question (basic implementation)
  // Extract keywords from the question (simplified approach)
  const questionWords = question.toLowerCase()
    .replace(/[.,?!;:(){}[\]]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !['what', 'when', 'where', 'which', 'that', 'with', 'your'].includes(word));
  
  // Check if answer contains keywords from question
  let keywordMatches = 0;
  questionWords.forEach(keyword => {
    if (answer.toLowerCase().includes(keyword)) {
      keywordMatches++;
    }
  });
  
  // Calculate relevance score
  const relevanceScore = Math.min(20, Math.round((keywordMatches / Math.max(1, questionWords.length)) * 20));
  score += relevanceScore;
  
  // 4. Structure and completeness (basic heuristics)
  // Check if answer has some structure (multiple sentences)
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount >= 3) {
    score += 5;
  }
  
  // Bonus for beginning with a clear statement or acknowledgment
  if (/^(Yes|No|I|In my|My|The|When|As a|From|If|I've|I'd|I'll|I'm|This|That)/i.test(answer.trim())) {
    score += 5;
  }
  
  // 5. Technical words/jargon appropriate to IT interviews (if relevant)
  const techTerms = [
    'code', 'develop', 'software', 'program', 'application', 'app', 'system', 'data', 'cloud',
    'algorithm', 'function', 'method', 'class', 'object', 'interface', 'api', 'database', 'sql',
    'react', 'angular', 'vue', 'javascript', 'typescript', 'java', 'python', 'c#', 'html', 'css',
    'server', 'client', 'frontend', 'backend', 'full-stack', 'agile', 'scrum', 'kanban', 'git',
    'devops', 'ci/cd', 'test', 'debug', 'deploy', 'architecture', 'design', 'pattern', 'security'
  ];
  
  let techTermCount = 0;
  techTerms.forEach(term => {
    const regex = new RegExp('\\b' + term + '\\b', 'i');
    if (regex.test(answer)) {
      techTermCount++;
    }
  });
  
  // Add bonus for appropriate technical language (up to 5 points)
  score += Math.min(5, techTermCount);
  
  // Ensure final score is within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
};

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
  const welcomeSpokenRef = useRef(false);

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
        
        // Use the improved scoring algorithm instead of random scores
        const score = evaluateAnswer(answer, questionSet[currentQuestion]);
        const updatedScores = [...scores];
        updatedScores[currentQuestion] = score;
        setScores(updatedScores);
        
        stopListening();
        
        if (currentQuestion < questionSet.length - 1) {
          setTimeout(() => {
            const nextQuestionIndex = currentQuestion + 1;
            setCurrentQuestion(nextQuestionIndex);
            speakQuestion(questionSet[nextQuestionIndex]);
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
      
      // Important: Stop recognition when it ends to prevent it from taking the next question as an answer
      recognitionRef.current.onend = () => {
        setIsListening(false);
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
        // Reset the recognition instance to clear any previous state
        recognitionRef.current.abort();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
            setIsListening(true);
          }
        }, 100);
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
      // Only auto-start listening if this is a question during an active interview
      if (interviewStarted && !text.includes("Thank you for completing the interview")) {
        startListening();
      }
    };
    synthesisRef.current.speak(utterance);
  };

  const startInterview = () => {
    // Reset all state for a fresh interview
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScores([]);
    setInterviewComplete(false);
    welcomeSpokenRef.current = false;
    
    // Randomize and select questions from all categories
    const allQuestions = [
      ...IT_QUESTIONS,
      ...ADVANCED_IT_QUESTIONS,
      ...TECH_LEADERSHIP_QUESTIONS,
    ];
    
    // Properly shuffle the questions to ensure randomness
    const shuffledQuestions = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    setQuestionSet(shuffledQuestions);
    setInterviewStarted(true);
    
    // Wait a moment before speaking to ensure state is updated
    setTimeout(() => {
      speakQuestion("Welcome to the Source Coders AI Interview. " + shuffledQuestions[0]);
    }, 300);
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
    welcomeSpokenRef.current = false;
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    localStorage.setItem('google_api_key', key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Source Coders AI Interview
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Experience our innovative AI-powered interview system. Speak your answers naturally, and our AI will guide you through the process.
          </p>
          <Link to="/about" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <Info className="h-4 w-4 mr-1" /> About Our Team
          </Link>
        </header>

        {!apiKey && (
          <div className="max-w-md mx-auto">
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        )}

        {apiKey && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <Card className="glass-panel p-6 space-y-6 transform transition-all duration-300 hover:shadow-xl md:col-span-7">
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
                                className={`h-2.5 rounded-full ${
                                  scores[index] >= 90 ? 'bg-green-500' : 
                                  scores[index] >= 70 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 
                                  scores[index] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${scores[index]}%` }}
                              ></div>
                            </div>
                            <span className={`ml-2 text-sm font-medium ${
                              scores[index] >= 90 ? 'text-green-700' : 
                              scores[index] >= 70 ? 'text-indigo-800' : 
                              scores[index] >= 50 ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {scores[index]}%
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4 border-t border-purple-200">
                        <p className={`text-2xl font-bold ${
                          totalScore >= 90 ? 'text-green-700' : 
                          totalScore >= 70 ? 'text-purple-800' : 
                          totalScore >= 50 ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          Overall Score: {totalScore}%
                        </p>
                        <p className="text-gray-600 mt-2">
                          {totalScore >= 90 ? "Excellent! You're a perfect candidate." :
                           totalScore >= 80 ? "Great job! You performed very well." :
                           totalScore >= 70 ? "Good effort! You have potential." :
                           totalScore >= 50 ? "There's room for improvement in your responses." :
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

            {/* Design elements to replace the team section */}
            <div className="space-y-6 md:col-span-5">
              <div className="glass-panel p-6 rounded-xl border border-white/20 h-full flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-indigo-400 rounded-full opacity-20 blur-xl"></div>
                    <h2 className="text-2xl font-semibold text-center text-indigo-800 relative z-10">Interview Tips</h2>
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="team-card p-4">
                      <h3 className="text-lg font-medium mb-2 text-purple-800">Speak Clearly</h3>
                      <p className="text-sm text-gray-600">Articulate your thoughts at a moderate pace. This helps our AI understand your responses better.</p>
                    </div>

                    <div className="team-card p-4 pulse">
                      <h3 className="text-lg font-medium mb-2 text-purple-800">Be Concise</h3>
                      <p className="text-sm text-gray-600">While detailed answers are good, try to stay focused on addressing the specific question asked.</p>
                    </div>

                    <div className="team-card p-4">
                      <h3 className="text-lg font-medium mb-2 text-purple-800">Use Examples</h3>
                      <p className="text-sm text-gray-600">Support your answers with relevant examples from your experience to make your responses more compelling.</p>
                    </div>
                    
                    <div className="team-card p-4 floating">
                      <h3 className="text-lg font-medium mb-2 text-purple-800">Structure Your Answers</h3>
                      <p className="text-sm text-gray-600">For complex questions, use a framework like STAR (Situation, Task, Action, Result) to organize your thoughts.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-lg">
                  <p className="text-sm text-center text-indigo-900 font-medium">
                    Our AI evaluates your responses based on relevance, clarity, detail, and technical accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
