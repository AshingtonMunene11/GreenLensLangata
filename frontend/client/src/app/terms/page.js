"use client";

import Link from "next/link";


export default function TermsPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/backgroundsample1.png)" }}
    >
      <div className="bg-[#112C23] p-8 rounded-lg shadow-lg w-full max-w-3xl text-white overflow-y-auto max-h-[90vh]">
        

        <h1 className="text-2xl font-semibold mb-6 text-center text-white">
          Terms & Conditions
        </h1>

        <p className="text-sm mb-6 text-gray-200 text-center">
          Last Updated: October 28, 2025
        </p>

        <div className="space-y-5 text-[#FAFCF1] text-sm leading-relaxed">
          <p>
            Welcome to <strong>GreenLens</strong>! By creating an account,
            accessing, or using our services, you agree to these Terms &
            Conditions. Please read them carefully before using our platform.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            1. Acceptance of Terms
          </h2>
          <p>
            By signing up or using GreenLens, you agree to follow and be bound
            by these Terms & Conditions and our{" "}
            <Link href="/terms" className="text-[#86EE92] underline">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use our services.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            2. Eligibility
          </h2>
          <p>
            You must be at least 13 years old (or the legal digital consent age
            in your country) to create an account and use GreenLens.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            3. Your Account
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities under your account. Please
            ensure that your registration information is accurate and current.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            4. Acceptable Use
          </h2>
          <p>
            You agree not to misuse GreenLens, including but not limited to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Posting harmful, illegal, or misleading content.</li>
            <li>
              Attempting to gain unauthorized access to other users or systems.
            </li>
            <li>Interfering with or disrupting our services.</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            5. Intellectual Property
          </h2>
          <p>
            All content, trademarks, logos, and materials on GreenLens are owned
            by us or our partners. You may not copy, modify, or distribute them
            without permission.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            6. Privacy
          </h2>
          <p>
            Your privacy matters to us. Please read our{" "}
            <Link href="/terms" className="text-[#86EE92] underline">
              Privacy Policy
            </Link>{" "}
            to understand how we collect, use, and protect your information.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            7. Termination
          </h2>
          <p>
            We may suspend or terminate your account at any time if you breach
            these Terms or misuse the platform. 
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            8. Disclaimer of Warranties
          </h2>
          <p>
            GreenLens is provided on an “as is” basis without warranties of any
            kind. We do not guarantee uninterrupted, error-free service or that
            our platform will always be secure.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            9. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, GreenLens and its team shall
            not be liable for any damages, data loss or inconvenience arising
            from the use or inability to use our platform.<br />
            Content entirely for educational and informational purposes.
            We do not endorse or guarantee the accuracy of any user-generated
            content. You use GreenLens at your own risk.
          </p>

          <h2 className="text-lg font-semibold text-[#86EE92] mt-6">
            10. Changes to These Terms
          </h2>
          <p>
            We may update these Terms occasionally. Updated versions will be
            posted here with a new “Last Updated” date. Continuing to use
            GreenLens means you accept the revised Terms.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-block bg-[#FFFFFF] text-[#112C23] px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
