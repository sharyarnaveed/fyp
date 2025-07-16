"use client";
import Image from "next/image";

export default function Home() {
  const options = [
    {
      id: 1,
      icon: (
        <svg
          width="76"
          height="76"
          viewBox="0 0 76 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M33.307 28.4937L31.6667 24.4783L30.02 28.4937H33.307ZM18.2083 9.5C15.8987 9.5 13.6837 10.4175 12.0506 12.0506C10.4175 13.6837 9.5 15.8987 9.5 18.2083V57.7917C9.5 60.1013 10.4175 62.3163 12.0506 63.9494C13.6837 65.5825 15.8987 66.5 18.2083 66.5H38.0697C35.9507 63.1922 34.8273 59.345 34.8333 55.4167C34.8333 52.611 35.3938 49.9383 36.4103 47.5H18.2083C17.5784 47.5 16.9744 47.2498 16.529 46.8044C16.0836 46.359 15.8333 45.7549 15.8333 45.125C15.8333 44.4951 16.0836 43.891 16.529 43.4456C16.9744 43.0002 17.5784 42.75 18.2083 42.75H39.1907C41.1142 40.2823 43.5758 38.2865 46.3878 36.9145C49.1998 35.5425 52.2879 34.8307 55.4167 34.8333C59.345 34.8273 63.1922 35.9507 66.5 38.0697V18.2083C66.5 15.8987 65.5825 13.6837 63.9494 12.0506C62.3163 10.4175 60.1013 9.5 57.7917 9.5H18.2083ZM29.2917 58.5833H18.2083C17.5784 58.5833 16.9744 58.3331 16.529 57.8877C16.0836 57.4423 15.8333 56.8382 15.8333 56.2083C15.8333 55.5784 16.0836 54.9744 16.529 54.529C16.9744 54.0836 17.5784 53.8333 18.2083 53.8333H29.2917C29.9216 53.8333 30.5256 54.0836 30.971 54.529C31.4164 54.9744 31.6667 55.5784 31.6667 56.2083C31.6667 56.8382 31.4164 57.4423 30.971 57.8877C30.5256 58.3331 29.9216 58.5833 29.2917 58.5833ZM33.8643 17.3027L40.983 34.7257C41.2215 35.3089 41.2186 35.9631 40.9748 36.5442C40.731 37.1253 40.2664 37.5857 39.6831 37.8243C39.0998 38.0628 38.4457 38.0598 37.8646 37.816C37.2835 37.5722 36.823 37.1076 36.5845 36.5243L35.245 33.2437H28.082L26.7393 36.5243C26.4927 37.0953 26.032 37.5468 25.4561 37.7818C24.8802 38.0167 24.2351 38.0164 23.6595 37.7808C23.0838 37.5452 22.6236 37.0933 22.3776 36.522C22.1316 35.9507 22.1195 35.3057 22.344 34.7257L29.469 17.3027C29.6477 16.8666 29.9521 16.4935 30.3434 16.2309C30.7348 15.9684 31.1954 15.8282 31.6667 15.8282C32.1379 15.8282 32.5986 15.9684 32.9899 16.2309C33.3813 16.4935 33.6856 16.8666 33.8643 17.3027ZM52.25 18.1988V22.1572H56.2083C56.8382 22.1572 57.4423 22.4074 57.8877 22.8528C58.3331 23.2982 58.5833 23.9023 58.5833 24.5322C58.5833 25.1621 58.3331 25.7661 57.8877 26.2115C57.4423 26.6569 56.8382 26.9072 56.2083 26.9072H52.25V30.8655C52.25 31.4954 51.9998 32.0995 51.5544 32.5449C51.109 32.9903 50.5049 33.2405 49.875 33.2405C49.2451 33.2405 48.641 32.9903 48.1956 32.5449C47.7502 32.0995 47.5 31.4954 47.5 30.8655V26.9072H43.5417C42.9118 26.9072 42.3077 26.6569 41.8623 26.2115C41.4169 25.7661 41.1667 23.9023 41.1667 24.5322C41.1667 23.9023 41.4169 23.2982 41.8623 22.8528C42.3077 22.4074 42.9118 22.1572 43.5417 22.1572H47.5V18.1988C47.5 17.5689 47.7502 16.9649 48.1956 16.5195C48.641 16.0741 49.2451 15.8238 49.875 15.8238C50.5049 15.8238 51.109 16.0741 51.5544 16.5195C51.9998 16.9649 52.25 17.5689 52.25 18.1988ZM72.8333 55.4167C72.8333 50.7975 70.9984 46.3675 67.7321 43.1012C64.4659 39.835 60.0359 38 55.4167 38C50.7975 38 46.3675 39.835 43.1012 43.1012C39.835 46.3675 38 50.7975 38 55.4167C38 60.0359 39.835 64.4659 43.1012 67.7321C46.3675 70.9984 50.7975 72.8333 55.4167 72.8333C60.0359 72.8333 64.4659 70.9984 67.7321 67.7321C70.9984 64.4659 72.8333 60.0359 72.8333 55.4167ZM57 57L57.0032 64.9262C57.0032 65.3461 56.8364 65.7488 56.5394 66.0458C56.2425 66.3427 55.8398 66.5095 55.4198 66.5095C54.9999 66.5095 54.5972 66.3427 54.3002 66.0458C54.0033 65.7488 53.8365 65.3461 53.8365 64.9262V57H45.904C45.4841 57 45.0813 56.8332 44.7844 56.5363C44.4875 56.2393 44.3207 55.8366 44.3207 55.4167C44.3207 54.9967 44.4875 54.594 44.7844 54.2971C45.0813 54.0001 45.4841 53.8333 45.904 53.8333H53.8333V45.9167C53.8333 45.4967 54.0001 45.094 54.2971 44.7971C54.594 44.5001 54.9967 44.3333 55.4167 44.3333C55.8366 44.3333 56.2393 44.5001 56.5363 44.7971C56.8332 45.094 57 45.4967 57 45.9167V53.8333H64.9262C65.3461 53.8333 65.7488 54.0001 66.0458 54.2971C66.3427 54.594 66.5095 54.9967 66.5095 55.4167C66.5095 55.8366 66.3427 56.2393 66.0458 56.5363C65.7488 56.8332 65.3461 57 64.9262 57H57Z"
            fill="#4E635E"
          />
        </svg>
      ),
      title: "Quiz & Mock Test Generator",
      content:
        "Create quizzes based on topics, difficulty, and time. Instant feedback helps you sharpen weak areas quickly.",
    },
    {
      id: 2,
      icon: (
        <svg
          width="76"
          height="76"
          viewBox="0 0 76 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M54.625 54.625H54.3139L56.601 51.1931C56.8613 50.8028 57.0001 50.3441 57 49.875V28.5C57 5.02312 38.19 4.75 38 4.75C37.3701 4.75 36.766 5.00022 36.3206 5.44562C35.8752 5.89102 35.625 6.49511 35.625 7.125V11.875H33.25C32.755 11.8756 32.2726 12.0309 31.8701 12.3191L15.2451 24.1941C14.8316 24.4892 14.5235 24.909 14.3662 25.3921C14.2089 25.8751 14.2106 26.3959 14.3711 26.8779L16.7461 34.0029C16.9223 34.5302 17.2779 34.9789 17.751 35.271C18.224 35.5631 18.7845 35.6799 19.3349 35.6012L30.9011 33.9482L21.7336 48.6162C21.4916 49.0041 21.3667 49.4535 21.3739 49.9106C21.3811 50.3677 21.52 50.813 21.774 51.1931L24.0635 54.625H23.75C21.8609 54.6269 20.0497 55.3782 18.714 56.7139C17.3782 58.0497 16.6269 59.8609 16.625 61.75V71.25H61.75V61.75C61.7481 59.8609 60.9968 58.0497 59.6611 56.7139C58.3253 55.3782 56.5141 54.6269 54.625 54.625ZM37.639 32.1337C37.879 31.7499 38.0043 31.3054 38.0001 30.8527C37.9959 30.3999 37.8624 29.9578 37.6153 29.5785C37.3682 29.1991 37.0179 28.8983 36.6055 28.7114C36.1931 28.5245 35.7359 28.4594 35.2878 28.5238L20.6245 30.6185L19.4323 27.037L34.01 16.625H37.9976C38.6271 16.625 39.2308 16.3751 39.6762 15.9302C40.1215 15.4853 40.372 14.8819 40.3726 14.2524L40.375 9.80638C43.9399 10.602 50.3904 13.4663 51.9175 23.75H45.125V28.5H52.25V33.25H45.125V38H52.25V42.75H45.125V47.5H52.25V49.1554L48.6044 54.625H29.7706L26.5763 49.8323L37.639 32.1337ZM57 66.5H21.375V61.75C21.375 61.1201 21.6252 60.516 22.0706 60.0706C22.516 59.6252 23.1201 59.375 23.75 59.375H54.625C55.2549 59.375 55.859 59.6252 56.3044 60.0706C56.7498 60.516 57 61.1201 57 61.75V66.5Z"
            fill="#4E635E"
          />
        </svg>
      ),
      title: "Gamification",
      content:
        "Earn rewards for consistency and improvement. Stay motivated with weekly challenges and rankings.",
    },
    {
      id: 3,
      icon: (
        <svg
          width="58"
          height="67"
          viewBox="0 0 58 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.5 6.83333C0.5 5.15363 1.16726 3.54272 2.35499 2.35499C3.54272 1.16726 5.15363 0.5 6.83333 0.5H51.1667C52.8464 0.5 54.4573 1.16726 55.645 2.35499C56.8327 3.54272 57.5 5.15363 57.5 6.83333V51.1667C57.5 52.8464 56.8327 54.4573 55.645 55.645C54.4573 56.8327 52.8464 57.5 51.1667 57.5H6.83333C5.15363 57.5 3.54272 56.8327 2.35499 55.645C1.16726 54.4573 0.5 52.8464 0.5 51.1667V6.83333ZM35.1402 15.2408C34.0223 12.4447 30.0165 12.603 29.1172 15.4752L23.5692 33.2275L22.3405 30.767C22.0748 30.2361 21.6666 29.7896 21.1616 29.4776C20.6566 29.1655 20.0747 29.0001 19.481 29H13.1667C12.3268 29 11.5214 29.3336 10.9275 29.9275C10.3336 30.5214 10 31.3268 10 32.1667C10 33.0065 10.3336 33.812 10.9275 34.4058C11.5214 34.9997 12.3268 35.3333 13.1667 35.3333H17.543L21.381 43.0125C22.6698 45.587 26.4382 45.283 27.2963 42.5375L32.534 25.7763L35.5518 33.3225C36.0363 34.5385 37.2143 35.3333 38.5222 35.3333H44.8333C45.6732 35.3333 46.4786 34.9997 47.0725 34.4058C47.6664 33.812 48 33.0065 48 32.1667C48 31.3268 47.6664 30.5214 47.0725 29.9275C46.4786 29.3336 45.6732 29 44.8333 29H40.6438L35.1402 15.2408Z"
            fill="#4E635E"
          />
        </svg>
      ),
      title: "Performance Analytics",
      content:
        "Access structured study material organized by educational boards. Available in both English and Urdu for personalized learning.",
    },
  ];

  return (
    <>
{/* Hero Section */}
{/* Hero Section */}
<main className="relative min-h-screen lg:h-[90vh] flex flex-col lg:flex-row overflow-hidden">
  <div className="w-full lg:w-[53%] flex flex-col justify-center items-center lg:items-start px-6 lg:pl-24 py-12 lg:py-0 text-[var(--baige)] font-[var(--font-literata)] text-center lg:text-left">
    <div className="relative">
      <h1 className="absolute left-1/2 -translate-x-1/2 text-5xl lg:text-[5rem] mb-0">
        Crack
      </h1>
      <h1 className="pt-[3rem] text-7xl lg:text-[10rem] font-bold leading-none drop-shadow-[4px_6px_0_rgba(0,0,0,0.4)]">
        Exams
      </h1>
    </div>

    <p className="text-2xl lg:text-[3rem] drop-shadow-sm mb-2 mt-1">
      not your brain
    </p>
    <p className="text-base lg:text-lg drop-shadow-sm mb-8">
      AI-powered platform for exam prep.
    </p>

    <button className="cursor-pointer bg-[var(--baige)] text-[var(--main-green)] text-lg lg:text-xl px-8 lg:px-10 py-2 lg:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors drop-shadow-md">
      Get Free Trial
    </button>
  </div>

  <div className="w-full lg:w-[47%] h-[40vh] sm:h-[60vh] md:h-[80vh] lg:h-auto relative">
    <Image
      src="/mainimage.png"
      alt="main image"
      fill
      className="object-contain object-center"
      priority
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 47vw"
    />
  </div>

  <div className="absolute bottom-0 w-full">
    <svg
      className="w-full h-[60px]"
      viewBox="0 0 1440 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 50C80 90 160 10 240 50C320 90 400 10 480 50C560 90 640 10 720 50C800 90 880 10 960 50C1040 90 1120 10 1200 50C1280 90 1360 10 1440 50V100H0V50Z"
        fill="#e6e3cb"
      />
    </svg>
  </div>
</main>

{/* Section 2 */}
<main className="bg-[var(--baige)] py-12 lg:py-24">
  <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
    <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1 px-4 lg:px-0">
      <div className="relative w-full max-w-[400px] sm:max-w-[600px] md:max-w-[500px] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[550px]">
        <Image
          src="/mainsection2.png"
          alt="Stressed student illustration"
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
        />
      </div>
    </div>

    <div className="w-full lg:w-1/2 text-[var(--main-green)] order-1 lg:order-2 px-4 lg:px-0">
      <h2 className="text-3xl lg:text-[2.5rem] font-bold mb-4">
        The future of
        <br />
        our service
      </h2>
      <p
        className="text-base lg:text-lg leading-relaxed max-w-md"
        style={{ fontFamily: "var(--font-paragraph)" }}
      >
        It helps students in Pakistan study smarter with personalized
        quizzes, study plans, instant answers, content support, and
        performance tracking — all in one place, without the need for
        expensive coaching.
      </p>
    </div>
  </div>
</main>

      {/* Section 3 */}
      <main className="bg-[var(--olivegreen)] py-12 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-[var(--baige)] rounded-2xl py-5 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 mb-6 md:mb-0">
                <h2 className="text-3xl md:text-[2.8rem] text-[var(--main-green)] mb-1">
                  Our Features
                </h2>
                <p className="text-xl md:text-[2.8rem] text-[var(--main-green)] opacity-80 mb-4">
                  Special For You
                </p>
                <button className="bg-[var(--main-green)] text-[1.2rem] text-[var(--baige)] px-8 md:px-10 py-2 md:py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2 md:gap-4">
                  See All Features
                  <svg
                    width="28"
                    height="27"
                    viewBox="0 0 28 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.90915 17.9639L19.5221 9.05858"
                      stroke="#E2E0C8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.018 8.121L19.8253 8.80405L19.1422 16.6113"
                      stroke="#E2E0C8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="ml-0 md:ml-6">
                <img src="/section3.png" alt="" className="w-42 cover max-w-xs" />
              </div>
            </div>

            <div className="bg-[var(--baige)] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  width="71"
                  height="71"
                  viewBox="0 0 71 71"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.75 65.0833C16.1229 65.0833 14.7305 64.5044 13.5728 63.3467C12.4151 62.1891 11.8353 60.7957 11.8333 59.1666V11.8333C11.8333 10.2062 12.4131 8.81382 13.5728 7.65613C14.7325 6.49843 16.1249 5.9186 17.75 5.91663H53.25C54.8771 5.91663 56.2704 6.49646 57.4301 7.65613C58.5898 8.81579 59.1686 10.2082 59.1666 11.8333V59.1666C59.1666 60.7937 58.5878 62.1871 57.4301 63.3467C56.2724 64.5064 54.879 65.0853 53.25 65.0833H17.75ZM32.5416 11.8333V29.9531C32.5416 30.5448 32.7763 30.9767 33.2457 31.2488C33.7151 31.521 34.22 31.5082 34.7604 31.2104L38.3844 29.0656C38.8774 28.7698 39.3833 28.6218 39.902 28.6218C40.4207 28.6218 40.9256 28.7698 41.4166 29.0656L45.0406 31.2104C45.583 31.5062 46.1007 31.519 46.5937 31.2488C47.0868 30.9786 47.3333 30.5467 47.3333 29.9531V11.8333H32.5416Z"
                    fill="#4E635E"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--main-green)] mb-2">
                Categorized Book Content
              </h3>
              <p
                className="text-sm text-[var(--main-green)] opacity-80"
                style={{ fontFamily: "var(--font-paragraph)" }}
              >
                Access structured study material organized by educational
                boards. Available in both English and Urdu for personalized
                learning.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((item) => (
              <div
                className="bg-[var(--baige)] rounded-2xl px-6 py-9"
                key={item.id}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--main-green)] mb-2">
                  {item.title}
                </h3>
                <p
                  className="text-sm text-[var(--main-green)] opacity-80"
                  style={{ fontFamily: "var(--font-paragraph)" }}
                >
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Section 4 */}
      <main className="bg-[var(--lightgreen)] py-12 md:py-24 min-h-[50vh] md:min-h-[95vh] flex justify-center items-center">
        <div className="max-w-6xl mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 text-black order-2 md:order-1 px-4 md:px-0">
            <h2 className="text-2xl md:text-[2.2rem] font-bold mb-4">
              Its easy to start
              <br />
              <span className="border-2 border-[var(--main-green)] py-1 md:py-2 px-4 md:px-6 text-xl md:text-[2.3rem] rounded-full bg-[var(--baige)] inline-block mt-2">
                Learning
              </span>
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed max-w-md mb-6"
              style={{ fontFamily: "var(--font-paragraph)" }}
            >
              Our Sign-in Process Lets You Start Your Learning Journey
              Without Much Hassle. Our Aim Is To Create Learning
              Experience For You
            </p>

            <div className="flex flex-col gap-4" style={{ fontFamily: "var(--font-paragraph)" }}>
              <div className="flex items-center gap-4">
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 32.0834C25.5544 32.0834 32.0833 25.5545 32.0833 17.5001C32.0833 9.44571 25.5544 2.91675 17.5 2.91675C9.44563 2.91675 2.91667 9.44571 2.91667 17.5001C2.91667 25.5545 9.44563 32.0834 17.5 32.0834ZM25.4581 13.7915L16.0417 23.208L9.90646 17.0728L11.9685 15.0107L16.0417 19.0838L23.396 11.7295L25.4581 13.7915Z" fill="#E2E0C8"/>
                </svg>
                <span className="text-base md:text-lg font-medium">Create your account</span>
              </div>
              
              <div className="flex items-center gap-4">
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 32.0834C25.5544 32.0834 32.0833 25.5545 32.0833 17.5001C32.0833 9.44571 25.5544 2.91675 17.5 2.91675C9.44563 2.91675 2.91667 9.44571 2.91667 17.5001C2.91667 25.5545 9.44563 32.0834 17.5 32.0834ZM25.4581 13.7915L16.0417 23.208L9.90646 17.0728L11.9685 15.0107L16.0417 19.0838L23.396 11.7295L25.4581 13.7915Z" fill="#E2E0C8"/>
                </svg>
                <span className="text-base md:text-lg font-medium">Choose Test & Goals</span>
              </div>
              
              <div className="flex items-center gap-4">
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 32.0834C25.5544 32.0834 32.0833 25.5545 32.0833 17.5001C32.0833 9.44571 25.5544 2.91675 17.5 2.91675C9.44563 2.91675 2.91667 9.44571 2.91667 17.5001C2.91667 25.5545 9.44563 32.0834 17.5 32.0834ZM25.4581 13.7915L16.0417 23.208L9.90646 17.0728L11.9685 15.0107L16.0417 19.0838L23.396 11.7295L25.4581 13.7915Z" fill="#E2E0C8"/>
                </svg>
                <span className="text-base md:text-lg font-medium">Learn with AI</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2 py-6 md:py-10">
            <img
              src="/lastsection.png"
              alt="Stressed student illustration"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </main>
    </>
  );
}