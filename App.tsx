import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import UrlAnalyzer from './components/UrlAnalyzer';
import SecurityReport from './components/SecurityReport';
import ScanHistory from './components/ScanHistory';
import { SecurityAnalysis } from './types';

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<SecurityAnalysis | null>(null);

  const handleAnalysisComplete = (analysis: SecurityAnalysis) => {
    setCurrentAnalysis(analysis);
  };

  const handleSelectFromHistory = (analysis: SecurityAnalysis) => {
    setCurrentAnalysis(analysis);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* URL Analyzer */}
                <UrlAnalyzer onAnalysisComplete={handleAnalysisComplete} />
                
                {/* Security Report */}
                {currentAnalysis && (
                  <div className="animate-fadeIn">
                    <SecurityReport analysis={currentAnalysis} />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <ScanHistory onSelectAnalysis={handleSelectFromHistory} />
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                © 2025 LinkLens. Advanced URL Security Analysis Platform.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Powered by AI-driven threat detection and comprehensive security analysis.
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;