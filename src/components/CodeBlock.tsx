
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CodeExample } from '@/data/tutorials';

interface CodeBlockProps {
  code: CodeExample;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  const [activeTab, setActiveTab] = useState<'uikit' | 'swiftui'>('uikit');

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'uikit' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('uikit')}
            className="text-xs"
          >
            UIKit
          </Button>
          <Button 
            variant={activeTab === 'swiftui' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('swiftui')}
            className="text-xs"
          >
            SwiftUI
          </Button>
        </div>
      </div>
      <div className="code-content">
        <pre className="text-sm">
          <code>{activeTab === 'uikit' ? code.uikit : code.swiftui}</code>
        </pre>
      </div>
      <div className="bg-muted p-4 border-t border-border">
        <h4 className="text-sm font-medium mb-2">Explanation</h4>
        <p className="text-sm text-muted-foreground">{code.explanation}</p>
      </div>
    </div>
  );
};

export default CodeBlock;
