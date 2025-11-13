import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br w-full from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className=" w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4 animate-pulse">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-20 bg-white rounded animate-pulse"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
            <div className="h-1 w-20 bg-white rounded animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-white/90 text-lg mb-6">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, it happens to the best of us!
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Home size={20} />
              Home Page
            </button>
          </div>
        </div>

       

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default NotFound;