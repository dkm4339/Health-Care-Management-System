import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-800">Smart Health Care</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/doctors" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Doctors
            </Link>
            <Link href="/appointment-booking" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Book Appointment
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/doctors" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Doctors
              </Link>
              <Link href="/appointment-booking" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Book Appointment
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <div className="border-t pt-3 mt-3">
                <Link href="/login" className="block px-3 py-2 text-blue-600 font-medium">
                  Login
                </Link>
                <Link href="/login" className="block px-3 py-2">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}