import Link from "next/link";

const Footer = () => {
  const options = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "About Us", link: "/aboutus" },
    { id: 3, name: "Contact Us", link: "/contactus" },
    { id: 4, name: "Privacy Policy", link: "/privacypolicy" },
  ];

  return (
    <footer className="px-4 pb-10 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl rounded-[28px] border border-[#7BBBFF]/30 bg-[#F2FDFF]/85 p-6 shadow-[0_24px_60px_-38px_rgba(10,15,30,0.45)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div className="text-center md:text-left">
            <img src="/footerlogo.png" alt="Prepzy" className="mx-auto mb-3 h-auto w-24 transition-transform hover:scale-105 md:mx-0" />
            <p className="mb-1 text-sm text-[#35557c]">Copyright © 2025</p>
            <p className="text-base font-medium text-[#0A0F1E]">Smarter Prep Starts Here</p>
          </div>

          <div className="flex flex-col items-center gap-5 md:items-end">
            <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 md:justify-end">
              {options.map((option) => (
                <Link
                  key={option.id}
                  href={option.link}
                  className="relative py-1 text-sm font-medium text-[#284366] transition-colors hover:text-[#6f58d3] sm:text-base"
                >
                  {option.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[#4a78a7]">Follow us:</span>
              <a
                href="https://www.instagram.com/problemstoproducts/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-[#284366] transition-colors hover:bg-[#7BBBFF]/14 hover:text-[#2b5f92]"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-[#7BBBFF]/25 pt-5">
          <p className="text-center text-xs text-[#4a78a7] sm:text-sm">
            Prepzy - AI-Powered Exam Preparation Platform for Pakistani Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
