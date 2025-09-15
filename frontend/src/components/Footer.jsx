// Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 shadow-lg rounded-t-xl fixed bottom-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center justify-center">
        {/* Copyright */}
        <div className="text-gray-700 text-sm text-center mb-2">
          © 2025 QuickBites. All rights reserved.
        </div>

        {/* Optional links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
