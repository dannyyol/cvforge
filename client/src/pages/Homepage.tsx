import { useNavigate } from 'react-router-dom';
import { 
  Github,
  Code,
  Shield,
  Download,
  Users,
  ArrowRight,
  ExternalLink,
  Star,
  GitFork
} from 'lucide-react';

export default function Homepage() {
  const navigate = useNavigate();

  const handleNavigateToEditor = () => {
    navigate('/editor');
  };

  const features = [
    {
      icon: <Github className="h-6 w-6" />,
      title: "100% Open Source",
      description: "Completely free and open source. View, modify, and contribute to the code.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description: "Your data stays with you. No tracking, no data collection, completely private.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Developer Friendly",
      description: "Built with modern tech stack. Easy to customize and self-host.",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "No Restrictions",
      description: "Export your data anytime. Multiple formats with no premium limitations.",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Github className="h-8 w-8 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">CVforge</span>
              <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-medium shadow-sm animate-pulse">
                Open Source
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="https://github.com/dannyyol/cvforge" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-50 relative group"
              >
                Features
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </a>
            </nav>

            {/* CTA Button */}
            <button
              onClick={handleNavigateToEditor}
              className="relative bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group overflow-hidden"
            >
              <span className="relative z-10">Start Building</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        {/* Bottom Gradient for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Open Source Badge */}
            <a 
              href="https://github.com/dannyyol/cvforge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200/60 rounded-full px-6 py-3 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm overflow-hidden cursor-pointer"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 via-blue-100/30 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              
              {/* Animated Star */}
              <div className="relative z-10">
                <Star className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm" />
                <div className="absolute inset-0 animate-ping">
                  <Star className="h-5 w-5 text-yellow-400 opacity-20" />
                </div>
              </div>
              
              {/* Main Text */}
              <span className="relative z-10 text-sm font-semibold bg-gradient-to-r from-gray-700 via-blue-600 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-300">
                Star CVforge on GitHub
              </span>
              
              {/* Separator */}
              <div className="relative z-10 w-px h-4 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              
              {/* Fork Section */}
              <div className="relative z-10 flex items-center space-x-2 text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                <GitFork className="h-4 w-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" />
                <span className="text-xs font-medium">Fork on GitHub</span>
              </div>
              
              {/* Floating Particles */}
              <div className="absolute top-1 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-1 left-3 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
            </a>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Build Professional Resumes
              <br />
              <span className="text-gray-600">with Open Source Freedom</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Create stunning resumes without compromising your privacy. No subscriptions, no data harvesting, 
              just a powerful tool built by the community, for the community.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={handleNavigateToEditor}
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <span>Create Resume</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="https://github.com/dannyyol/cvforge"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>View Source</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Open Source?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the freedom and transparency that only open source software can provide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="text-gray-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the open source community and create professional resumes without compromising your privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNavigateToEditor}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a
              href="https://github.com/dannyyol/cvforge"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:border-white/50 hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Github className="mr-2 h-5 w-5" />
              View Source
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            100% Free • Open Source • Privacy First
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Github className="h-6 w-6" />
                <span className="text-xl font-bold">CVforge</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Open Source</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                A free, open source CV builder that respects your privacy. 
                Built by the community, for the community.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Project</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://github.com/dannyyol/cvforge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Github className="h-4 w-4" />
                    <span>Repository</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/dannyyol/cvforge/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Issues
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/dannyyol/cvforge/blob/main/CONTRIBUTING.md" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contributing
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://github.com/dannyyol/cvforge/discussions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Discussions
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/dannyyol/cvforge/blob/main/LICENSE" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    AGPL License
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/dannyyol/cvforge/releases" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Releases
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 CVforge
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};