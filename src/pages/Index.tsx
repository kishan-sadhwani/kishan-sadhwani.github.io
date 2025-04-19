
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <header className="bg-gradient-to-b from-ios-blue to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              UIKit to SwiftUI Bridge
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Leverage your UIKit knowledge to master SwiftUI with step-by-step tutorials and interactive examples
            </p>
            <Link to="/tutorial/intro">
              <Button className="text-lg px-8 py-6 rounded-full bg-white text-ios-blue hover:bg-opacity-90">
                Start Learning
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Learn SwiftUI?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Declarative Syntax</h3>
              <p className="text-gray-600">Build interfaces with simple, declarative code that's more readable and maintainable.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Live Previews</h3>
              <p className="text-gray-600">See changes immediately with SwiftUI previews, dramatically speeding up your workflow.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Cross-Platform</h3>
              <p className="text-gray-600">Build for iOS, macOS, watchOS, and tvOS with a shared codebase, reducing duplication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">What You'll Learn</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg flex items-center shadow-sm">
                <div className="bg-ios-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</div>
                <div>
                  <h3 className="font-semibold">SwiftUI Fundamentals</h3>
                  <p className="text-gray-600">Understand the core principles of SwiftUI's declarative approach</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg flex items-center shadow-sm">
                <div className="bg-ios-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</div>
                <div>
                  <h3 className="font-semibold">UIKit to SwiftUI Conversion</h3>
                  <p className="text-gray-600">Learn to map your UIKit knowledge to equivalent SwiftUI concepts</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg flex items-center shadow-sm">
                <div className="bg-ios-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">3</div>
                <div>
                  <h3 className="font-semibold">Layouts & Navigation</h3>
                  <p className="text-gray-600">Master SwiftUI's layout system and navigation patterns</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg flex items-center shadow-sm">
                <div className="bg-ios-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">4</div>
                <div>
                  <h3 className="font-semibold">State Management</h3>
                  <p className="text-gray-600">Learn SwiftUI's powerful state management system</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/tutorial/intro">
                <Button className="px-8 py-6 rounded-lg bg-ios-blue hover:bg-blue-600 text-white text-lg">
                  Begin Your Journey
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p>UIKit to SwiftUI Bridge Builder - An Interactive Learning Resource</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
