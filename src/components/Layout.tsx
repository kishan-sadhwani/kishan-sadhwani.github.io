
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-ios-blue">
            UIKit to SwiftUI
          </Link>
          <nav className="space-x-6">
            <Link to="/" className="text-gray-600 hover:text-ios-blue">
              Home
            </Link>
            <Link to="/tutorial/intro" className="text-gray-600 hover:text-ios-blue">
              Tutorials
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} UIKit to SwiftUI Bridge Builder</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
