
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onComplete: () => void;
}

const TutorialQuiz = ({
  question,
  options,
  correctAnswer,
  explanation,
  onComplete
}: QuizProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = selectedOption === correctAnswer;

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
      if (isCorrect) {
        setTimeout(onComplete, 2000);
      }
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border my-6">
      <h3 className="font-semibold text-lg mb-4">Quick Check</h3>
      <p className="mb-4">{question}</p>
      
      <RadioGroup value={selectedOption?.toString()} onValueChange={(value) => setSelectedOption(parseInt(value))}>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
              isSubmitted && index === correctAnswer ? 'bg-green-50' : 
              isSubmitted && index === selectedOption ? 'bg-red-50' : ''
            }`}>
              <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isSubmitted} />
              <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                {option}
              </Label>
              {isSubmitted && index === correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isSubmitted && index === selectedOption && index !== correctAnswer && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </RadioGroup>
      
      {isSubmitted && (
        <Alert className={`mt-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <AlertTitle>{isCorrect ? 'Correct!' : 'Not quite right'}</AlertTitle>
          <AlertDescription>
            {explanation}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-4 flex justify-end">
        {isSubmitted && !isCorrect ? (
          <Button onClick={() => setIsSubmitted(false)} variant="outline">Try Again</Button>
        ) : !isSubmitted ? (
          <Button onClick={handleSubmit} disabled={selectedOption === null}>Submit</Button>
        ) : (
          <Button onClick={onComplete}>Continue</Button>
        )}
      </div>
    </div>
  );
};

export default TutorialQuiz;
