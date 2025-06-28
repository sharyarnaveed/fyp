import Image from "next/image"

const Navbar = () => {
  return (
 <div>
      {/* Navigation Bar */}
      <nav className=" px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            
           <Image 
           src={"/navimage.png"}
           width={150}
           height={90}
           />
            </div>
        

          {/* Navigation Links */}
          <div className="hidden md:flex items-center  border-2 w-[55%] py-3 justify-around rounded-4xl bg-[#E2E0C8]">
            <a href="#" className="text-[#4E635E] hover:text-gray-200 transition-colors">
              Home
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              About Us
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              Contact Us
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Log In Button */}
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Log In
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Rest of your content */}
      <div>
        sds
      </div>
    </div>
  )
}

export default Navbar