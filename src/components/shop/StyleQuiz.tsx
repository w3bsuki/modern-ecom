"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";

// Types for quiz structure
interface QuizOption {
  id: string;
  label: string;
  image?: string;
  value: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: "single" | "multiple" | "slider";
  options?: QuizOption[];
  minValue?: number;
  maxValue?: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
}

interface StyleCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  matchPercentage: number;
  collectionUrl: string;
}

// Quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    id: "occasion",
    question: "What occasions do you typically dress for?",
    description: "Select all that apply to your lifestyle",
    type: "multiple",
    options: [
      {
        id: "casual",
        label: "Casual & Everyday",
        image: "/images/style-quiz/casual.jpg",
        value: "casual"
      },
      {
        id: "work",
        label: "Work & Office",
        image: "/images/style-quiz/work.jpg",
        value: "work"
      },
      {
        id: "formal",
        label: "Formal Events",
        image: "/images/style-quiz/formal.jpg",
        value: "formal"
      },
      {
        id: "workout",
        label: "Workout & Active",
        image: "/images/style-quiz/workout.jpg",
        value: "workout"
      },
      {
        id: "evening",
        label: "Evening & Night Out",
        image: "/images/style-quiz/evening.jpg",
        value: "evening"
      },
      {
        id: "vacation",
        label: "Travel & Vacation",
        image: "/images/style-quiz/vacation.jpg",
        value: "vacation"
      }
    ]
  },
  {
    id: "style",
    question: "Which style resonates with you the most?",
    description: "Choose the aesthetic that best represents your personal style",
    type: "single",
    options: [
      {
        id: "minimalist",
        label: "Minimalist & Clean",
        image: "/images/style-quiz/minimalist.jpg",
        value: "minimalist"
      },
      {
        id: "vintage",
        label: "Vintage & Retro",
        image: "/images/style-quiz/vintage.jpg",
        value: "vintage"
      },
      {
        id: "streetwear",
        label: "Streetwear & Urban",
        image: "/images/style-quiz/streetwear.jpg",
        value: "streetwear"
      },
      {
        id: "bohemian",
        label: "Bohemian & Free-spirited",
        image: "/images/style-quiz/bohemian.jpg",
        value: "bohemian"
      },
      {
        id: "classic",
        label: "Classic & Timeless",
        image: "/images/style-quiz/classic.jpg",
        value: "classic"
      },
      {
        id: "trendy",
        label: "Trendy & Fashion-forward",
        image: "/images/style-quiz/trendy.jpg",
        value: "trendy"
      }
    ]
  },
  {
    id: "colors",
    question: "What colors do you prefer to wear?",
    description: "Select all colors you enjoy wearing",
    type: "multiple",
    options: [
      {
        id: "neutrals",
        label: "Neutrals (Black, White, Gray)",
        image: "/images/style-quiz/neutrals.jpg",
        value: "neutrals"
      },
      {
        id: "earth",
        label: "Earth Tones (Brown, Beige, Olive)",
        image: "/images/style-quiz/earth.jpg",
        value: "earth"
      },
      {
        id: "pastels",
        label: "Pastels (Soft Pink, Baby Blue, Mint)",
        image: "/images/style-quiz/pastels.jpg",
        value: "pastels"
      },
      {
        id: "bold",
        label: "Bold Colors (Red, Blue, Yellow)",
        image: "/images/style-quiz/bold.jpg",
        value: "bold"
      },
      {
        id: "dark",
        label: "Dark Tones (Navy, Burgundy, Forest Green)",
        image: "/images/style-quiz/dark.jpg",
        value: "dark"
      },
      {
        id: "patterns",
        label: "Patterns & Prints",
        image: "/images/style-quiz/patterns.jpg",
        value: "patterns"
      }
    ]
  },
  {
    id: "fit",
    question: "What type of fit do you prefer?",
    description: "Choose the silhouette that makes you feel most confident",
    type: "single",
    options: [
      {
        id: "slim",
        label: "Slim & Fitted",
        image: "/images/style-quiz/slim.jpg",
        value: "slim"
      },
      {
        id: "regular",
        label: "Regular & Classic",
        image: "/images/style-quiz/regular.jpg",
        value: "regular"
      },
      {
        id: "relaxed",
        label: "Relaxed & Comfortable",
        image: "/images/style-quiz/relaxed.jpg",
        value: "relaxed"
      },
      {
        id: "oversized",
        label: "Oversized & Loose",
        image: "/images/style-quiz/oversized.jpg",
        value: "oversized"
      }
    ]
  },
  {
    id: "price",
    question: "What's your typical budget for clothing items?",
    description: "Select your preferred price range for individual pieces",
    type: "single",
    options: [
      {
        id: "budget",
        label: "Budget-friendly ($20-50)",
        value: "budget"
      },
      {
        id: "mid",
        label: "Mid-range ($50-100)",
        value: "mid"
      },
      {
        id: "premium",
        label: "Premium ($100-200)",
        value: "premium"
      },
      {
        id: "luxury",
        label: "Luxury ($200+)",
        value: "luxury"
      }
    ]
  }
];

