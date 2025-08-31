import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer text-text-secondary py-6 border-t border-border-color">
      <div className="container mx-auto px-4">
        <div className="footer-content flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="footer-info text-center md:text-left">
            <p className="text-sm">© {new Date().getFullYear()} FancyFam. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <ul className="flex space-x-4 items-center">
              <li>
                <a href="#" className="text-sm hover:text-theme-primary transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-theme-primary transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/google/genai-frontend-reimagine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-theme-primary transition-colors flex items-center"
                >
                  <Github className="h-4 w-4 mr-1" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;