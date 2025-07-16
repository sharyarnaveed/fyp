import Image from 'next/image';

const images = [
  { src: '/about1.png', alt: 'Study desk' },
  { src: '/about2.png', alt: 'Laptop and notes' },
  { src: '/about3.png', alt: 'Group studying' },
  { src: '/about4.png', alt: 'Exam calendar' },
  { src: '/about5.png', alt: 'A+ grade' },
];

const Page = () => {
  return (
    <>
    <main className="min-h-screen bg-[#5E7266] flex flex-col relative">
      {/* Header - Increased height to prevent collision */}
      <section className="w-full flex flex-col justify-center items-center py-24 text-center bg-[var(--main-green)] z-10">
        <h1 className="text-[3rem] font-bold text-[var(--baige)] mb-4" style={{ fontFamily: 'var(--font-literata)' }}>
         About us
        </h1>
        <p className="text-[var(--baige)] max-w-3xl flex justify-center items-center w-80% text-lg mb-8" style={{ fontFamily: 'var(--font-paragraph)' }}>
          Prepzy is an AI-powered learning platform built to help students prepare smarter for competitive exams  faster, better
        </p>
      </section>

     
      <div className="absolute justify-center w-[100%] top-[calc(16rem+2rem)] flex flex-row gap-6 z-20"
           style={{ width: '90%', transform: 'translateX(-50%)', left: '50%' }}>
        {images.map((img, idx) => {
          // Alternate heights: odd indices get more height
          const isOdd = idx % 2 === 1;
          const height = isOdd ? 220 : 180;
          
          return (
            <div key={idx} className="rounded-xl overflow-hidden shadow-lg bg-[var(--olivegreen)]"
                 style={{ width: 180, height }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={180}
                height={height}
                className="object-cover w-[180px]"
                style={{ height: `${height}px` }}
              />
            </div>
          );
        })}
      </div>

    
      <div className="pt-32 px-8">
      
        <section className="max-w-6xl mx-auto py-16">
          <h2 className="text-4xl font-bold text-[var(--baige)] mb-8" style={{ fontFamily: 'var(--font-literata)' }}>
            What is Prepzy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--baige)]">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-paragraph)' }}>
                Prepzy is your digital exam mentor. Designed specifically for students in Pakistan, 
                Prepzy blends artificial intelligence with a deep understanding of local education 
                needs. Whether you're preparing for EETA, NET, MDNS, or other competitive 
                exams, Prepzy offers personalized learning tools that make studying efficient, 
                engaging, and effective.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-paragraph)' }}>
                From AI-generated quizzes, smart study plans, and past paper insights to Order-
                English content support, flashcards, mind maps, and gamified progress tracking, 
                Prepzy gives you everything you need — all in one place.
              </p>
            </div>
          </div>
        </section>


        <section className="max-w-6xl mx-auto pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/about6.png"
                  alt="Student studying with laptop"
                  width={500}
                  height={500}
                  className="w-full h-[350px]  object-cover"
                />
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[var(--baige)] mb-4" style={{ fontFamily: 'var(--font-literata)' }}>
                  Our Vision
                </h2>
                <p className="text-[var(--baige)] text-lg leading-relaxed" style={{ fontFamily: 'var(--font-paragraph)' }}>
                  To democratize exam preparation by replacing expensive coaching centers with a 
                  smart, students-friendly, and bilingual learning platform, giving every student in 
                  Pakistan the chance to succeed, regardless of background or location.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-[var(--baige)] mb-4" style={{ fontFamily: 'var(--font-literata)' }}>
                  Our Belief
                </h2>
                <p className="text-[var(--baige)] text-lg leading-relaxed" style={{ fontFamily: 'var(--font-paragraph)' }}>
                  We believe that learning should be smart, not hard. With Prepzy, you're not alone — 
                  you've got an AI mentor that learns with you, supports you, and helps you succeed 
                  on your own terms.
                </p>
              </div>
            </div>
          </div>
        </section>

 


      </div>

    </main>
      <section className="w-full  py-12 bg-[var(--baige)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
       
            <div className="bg-[var(--baige)] rounded-2xl p-8 ">
              <h2 className="text-3xl font-bold text-[var(--main-green)] mb-6" style={{ fontFamily: 'var(--font-literata)' }}>
                Why Prepzy?
              </h2>
              <ul className="space-y-4 text-[var(--main-green)]" style={{ fontFamily: 'var(--font-paragraph)' }}>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Access structured book content by educational board</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Ask academic questions and get instant AI explanations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Generate quizzes & mock tests with difficulty levels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Use the smart study planner to stay on track</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Annotate PDFs, transcribe videos, and take AI-generated notes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Earn badges, XP, and rise on the leaderboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Collaborate in virtual study rooms with peers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Receive performance feedback and career guidance</span>
                </li>
              </ul>
            </div>

            {/* Who We're For */}
            <div className="bg-[var(--baige)] rounded-2xl p-8 ">
              <h2 className="text-3xl font-bold text-[var(--main-green)] mb-6" style={{ fontFamily: 'var(--font-literata)' }}>
                Who We're For?
              </h2>
              <p className="text-[var(--main-green)] font-medium mb-4" style={{ fontFamily: 'var(--font-paragraph)' }}>
                Prepzy is built for:
              </p>
              <ul className="space-y-4 text-[var(--main-green)]" style={{ fontFamily: 'var(--font-paragraph)' }}>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Students preparing for entrance exams like EETA, NET, NUMS, etc.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Learners who want structured, AI-powered guidance without paying for coaching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Those who prefer studying in Urdu, English, or both</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-3">•</span>
                  <span>Anyone looking for affordable, tech-driven, and effective prep tools</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        </>
  );
};

export default Page;