// Mock style categories for recommendations
const styleCategories: StyleCategory[] = [
  {
    id: "urban-minimalist",
    name: "Urban Minimalist",
    description: "Clean lines, neutral colors, and versatile pieces that create a sleek, modern wardrobe focused on quality over quantity.",
    image: "/images/style-quiz/urban-minimalist.jpg",
    matchPercentage: 92,
    collectionUrl: "/collections/urban-minimalist"
  },
  {
    id: "casual-chic",
    name: "Casual Chic",
    description: "The perfect balance of comfort and style, featuring elevated basics that can be dressed up or down for any occasion.",
    image: "/images/style-quiz/casual-chic.jpg",
    matchPercentage: 85,
    collectionUrl: "/collections/casual-chic"
  },
  {
    id: "contemporary-classic",
    name: "Contemporary Classic",
    description: "Timeless staples with modern updates that create an enduring, sophisticated style that never goes out of fashion.",
    image: "/images/style-quiz/contemporary-classic.jpg",
    matchPercentage: 78,
    collectionUrl: "/collections/contemporary-classic"
  }
];

// QuizProgress component to show progress
const QuizProgress = ({ currentQuestion, totalQuestions }: { currentQuestion: number; totalQuestions: number }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
        <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

// SingleChoiceQuestion component
const SingleChoiceQuestion = ({ 
  question, 
  selectedOption, 
  setSelectedOption 
}: { 
  question: QuizQuestion; 
  selectedOption: string | null; 
  setSelectedOption: (value: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {question.options?.map((option) => (
          <motion.div
            key={option.id}
            className={cn(
              "border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md",
              selectedOption === option.value ? "ring-2 ring-black" : "ring-1 ring-gray-200"
            )}
            onClick={() => setSelectedOption(option.value)}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.image ? (
              <div className="relative h-40 w-full">
                <Image
                  src={option.image}
                  alt={option.label}
                  fill
                  className="object-cover"
                />
                {selectedOption === option.value && (
                  <div className="absolute top-2 right-2 bg-black rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ) : null}
            
            <div className={cn(
              "p-3 flex items-center",
              selectedOption === option.value ? "bg-black text-white" : "bg-white"
            )}>
              <span className="flex-1 font-medium">{option.label}</span>
              {!option.image && selectedOption === option.value && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// MultipleChoiceQuestion component
const MultipleChoiceQuestion = ({ 
  question, 
  selectedOptions, 
  setSelectedOptions 
}: { 
  question: QuizQuestion; 
  selectedOptions: string[]; 
  setSelectedOptions: (value: string[]) => void;
}) => {
  const toggleOption = (value: string) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {question.options?.map((option) => (
          <motion.div
            key={option.id}
            className={cn(
              "border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md",
              selectedOptions.includes(option.value) ? "ring-2 ring-black" : "ring-1 ring-gray-200"
            )}
            onClick={() => toggleOption(option.value)}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.image ? (
              <div className="relative h-40 w-full">
                <Image
                  src={option.image}
                  alt={option.label}
                  fill
                  className="object-cover"
                />
                {selectedOptions.includes(option.value) && (
                  <div className="absolute top-2 right-2 bg-black rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ) : null}
            
            <div className={cn(
              "p-3 flex items-center",
              selectedOptions.includes(option.value) ? "bg-black text-white" : "bg-white"
            )}>
              <span className="flex-1 font-medium">{option.label}</span>
              {!option.image && selectedOptions.includes(option.value) && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// QuizResults component
const QuizResults = ({ 
  onRestartQuiz,
  emailSubmitted,
  setEmailSubmitted,
}: { 
  onRestartQuiz: () => void;
  emailSubmitted: boolean;
  setEmailSubmitted: (value: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      setEmailSubmitted(true);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Your Style Profile</h3>
        <p className="text-gray-600">
          Based on your answers, we've created a personalized style profile for you. 
          Here are collections that match your preferences.
        </p>
      </div>
      
      {/* Style Categories */}
      <div className="space-y-6">
        {styleCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border rounded-lg overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-black text-white text-sm font-medium px-2 py-1 rounded-full">
                  {category.matchPercentage}% Match
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-bold mb-2">{category.name}</h4>
                <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                <Link href={category.collectionUrl}>
                  <Button className="w-full md:w-auto">
                    Shop This Style
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Email Subscription */}
      {!emailSubmitted ? (
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-medium mb-2">Save Your Style Profile</h4>
          <p className="text-gray-600 mb-4">
            Enter your email to save your results and receive personalized style recommendations.
          </p>
          
          <form onSubmit={handleSubmitEmail} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 text-green-800 rounded-lg p-6 flex items-center"
        >
          <Check className="h-6 w-6 mr-3 text-green-600" />
          <div>
            <h4 className="font-medium">Thanks for subscribing!</h4>
            <p className="text-sm">We've sent your style profile to your email address.</p>
          </div>
        </motion.div>
      )}
      
      {/* Restart Quiz Button */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={onRestartQuiz}
          className="mt-4"
        >
          Restart Quiz
        </Button>
      </div>
    </motion.div>
  );
};

// Main StyleQuiz component
export default function StyleQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Quiz completed
      setIsCompleted(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSingleSelection = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleMultipleSelection = (values: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: values
    }));
  };
  
  const getCurrentSelectedValue = (): string | null => {
    const answer = answers[currentQuestion.id];
    return typeof answer === "string" ? answer : null;
  };
  
  const getCurrentSelectedValues = (): string[] => {
    const answer = answers[currentQuestion.id];
    return Array.isArray(answer) ? answer : [];
  };
  
  const isCurrentQuestionAnswered = (): boolean => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "single") {
      return typeof answer === "string" && answer !== "";
    } else if (currentQuestion.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return false;
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setEmailSubmitted(false);
  };
  
  // Close dialog and reset quiz when dialog is closed
  const handleDialogClose = () => {
    setIsOpen(false);
    // We don't immediately reset the quiz so the closing animation looks good
    // Instead, we'll reset it after a small delay
    setTimeout(() => {
      if (!isOpen) {
        restartQuiz();
      }
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-sm flex items-center gap-1.5 h-8 px-3"
        >
          Find Your Style
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="quiz-questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Style Quiz</DialogTitle>
                <DialogDescription>
                  Discover your perfect style by answering a few questions about your preferences.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6">
                <QuizProgress 
                  currentQuestion={currentQuestionIndex} 
                  totalQuestions={totalQuestions} 
                />
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{currentQuestion.question}</h3>
                  {currentQuestion.description && (
                    <p className="text-gray-600">{currentQuestion.description}</p>
                  )}
                </div>
                
                {/* Question content based on type */}
                {currentQuestion.type === "single" && (
                  <SingleChoiceQuestion
                    question={currentQuestion}
                    selectedOption={getCurrentSelectedValue()}
                    setSelectedOption={handleSingleSelection}
                  />
                )}
                
                {currentQuestion.type === "multiple" && (
                  <MultipleChoiceQuestion
                    question={currentQuestion}
                    selectedOptions={getCurrentSelectedValues()}
                    setSelectedOptions={handleMultipleSelection}
                  />
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!isCurrentQuestionAnswered()}
                    className="flex items-center gap-1"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? "Next" : "See Results"}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizResults 
                onRestartQuiz={restartQuiz}
                emailSubmitted={emailSubmitted}
                setEmailSubmitted={setEmailSubmitted}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 