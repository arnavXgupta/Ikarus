// Footer.jsx
import { Mail, Image, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#18191A] text-gray-400 py-4 sm:py-5 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          {/* Links Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <a href="/" className="hover:text-white transition text-sm sm:text-base">About Us</a>
            <a href="/" className="hover:text-white transition text-sm sm:text-base">Contact</a>
            <a href="/" className="hover:text-white transition text-sm sm:text-base">Terms of Service</a>
          </div>
          {/* Icons Row */}
          <div className="flex flex-row justify-center items-center gap-6 sm:gap-8">
            <Mail size={20} className="sm:w-6 sm:h-6" />
            <Image size={20} className="sm:w-6 sm:h-6" />
            <MessageSquare size={20} className="sm:w-6 sm:h-6" />
          </div>
          {/* Copyright */}
          <div className="text-center text-xs sm:text-sm pb-2 px-4">
            © 2025 Ikarus Digital Atelier. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
