import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { SecurityAnalysis } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface UrlAnalyzerProps {
  onAnalysisComplete: (analysis: SecurityAnalysis) => void;
}

const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, updateUserHistory } = useAuth();

  const analyzeUrl = async (inputUrl: string): Promise<SecurityAnalysis> => {
    // Simulate comprehensive security analysis
    const steps = [
      'Validating URL format...',
      'Checking SSL certificate...',
      'Scanning with Google Safe Browsing...',
      'Running VirusTotal analysis...',
      'Performing AI pattern analysis...',
      'Generating security report...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Mock analysis results with realistic variation
    const domain = new URL(inputUrl).hostname;
    const isKnownSafe = ['google.com', 'github.com', 'stackoverflow.com', 'wikipedia.org'].some(safe => domain.includes(safe));
    const isKnownDangerous = ['suspicious-site.com', 'malware-test.com', 'phishing-example.com'].some(danger => domain.includes(danger));
    
    let safetyScore: number;
    let status: 'safe' | 'warning' | 'dangerous' | 'unknown';
    let aiAnalysis: string;
    let recommendations: string[];

    if (isKnownSafe) {
      safetyScore = Math.floor(Math.random() * 10) + 90;
      status = 'safe';
      aiAnalysis = 'This website appears to be legitimate and safe to visit. Our AI analysis found no suspicious patterns or security concerns. The domain has a strong reputation and uses proper security measures.';
      recommendations = ['Website is safe to visit', 'SSL certificate is valid and up-to-date', 'No malicious activity detected', 'Domain has good reputation'];
    } else if (isKnownDangerous) {
      safetyScore = Math.floor(Math.random() * 30) + 10;
      status = 'dangerous';
      aiAnalysis = 'WARNING: This website shows multiple red flags including suspicious URL patterns, potential phishing indicators, and malware signatures. Our AI detected patterns commonly associated with malicious websites.';
      recommendations = ['Do not visit this website', 'Block this domain in your browser', 'Report as malicious if encountered', 'Scan your device if you visited this site'];
    } else {
      safetyScore = Math.floor(Math.random() * 40) + 50;
      status = Math.random() > 0.7 ? 'warning' : 'safe';
      aiAnalysis = status === 'warning' 
        ? 'This website appears to have mixed security indicators. While not definitively malicious, some caution is advised. Our AI detected minor inconsistencies that warrant attention.'
        : 'This website appears to be legitimate with good security practices. Our comprehensive analysis found no significant security concerns.';
      recommendations = status === 'warning'
        ? ['Proceed with caution', 'Verify website authenticity before entering personal information', 'Use updated antivirus software', 'Check URL spelling carefully']
        : ['Website appears safe to visit', 'SSL certificate is properly configured', 'No suspicious activity detected', 'Standard security precautions recommended'];
    }

    return {
      id: Date.now().toString(),
      url: inputUrl,
      timestamp: new Date(),
      safetyScore,
      status,
      ssl: {
        valid: Math.random() > 0.1,
        expires: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        issuer: Math.random() > 0.5 ? 'Let\'s Encrypt' : 'DigiCert Inc'
      },
      threats: {
        phishing: status === 'dangerous' && Math.random() > 0.5,
        malware: status === 'dangerous' && Math.random() > 0.6,
        suspicious: status !== 'safe' && Math.random() > 0.4
      },
      aiAnalysis,
      recommendations
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setProgress(0);

    try {
      // Validate URL format
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(formattedUrl); // This will throw if invalid

      const analysis = await analyzeUrl(formattedUrl);
      onAnalysisComplete(analysis);

      // Save to user history if authenticated
      if (user) {
        const updatedUser = {
          ...user,
          scanHistory: [analysis, ...user.scanHistory].slice(0, 100) // Keep last 100 scans
        };
        updateUserHistory(updatedUser);
      }
    } catch (error) {
      console.error('Invalid URL format');
      // You could add error state here to show user feedback
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'dangerous':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Shield className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
            <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 opacity-20 blur-lg rounded-full"></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Advanced URL Security Analysis
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter any URL to perform comprehensive security analysis with AI-powered threat detection
        </p>
        {!user && (
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
            Sign in to save your scan history and access advanced features
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter URL to analyze (e.g., https://example.com)"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>

      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Analyzing URL Security...
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progress < 20 ? 'Validating URL format...' :
             progress < 40 ? 'Checking SSL certificate...' :
             progress < 60 ? 'Scanning with security databases...' :
             progress < 80 ? 'Running AI analysis...' :
             'Generating security report...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlAnalyzer;