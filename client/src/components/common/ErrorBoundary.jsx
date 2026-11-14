import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-amber-300 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              🏺
            </div>
            <h2 className="text-xl font-bold font-serif text-gray-900">
              पेज लोड करने में समस्या हुई
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              कृपया पेज को रिफ्रेश करें या नीचे दिए गए बटन पर क्लिक करें।
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#1F4D36] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                रिफ्रेश करें (Reload Page)
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                होम पेज पर जाएं
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
