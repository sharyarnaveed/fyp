const page = () => {
  return (
    <main className="min-h-screen bg-[#050F2A] flex flex-col">
      {/* Header - Centered */}
      <section className="w-full flex flex-col justify-center items-center pt-20 sm:pt-20 md:pt-28 text-center pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F2FDFF] mb-6">
            Privacy Policy
          </h1>
          <p className="text-[#7BBBFF] max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
            Welcome to Prepzy, an AI powered exam preparation platform designed
            for students in Pakistan. Your privacy is important to us. This
            Privacy Policy explains how we collect, use, protect, and handle your
            personal information when you use our website and services.
          </p>
        </div>
      </section>

      {/* Content - Centered with card design */}
      <section className="flex justify-center px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl w-full bg-[#050F2A]/50 backdrop-blur-sm border border-[#7BBBFF]/20 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
          <div
            className="text-[#F2FDFF] text-sm sm:text-base space-y-8 sm:space-y-10"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                1. Information We Collect
              </h2>
              <div className="pl-4 space-y-4">
                <div>
                  <p className="font-semibold text-[#7BBBFF] mb-2">a. Personal Information</p>
                  <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Exam board and subject preferences</li>
                    <li>Account credentials</li>
                    <li>Messages or content submitted through forms or chatbot</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#7BBBFF] mb-2">b. Usage Data</p>
                  <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80">
                    <li>IP address</li>
                    <li>Browser and device information</li>
                    <li>Pages visited, time spent, and interaction behavior</li>
                    <li>Quiz and learning progress data</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#7BBBFF] mb-2">c. AI Interaction Logs</p>
                  <p className="text-[#F2FDFF]/80">
                    We store chatbot interactions and AI-generated recommendations to
                    improve performance and deliver personalized experiences.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80">
                <li>Deliver personalized learning tools and recommendations</li>
                <li>Generate quizzes, study plans, and performance reports</li>
                <li>Respond to your support queries</li>
                <li>Improve our services and AI functionality</li>
                <li>
                  Communicate updates, offers, and platform-related information
                  (with opt-in consent)
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                3. Data Storage and Security
              </h2>
              <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80">
                <li>Encrypted communication (HTTPS)</li>
                <li>Secure database access controls</li>
                <li>Regular backups and monitoring</li>
                <li>JWT-based user authentication</li>
              </ul>
              <p className="mt-3 text-[#F2FDFF]/80">
                Your personal data is stored on secure servers, and access is
                restricted to authorized personnel only.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                4. Sharing of Information
              </h2>
              <p className="text-[#F2FDFF]/80">
                We do not sell, rent, or trade your personal data. We may share data
                only:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80 mt-3">
                <li>
                  With trusted third-party service providers for hosting and
                  analytics
                </li>
                <li>When legally required by authorities</li>
                <li>To protect our platform against abuse or misuse</li>
              </ul>
              <p className="mt-3 text-[#F2FDFF]/80">
                All third parties are contractually obligated to protect your data
                and use it only for the intended purpose.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-[#F2FDFF]/80">Prepzy uses cookies and similar technologies to:</p>
              <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80 mt-3">
                <li>Maintain login sessions</li>
                <li>Analyze user behavior</li>
                <li>Improve platform functionality and user experience</li>
              </ul>
              <p className="mt-3 text-[#F2FDFF]/80">
                You can disable cookies through your browser settings; however, this
                may impact some features.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                6. AI Data Usage
              </h2>
              <p className="text-[#F2FDFF]/80">
                Your activity on Prepzy, including your interactions with AI
                features, may be logged to:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80 mt-3">
                <li>Provide better, more contextual responses</li>
                <li>Improve the accuracy of our AI systems</li>
                <li>Identify areas where learners need more support</li>
              </ul>
              <p className="mt-3 text-[#F2FDFF]/80">
                Data from users is not used to train external AI models and remains
                within the scope of Prepzy&apos;s internal systems.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                7. Children&apos;s Privacy
              </h2>
              <p className="text-[#F2FDFF]/80">
                Prepzy is intended for use by students above the age of 13. We do
                not knowingly collect data from children under 13 without verified
                parental consent. If such data is identified, it will be deleted
                promptly.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                8. Your Rights
              </h2>
              <ul className="list-disc ml-6 space-y-2 text-[#F2FDFF]/80">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of non-essential communication</li>
              </ul>
              <p className="mt-3 text-[#F2FDFF]/80">
                To exercise these rights, contact us at:{" "}
                <a href="mailto:privacy@prepzy.com" className="text-[#7BBBFF] hover:text-[#B8A9FF] underline transition-colors">
                  privacy@prepzy.com
                </a>
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                9. Contact Information
              </h2>
              <p className="text-[#F2FDFF]/80">
                If you have questions or concerns regarding your privacy or this
                policy, contact us at:
              </p>
              <div className="mt-3 text-[#F2FDFF]/80 space-y-1">
                <p>
                  <span className="font-semibold text-[#7BBBFF]">Email:</span>{" "}
                  <a href="mailto:privacy@prepzy.com" className="text-[#7BBBFF] hover:text-[#B8A9FF] underline transition-colors">
                    privacy@prepzy.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-[#7BBBFF]">Location:</span> Islamabad, Pakistan
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#B8A9FF] mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-[#F2FDFF]/80">
                We may update this policy from time to time. Any changes will be
                posted on this page with an updated effective date. Continued use of
                the platform constitutes your agreement to the revised policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
