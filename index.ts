export interface SecurityAnalysis {
  id: string;
  url: string;
  timestamp: Date;
  safetyScore: number;
  status: 'safe' | 'warning' | 'dangerous' | 'unknown';
  ssl: {
    valid: boolean;
    expires: Date | null;
    issuer: string;
  };
  threats: {
    phishing: boolean;
    malware: boolean;
    suspicious: boolean;
  };
  aiAnalysis: string;
  recommendations: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  scanHistory: SecurityAnalysis[];
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}