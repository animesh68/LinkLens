import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, XCircle, Download, ExternalLink, Calendar, Globe } from 'lucide-react';
import { SecurityAnalysis } from '../types';

interface SecurityReportProps {
  analysis: SecurityAnalysis;
}

const SecurityReport: React.FC<SecurityReportProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case 'safe':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case 'dangerous':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400`;
    }
  };

  const exportReport = () => {
    const reportData = {
      url: analysis.url,
      timestamp: analysis.timestamp,
      safetyScore: analysis.safetyScore,
      status: analysis.status,
      ssl: analysis.ssl,
      threats: analysis.threats,
      aiAnalysis: analysis.aiAnalysis,
      recommendations: analysis.recommendations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linklens-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="relative">
              <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 opacity-20 blur-sm rounded-full"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security Analysis Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scanned on {analysis.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Globe className="h-5 w-5 text-gray-400" />
            <a 
              href={analysis.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
            >
              {analysis.url}
            </a>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-3">
            <span className={getStatusBadge(analysis.status)}>
              {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Safety Score</h4>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getScoreBgColor(analysis.safetyScore)} flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">{analysis.safetyScore}</span>
              </div>
            </div>
          </div>
          <div>
            <p className={`text-3xl font-bold ${getScoreColor(analysis.safetyScore)}`}>
              {analysis.safetyScore}/100
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {analysis.safetyScore >= 80 ? 'Excellent Security' :
               analysis.safetyScore >= 60 ? 'Good Security' :
               analysis.safetyScore >= 40 ? 'Fair Security' :
               'Poor Security'}
            </p>
          </div>
        </div>
      </div>

      {/* Security Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SSL Certificate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">SSL Certificate</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <div className="flex items-center space-x-2">
                {analysis.ssl.valid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={analysis.ssl.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {analysis.ssl.valid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Issuer</span>
              <span className="text-gray-900 dark:text-white">{analysis.ssl.issuer}</span>
            </div>
            {analysis.ssl.expires && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expires</span>
                <span className="text-gray-900 dark:text-white">
                  {analysis.ssl.expires.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Threat Detection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Threat Detection</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Phishing</span>
              <div className="flex items-center space-x-2">
                {analysis.threats.phishing ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <span className={analysis.threats.phishing ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                  {analysis.threats.phishing ? 'Detected' : 'Clean'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Malware</span>
              <div className="flex items-center space-x-2">
                {analysis.threats.malware ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <span className={analysis.threats.malware ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                  {analysis.threats.malware ? 'Detected' : 'Clean'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Suspicious Activity</span>
              <div className="flex items-center space-x-2">
                {analysis.threats.suspicious ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <span className={analysis.threats.suspicious ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>
                  {analysis.threats.suspicious ? 'Found' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Security Analysis</h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.aiAnalysis}
        </p>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Recommendations</h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecurityReport;