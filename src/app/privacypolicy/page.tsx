const page = () => {
  return (
    <main className="min-h-screen bg-[#5E7266] flex flex-col">
      {/* Header - Centered */}
      <section className="w-full flex flex-col justify-center items-center py-8 sm:py-10 md:py-12 text-center bg-[var(--main-green)] px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-bold text-[var(--baige)] mb-2 sm:mb-3">
          Privacy Policy
        </h1>
        <p className="text-[var(--baige)] max-w-3xl w-full text-sm sm:text-base md:text-lg px-2 sm:px-0">
          Welcome to Prepzy, an AI powered exam preparation platform designed for
          students in Pakistan. Your privacy is important to us. This Privacy
          Policy explains how we collect, use, protect, and handle your personal
          information when you use our website and services.
        </p>
      </section>

      {/* Content - Left-aligned on desktop */}
      <section className="flex flex-col md:flex-row gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-14 bg-[var(--baige)] flex-1">
        <div
          className="max-w-3xl w-full text-[var(--main-green)] text-sm sm:text-base space-y-4 sm:space-y-6 px-4 sm:px-5 md:px-0 md:ml-10 lg:ml-20"
          style={{ fontFamily: "var(--font-paragraph)" }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            1. Information We Collect
          </h2>
          <p className="font-semibold">a. Personal Information</p>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Exam board and subject preferences</li>
            <li>Account credentials</li>
            <li>Messages or content submitted through forms or chatbot</li>
          </ul>
          <p className="font-semibold mt-3 sm:mt-4">b. Usage Data</p>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1">
            <li>IP address</li>
            <li>Browser and device information</li>
            <li>Pages visited, time spent, and interaction behavior</li>
            <li>Quiz and learning progress data</li>
          </ul>
          <p className="font-semibold mt-3 sm:mt-4">c. AI Interaction Logs</p>
          <p>
            We store chatbot interactions and AI-generated recommendations to
            improve performance and deliver personalized experiences.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1">
            <li>Deliver personalized learning tools and recommendations</li>
            <li>Generate quizzes, study plans, and performance reports</li>
            <li>Respond to your support queries</li>
            <li>Improve our services and AI functionality</li>
            <li>
              Communicate updates, offers, and platform-related information
              (with opt-in consent)
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            3. Data Storage and Security
          </h2>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1">
            <li>Encrypted communication (HTTPS)</li>
            <li>Secure database access controls</li>
            <li>Regular backups and monitoring</li>
            <li>JWT-based user authentication</li>
          </ul>
          <p className="mt-2">
            Your personal data is stored on secure servers, and access is
            restricted to authorized personnel only.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            4. Sharing of Information
          </h2>
          <p>
            We do not sell, rent, or trade your personal data. We may share data
            only:
          </p>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1 mt-2">
            <li>
              With trusted third-party service providers for hosting and
              analytics
            </li>
            <li>When legally required by authorities</li>
            <li>To protect our platform against abuse or misuse</li>
          </ul>
          <p className="mt-2">
            All third parties are contractually obligated to protect your data
            and use it only for the intended purpose.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            5. Cookies and Tracking Technologies
          </h2>
          <p>Prepzy uses cookies and similar technologies to:</p>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1 mt-2">
            <li>Maintain login sessions</li>
            <li>Analyze user behavior</li>
            <li>Improve platform functionality and user experience</li>
          </ul>
          <p className="mt-2">
            You can disable cookies through your browser settings; however, this
            may impact some features.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            6. AI Data Usage
          </h2>
          <p>
            Your activity on Prepzy, including your interactions with AI
            features, may be logged to:
          </p>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1 mt-2">
            <li>Provide better, more contextual responses</li>
            <li>Improve the accuracy of our AI systems</li>
            <li>Identify areas where learners need more support</li>
          </ul>
          <p className="mt-2">
            Data from users is not used to train external AI models and remains
            within the scope of Prepzy&apos;s internal systems.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            7. Children&apos;s Privacy
          </h2>
          <p>
            Prepzy is intended for use by students above the age of 13. We do
            not knowingly collect data from children under 13 without verified
            parental consent. If such data is identified, it will be deleted
            promptly.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            8. Your Rights
          </h2>
          <ul className="list-disc ml-4 sm:ml-6 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-essential communication</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at:{" "}
            <a href="mailto:privacy@prepzy.com" className="underline">
              privacy@prepzy.com
            </a>
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            9. Contact Information
          </h2>
          <p>
            If you have questions or concerns regarding your privacy or this
            policy, contact us at:
            <br />
            <span className="font-semibold">Email:</span>{" "}
            <a href="mailto:privacy@prepzy.com" className="underline">
              privacy@prepzy.com
            </a>
            <br />
            <span className="font-semibold">Location:</span> Islamabad, Pakistan
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this policy from time to time. Any changes will be
            posted on this page with an updated effective date. Continued use of
            the platform constitutes your agreement to the revised policy.
          </p>
        </div>
      </section>
    </main>
  );
};

export default page;