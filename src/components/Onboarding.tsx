import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { onboardingQuestions } from '../data/quiz';
import type { OnboardingData, QuizAnswer } from '../types';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | number>('');

  const currentQuestion = onboardingQuestions[currentStep];
  const isLastStep = currentStep === onboardingQuestions.length - 1;
  const progress = ((currentStep + 1) / onboardingQuestions.length) * 100;

  const handleNext = () => {
    // Save current answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: currentAnswer
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    if (isLastStep) {
      // Complete onboarding
      const onboardingData: OnboardingData = {
        answers: updatedAnswers,
        recommendedProgram: '',
        estimatedLevel: 'beginner'
      };
      onComplete(onboardingData);
    } else {
      // Move to next question
      setCurrentStep(prev => prev + 1);
      
      // Load existing answer if returning to this question
      const existingAnswer = updatedAnswers.find(a => a.questionId === onboardingQuestions[currentStep + 1]?.id);
      setCurrentAnswer(existingAnswer?.answer || '');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      
      // Load existing answer
      const existingAnswer = answers.find(a => a.questionId === onboardingQuestions[currentStep - 1].id);
      setCurrentAnswer(existingAnswer?.answer || '');
    }
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    
    return currentAnswer !== '' && currentAnswer !== 0;
  };

  const handleAnswerChange = (value: string | string[] | number) => {
    setCurrentAnswer(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Pergunta {currentStep + 1} de {onboardingQuestions.length}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="card animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {/* Input field */}
            {currentQuestion.type === 'input' && (
              <input
                type="text"
                value={currentAnswer as string}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="input-field text-lg"
                placeholder="Digite sua resposta..."
                autoFocus
              />
            )}

            {/* Single choice */}
            {currentQuestion.type === 'single' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerChange(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      currentAnswer === option
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500 bg-white dark:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {currentAnswer === option && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multiple choice */}
            {currentQuestion.type === 'multiple' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                        if (isSelected) {
                          handleAnswerChange(current.filter(item => item !== option));
                        } else {
                          handleAnswerChange([...current, option]);
                        }
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500 bg-white dark:bg-dark-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Range input */}
            {currentQuestion.type === 'range' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{currentQuestion.min}kg</span>
                  <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {currentAnswer || currentQuestion.min}kg
                  </span>
                  <span>{currentQuestion.max}kg</span>
                </div>
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  step="1"
                  value={currentAnswer as number || currentQuestion.min}
                  onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceed()
                  ? 'btn-primary'
                  : 'bg-gray-300 dark:bg-dark-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{isLastStep ? 'Finalizar' : 'Próximo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
