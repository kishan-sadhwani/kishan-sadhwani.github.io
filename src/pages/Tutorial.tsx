
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tutorialSteps } from '@/data/tutorials';
import CodeBlock from '@/components/CodeBlock';
import TutorialQuiz from '@/components/TutorialQuiz';
import TutorialNavigation from '@/components/TutorialNavigation';
import ProgressBar from '@/components/ProgressBar';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const TutorialPage = () => {
  const { stepId = 'intro' } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const [isQuizCompleted, setIsQuizCompleted] = useState(true);
  const [progressPosition, setProgressPosition] = useState(0);
  
  const tutorialStep = tutorialSteps[stepId];
  
  // Calculate total steps and current position
  const totalSteps = Object.keys(tutorialSteps).length;
  
  useEffect(() => {
    // Reset quiz completion when changing steps
    setIsQuizCompleted(!tutorialStep?.quiz);
    
    // Set progress position based on step
    const stepKeys = Object.keys(tutorialSteps);
    const currentPosition = stepKeys.indexOf(stepId) + 1;
    setProgressPosition(currentPosition);
    
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  }, [stepId, tutorialStep]);
  
  const handleNavigate = (newStepId: string) => {
    navigate(`/tutorial/${newStepId}`);
  };
  
  // Handle quiz completion
  const handleQuizComplete = () => {
    setIsQuizCompleted(true);
  };
  
  if (!tutorialStep) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl mb-4">Tutorial step not found</h1>
          <Button onClick={() => navigate('/tutorial/intro')}>Go to Introduction</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <ProgressBar currentStep={progressPosition} totalSteps={totalSteps} />
        
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">{tutorialStep.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{tutorialStep.description}</p>
          
          <div className="prose max-w-none mb-8">
            {tutorialStep.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('##')) {
                // H2 Heading
                return <h2 key={idx} className="text-2xl font-semibold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              } else if (paragraph.startsWith('*')) {
                // Bullet List
                return (
                  <ul key={idx} className="list-disc pl-6 my-4 space-y-2">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace('* ', '')}</li>
                    ))}
                  </ul>
                );
              } else {
                // Regular paragraph
                return <p key={idx} className="mb-4">{paragraph}</p>;
              }
            })}
          </div>
          
          {tutorialStep.codeExamples.map((example, idx) => (
            <CodeBlock key={idx} code={example} />
          ))}
          
          {tutorialStep.quiz && !isQuizCompleted && (
            <TutorialQuiz
              question={tutorialStep.quiz.question}
              options={tutorialStep.quiz.options}
              correctAnswer={tutorialStep.quiz.correctAnswer}
              explanation={tutorialStep.quiz.explanation}
              onComplete={handleQuizComplete}
            />
          )}
          
          <TutorialNavigation
            prevStep={tutorialStep.prevStep}
            nextStep={tutorialStep.nextStep}
            onNavigate={handleNavigate}
            isQuizCompleted={isQuizCompleted}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TutorialPage;
