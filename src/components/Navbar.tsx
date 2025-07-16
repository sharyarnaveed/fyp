"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const options = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "About Us", link: "/aboutus" },
    { id: 3, name: "Contact Us", link: "/contactus" },
    { id: 4, name: "Privacy Policy", link: "/privacypolicy" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <nav className="px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Image src={"/navimage.png"} width={150} height={90} alt="logo" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center border-2 w-[55%] py-3 justify-around rounded-4xl bg-[#E2E0C8] border-[#A6B493] drop-shadow-lg">
            {options.map((option) => {
              return (
                <Link
                  key={option.id}
                  href={`${option.link}`}
                  className="text-[#4E635E] hover:text-[var(--olivegreen)] transition-colors text-[1.1rem]"
                >
                  {option.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Log In Button */}
          <button className="hidden md:block bg-[var(--baige)] text-gray-700 px-6 py-2 rounded-md hover:bg-[var(--olivegreen)] hover:text-[var(--baige)] text-[1rem] drop-shadow-lg cursor-pointer">
            Log In
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={toggleMenu}
          >
            <span className={`block w-6 h-0.5 bg-[var(--baige)] transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[var(--baige)] transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[var(--baige)] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Now appears as dropdown below navbar */}
      <div className={`md:hidden absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="mx-4 border-2 py-4 rounded-2xl bg-[#E2E0C8] border-[#A6B493] drop-shadow-lg space-y-4">
          {options.map((option) => {
            return (
              <Link
                key={option.id}
                href={`${option.link}`}
                className="block text-center text-[#4E635E] hover:text-[var(--olivegreen)] transition-colors text-[1.1rem]"
                onClick={() => setIsMenuOpen(false)}
              >
                {option.name}
              </Link>
            );
          })}
          <div className="text-center">
            <button className="bg-[var(--baige)] text-gray-700 px-6 py-2 rounded-md hover:bg-[var(--olivegreen)] hover:text-[var(--baige)] text-[1rem] drop-shadow-lg cursor-pointer">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;