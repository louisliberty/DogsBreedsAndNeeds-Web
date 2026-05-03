import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Privacy() {
  useCanonical("/privacy");
  usePageMeta(
    "Privacy Policy | Dog Breeds & Needs",
    "How Dog Breeds & Needs collects, uses, and protects your information, including cookies, analytics, email signups, and your data rights."
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-privacy-title">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: May 1, 2026</p>

        <section className="space-y-4 mb-8">
          <p>
            DogBreedsAndNeeds.com ("we," "us," or "our") respects your privacy. This Privacy Policy explains what information we collect when you visit dogbreedsandneeds.com, how we use that information, and the choices you have.
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Information We Collect</h2>
        <p className="mb-3">We collect two categories of information:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Information you provide.</strong> When you sign up for breed-specific tips, complete the breed selector quiz, or contact us, you may share your email address and quiz responses.</li>
          <li><strong>Information collected automatically.</strong> When you visit the site we automatically collect standard log data including IP address, browser type, device type, pages viewed, referring URL, and timestamps. We use cookies and similar technologies to remember your preferences (e.g. light/dark theme) and to power analytics.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>To deliver and improve site content and functionality.</li>
          <li>To send you breed-specific tips when you opt in (you can unsubscribe anytime).</li>
          <li>To analyze how the site is used so we can improve it.</li>
          <li>To detect, prevent, and respond to abuse, fraud, or technical issues.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Cookies & Tracking</h2>
        <p className="mb-4">
          We use first-party cookies for essential site functionality (e.g. remembering your theme preference) and may use third-party analytics cookies (such as Google Analytics) to understand aggregate site traffic. You can disable cookies in your browser settings; some site features may not work as expected without them.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Advertising & Affiliate Links</h2>
        <p className="mb-4">
          Some pages contain affiliate links to third-party retailers. If you click an affiliate link and make a purchase, we may earn a commission at no extra cost to you. We may also display advertisements served by third-party ad networks; those networks may use cookies to deliver relevant ads.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Email Subscriptions</h2>
        <p className="mb-4">
          If you provide your email to receive breed tips or quiz results, we will only use it to send you the content you requested and occasional related updates. Every email contains an unsubscribe link. We do not sell, rent, or share your email with third parties for their marketing.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Data Sharing</h2>
        <p className="mb-4">
          We do not sell personal information. We may share information with service providers (such as hosting, analytics, and email-delivery vendors) who process it on our behalf under contractual obligations of confidentiality, and with authorities when required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Children's Privacy</h2>
        <p className="mb-4">
          The site is not directed to children under 13 and we do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, please contact us so we can delete it.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Your Rights</h2>
        <p className="mb-4">
          Depending on your jurisdiction, you may have the right to access, correct, delete, or export the personal information we hold about you, and to object to or restrict certain processing. To exercise any of these rights, email us at the address below.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Data Security & Retention</h2>
        <p className="mb-4">
          We use reasonable technical and organizational safeguards to protect personal information. We retain personal information only as long as needed for the purposes described above or as required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects when changes were made. Material changes will be highlighted on the site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Contact Us</h2>
        <p className="mb-4">
          Questions about this policy? Email <a href="mailto:privacy@dogbreedsandneeds.com" className="underline hover:text-primary" data-testid="link-privacy-email">privacy@dogbreedsandneeds.com</a>.
        </p>
      </div>
    </div>
  );
}
