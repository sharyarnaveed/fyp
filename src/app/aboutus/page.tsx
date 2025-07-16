import Image from "next/image";

const Page = () => {
  return (
    <>
      <main className="min-h-screen bg-[#5E7266] flex flex-col relative">
        {/* Header */}
        <section className="w-full flex flex-col justify-center items-center py-8 md:py-12 lg:py-20 text-center bg-[var(--main-green)] z-10 px-4">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-bold text-[var(--baige)] mb-3 md:mb-4"
            style={{ fontFamily: "var(--font-literata)" }}
          >
            About us
          </h1>
          <p
            className="text-[var(--baige)] max-w-3xl w-full text-sm sm:text-base md:text-lg mb-6 md:mb-8 px-2 sm:px-0"
            style={{ fontFamily: "var(--font-paragraph)" }}
          >
            Prepzy is an AI-powered learning platform built to help students
            prepare smarter for competitive exams faster, better
          </p>
        </section>

        <div className="pt-4 md:pt-8 px-4 sm:px-6 md:px-8">
          <section className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--baige)] mb-6 md:mb-8"
              style={{ fontFamily: "var(--font-literata)" }}
            >
              What is Prepzy?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-[var(--baige)]">
              <div className="space-y-3 md:space-y-4">
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ fontFamily: "var(--font-paragraph)" }}
                >
                  Prepzy is your digital exam mentor. Designed specifically for
                  students in Pakistan, Prepzy blends artificial intelligence
                  with a deep understanding of local education needs. Whether
                  you&apos;re preparing for EETA, NET, MDNS, or other
                  competitive exams, Prepzy offers personalized learning tools
                  that make studying efficient, engaging, and effective.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ fontFamily: "var(--font-paragraph)" }}
                >
                  From AI-generated quizzes, smart study plans, and past paper
                  insights to Order- English content support, flashcards, mind
                  maps, and gamified progress tracking, Prepzy gives you
                  everything you need — all in one place.
                </p>
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto pb-8 md:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left side - Image */}
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/about6.png"
                    alt="Student studying with laptop"
                    width={500}
                    height={500}
                    className="w-full h-auto sm:h-[300px] md:h-[350px] object-cover"
                  />
                </div>
              </div>

              {/* Right side - Content */}
              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-[var(--baige)] mb-3 md:mb-4"
                    style={{ fontFamily: "var(--font-literata)" }}
                  >
                    Our Vision
                  </h2>
                  <p
                    className="text-[var(--baige)] text-base sm:text-lg leading-relaxed"
                    style={{ fontFamily: "var(--font-paragraph)" }}
                  >
                    To democratize exam preparation by replacing expensive
                    coaching centers with a smart, students-friendly, and
                    bilingual learning platform, giving every student in
                    Pakistan the chance to succeed, regardless of background or
                    location.
                  </p>
                </div>

                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-[var(--baige)] mb-3 md:mb-4"
                    style={{ fontFamily: "var(--font-literata)" }}
                  >
                    Our Belief
                  </h2>
                  <p
                    className="text-[var(--baige)] text-base sm:text-lg leading-relaxed"
                    style={{ fontFamily: "var(--font-paragraph)" }}
                  >
                    We believe that learning should be smart, not hard. With
                    Prepzy, you&apos;re not alone &mdash; you&apos;ve got an AI
                    mentor that learns with you, supports you, and helps you
                    succeed on your own terms.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="w-full py-8 md:py-12 bg-[var(--baige)] px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-[var(--baige)] rounded-2xl p-6 md:p-8">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[var(--main-green)] mb-4 md:mb-6"
                style={{ fontFamily: "var(--font-literata)" }}
              >
                Why Prepzy?
              </h2>
              <ul
                className="space-y-3 md:space-y-4 text-[var(--main-green)]"
                style={{ fontFamily: "var(--font-paragraph)" }}
              >
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">Access structured book content by educational board</span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">
                    Ask academic questions and get instant AI explanations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">
                    Generate quizzes & mock tests with difficulty levels
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">Use the smart study planner to stay on track</span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">
                    Annotate PDFs, transcribe videos, and take AI-generated notes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">Earn badges, XP, and rise on the leaderboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">Collaborate in virtual study rooms with peers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">Receive performance feedback and career guidance</span>
                </li>
              </ul>
            </div>

            {/* Who We're For */}
            <div className="bg-[var(--baige)] rounded-2xl p-6 md:p-8">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[var(--main-green)] mb-4 md:mb-6"
                style={{ fontFamily: "var(--font-literata)" }}
              >
                Who We&apos;re For?
              </h2>
              <p
                className="text-[var(--main-green)] font-medium mb-3 md:mb-4 text-sm sm:text-base"
                style={{ fontFamily: "var(--font-paragraph)" }}
              >
                Prepzy is built for:
              </p>
              <ul
                className="space-y-3 md:space-y-4 text-[var(--main-green)]"
                style={{ fontFamily: "var(--font-paragraph)" }}
              >
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">
                    Students preparing for entrance exams like EETA, NET, NUMS,
                    etc.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">
                    Learners who want structured, AI-powered guidance without
                    paying for coaching
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">Those who prefer studying in Urdu, English, or both</span>
                </li>
                <li className="flex items-start">
                  <span className="text-base md:text-lg mr-2 md:mr-3">•</span>
                  <span className="text-sm sm:text-base">
                    Anyone looking for affordable, tech-driven, and effective prep
                    tools
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;