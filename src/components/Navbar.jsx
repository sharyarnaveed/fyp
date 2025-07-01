import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
const options=[
  {id:1,name:"Home",link:"/"},
  {id:1,name:"About Us",link:"/aboutus"},
  {id:1,name:"Contact Us",link:"/contactus"},
  {id:1,name:"Privacy Policy",link:"/privacypolicy"},

]

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
           alt="logo"
           />
            </div>
        

         
          <div className="hidden md:flex items-center  border-2 w-[55%] py-3 justify-around rounded-4xl bg-[#E2E0C8] border-[#A6B493] drop-shadow-lg ">
          {
            options.map((option)=>
            {
      return (
        <Link
          key={option.id}
          href={`${option.link}`}
          className="text-[#4E635E] hover:text-[var(--color-muted-green)] transition-colors text-[1.1rem]"
        >
          {option.name}
        </Link>
      )
            })
          }
        
          </div>

          {/* Log In Button */}
          <button className="bg-[var(--color-light-beige)] text-gray-700 px-6 py-2 rounded-md hover:bg-[var(--color-sage-green)] hover:text-[var(--color-light-beige)] text-[1rem] drop-shadow-lg cursor-pointer ">
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
      
    </div>
  )
}

export default Navbar