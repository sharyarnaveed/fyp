import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const options = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "About Us", link: "/aboutus" },
    { id: 3, name: "Contact Us", link: "/contactus" },
    { id: 4, name: "Privacy Policy", link: "/privacypolicy" },
  ];

  return (
    <div>
      <nav className=" px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Image src={"/navimage.png"} width={150} height={90} alt="logo" />
          </div>

          <div className="hidden md:flex items-center  border-2 w-[55%] py-3 justify-around rounded-4xl bg-[#E2E0C8] border-[#A6B493] drop-shadow-lg ">
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

          {/* Log In Button */}
          <button className="bg-[var(--baige)] text-gray-700 px-6 py-2 rounded-md hover:bg-[var(--olivegreen)] hover:text-[var(--baige)] text-[1rem] drop-shadow-lg cursor-pointer">
            Log In
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
