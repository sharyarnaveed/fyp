const page = () => {
  return (
    <main className="min-h-screen bg-[#5E7266] flex flex-col">
      {/* Header */}
      <section className="w-full py-8 sm:py-10 md:py-12 text-center bg-[var(--main-green)] px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-bold text-[var(--baige)] mb-2">
          Contact Us
        </h1>
        <p className="text-[var(--baige)] max-w-xl mx-auto text-sm sm:text-base md:text-lg px-2 sm:px-0">
          We&apos;d love to hear from you! Whether you have questions, feedback, partnership inquiries, 
          or just want to say hello, the Preppy team is here to help.
        </p>
      </section>

      <section className="flex flex-col md:flex-row gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-20 py-8 sm:py-12 md:py-16 bg-[var(--lightgreen)] flex-1">
        <div className="flex-1 flex flex-col justify-between gap-6 md:gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[3.5rem] font-regular text-[var(--baige)] mb-3 sm:mb-4">
              We are always ready
              <br />
              to help you and
              <br />
              answer your
              <br />
              questions
            </h2>
            <p className="text-[var(--baige)] mb-6 md:mb-8 text-sm sm:text-base md:text-[1.2rem]">
              We operate remotely with team members. Reach out if you&apos;re a school, 
              teacher, or platform looking to collaborate.
            </p>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-[var(--baige)] text-sm sm:text-base"
            style={{ fontFamily: "var(--font-paragraph)" }}
          >
            <div className="mb-3 sm:mb-0">
              <div className="font-semibold">Email</div>
              <div>support@preppy.com</div>
            </div>
            <div className="mb-3 sm:mb-0">
              <div className="font-semibold">Business & Partnerships</div>
              <div>collab@preppy.com</div>
            </div>
            <div className="mb-3 sm:mb-0">
              <div className="font-semibold">Location</div>
              <div>Preppy HQ – Islamabad, Pakistan</div>
            </div>
            <div className="mb-3 sm:mb-0">
              <div className="font-semibold">Follow Us</div>
              <div className="flex items-center gap-2 mt-1">
                <a href="#" aria-label="Instagram">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md mx-auto mt-6 md:mt-0">
          <form className="bg-[var(--olivegreen)] rounded-xl p-6 sm:p-8 md:p-10 shadow-md flex flex-col gap-3">
            <h3 className="text-xl sm:text-2xl md:text-[2.2rem] font-regular text-[var(--baige)]">
              Get in Touch
            </h3>
            <p
              className="text-[var(--baige)] text-sm sm:text-base mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-paragraph)" }}
            >
              We operate remotely with team members across the country
            </p>
            <input
              type="text"
              placeholder="Full name"
              className="bg-[var(--olivegreen)] px-3 sm:px-4 py-2 outline-none border-b-2 border-[var(--main-green)] focus:border-[#5E7266] text-[#E2E0C8] text-sm sm:text-base"
              required
              style={{ fontFamily: "var(--font-paragraph)" }}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-[var(--olivegreen)] px-3 sm:px-4 py-2 outline-none border-b-2 border-[var(--main-green)] focus:border-[#5E7266] text-[#E2E0C8] text-sm sm:text-base"
              required
              style={{ fontFamily: "var(--font-paragraph)" }}
            />
            <input
              type="text"
              placeholder="Subject"
              className="bg-[var(--olivegreen)] px-3 sm:px-4 py-2 outline-none border-b-2 border-[var(--main-green)] focus:border-[#5E7266] text-[#E2E0C8] text-sm sm:text-base"
              required
              style={{ fontFamily: "var(--font-paragraph)" }}
            />
            <textarea
              placeholder="Message"
              className="bg-[var(--olivegreen)] px-3 sm:px-4 py-2 outline-none border-b-2 border-[var(--main-green)] focus:border-[#5E7266] text-[#E2E0C8] min-h-[100px] sm:min-h-[120px] md:min-h-[140px] text-sm sm:text-base"
              required
              style={{ fontFamily: "var(--font-paragraph)" }}
            />
            <button
              type="submit"
              className="mt-2 w-full sm:w-[50%] md:w-[33%] gap-2 sm:gap-3 bg-[var(--baige)] text-[#5E7266] border border-[var(--main-green)] rounded-full px-3 sm:px-4 py-2 font-regular flex justify-center items-center hover:bg-[#5E7266] hover:text-white transition text-sm sm:text-base md:text-[1.1rem] group"
              style={{ fontFamily: "var(--font-paragraph)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              >
                <path
                  className="stroke-[#4E635E] group-hover:stroke-[var(--baige)]"
                  d="M9.00007 12L20.0001 1M9.00007 12L12.5001 19C12.5439 19.0957 12.6144 19.1769 12.703 19.2338C12.7917 19.2906 12.8948 19.3209 13.0001 19.3209C13.1054 19.3209 13.2085 19.2906 13.2971 19.2338C13.3858 19.1769 13.4562 19.0957 13.5001 19L20.0001 1M9.00007 12L2.00007 8.5C1.90433 8.45613 1.8232 8.38569 1.76632 8.29705C1.70944 8.20842 1.6792 8.10532 1.6792 8C1.6792 7.89468 1.70944 7.79158 1.76632 7.70295C1.8232 7.61431 1.90433 7.54387 2.00007 7.5L20.0001 1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default page;