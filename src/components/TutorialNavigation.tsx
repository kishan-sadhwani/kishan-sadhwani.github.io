
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TutorialNavigationProps {
  prevStep?: string;
  nextStep?: string;
  onNavigate: (stepId: string) => void;
  isQuizCompleted: boolean;
}

const TutorialNavigation = ({
  prevStep,
  nextStep,
  onNavigate,
  isQuizCompleted
}: TutorialNavigationProps) => {
  return (
    <div className="flex justify-between items-center py-6 border-t border-border mt-8">
      {prevStep ? (
        <Button 
          variant="outline" 
          onClick={() => onNavigate(prevStep)}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
      ) : (
        <div></div>
      )}
      
      {nextStep && (
        <Button 
          onClick={() => onNavigate(nextStep)}
          className="flex items-center space-x-2"
          disabled={!isQuizCompleted}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TutorialNavigation;
