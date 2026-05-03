import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Terms() {
  useCanonical("/terms");
  usePageMeta(
    "Terms of Service | Dog Breeds & Needs",
    "The terms governing your use of dogbreedsandneeds.com, content use, disclaimers, affiliate disclosure, and limitations of liability."
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-terms-title">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: May 1, 2026</p>

        <section className="space-y-4 mb-8">
          <p>
            These Terms of Service ("Terms") govern your use of dogbreedsandneeds.com (the "Site"). By accessing or using the Site you agree to these Terms. If you do not agree, please do not use the Site.
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Use of the Site</h2>
        <p className="mb-4">
          You may use the Site for personal, non-commercial purposes. You agree not to: (a) use the Site in any way that violates applicable law; (b) attempt to gain unauthorized access to any portion of the Site or related systems; (c) use automated tools to scrape, crawl, or harvest content beyond what is permitted by our robots.txt; or (d) interfere with or disrupt the Site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Content & Intellectual Property</h2>
        <p className="mb-4">
          All text, images, graphics, logos, and other content on the Site are owned by Dog Breeds & Needs or its licensors and are protected by copyright and other intellectual property laws. You may view and print pages for personal, non-commercial use. Reproduction, redistribution, or commercial use of content requires our prior written consent.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Editorial Content & Disclaimers</h2>
        <p className="mb-4">
          The Site provides general information about dog breeds, training, health, nutrition, and care. The information is provided for educational purposes only and is <strong>not</strong> a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of a qualified veterinarian with any questions you may have regarding your dog's health or behavior.
        </p>
        <p className="mb-4">
          Breed information, including temperament and care needs, reflects general tendencies. Individual dogs vary, and a breed's typical traits cannot guarantee how a specific dog will behave.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Third-Party Links & Recommendations</h2>
        <p className="mb-4">
          The Site contains links to third-party websites, breeders, rescues, and products. These links are provided for convenience; we do not control and are not responsible for the content, policies, or practices of third parties. Inclusion does not constitute endorsement, and you assume all risk when interacting with third-party services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Affiliate Disclosure</h2>
        <p className="mb-4">
          Some product links on the Site are affiliate links. If you click such a link and complete a purchase, we may earn a commission at no additional cost to you. Our editorial recommendations are made independently and are not influenced by affiliate relationships.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">User-Submitted Content</h2>
        <p className="mb-4">
          If you submit feedback, suggestions, or corrections, you grant us a non-exclusive, royalty-free, perpetual license to use that content in connection with operating and improving the Site. You represent that you have the right to submit any content you provide.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Disclaimer of Warranties</h2>
        <p className="mb-4">
          The Site is provided on an "as is" and "as available" basis, without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or completely accurate.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
        <p className="mb-4">
          To the maximum extent permitted by law, Dog Breeds & Needs and its contributors will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Site, including any decisions you make about choosing, acquiring, or caring for a dog.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold harmless Dog Breeds & Needs, its affiliates, and contributors from any claims, damages, or expenses (including reasonable attorneys' fees) arising out of your misuse of the Site or violation of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Modifications</h2>
        <p className="mb-4">
          We may modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last updated" date. Your continued use of the Site after changes constitutes acceptance of the revised Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by the laws of the United States, without regard to conflict of law rules. Any disputes will be resolved in the appropriate courts within the United States.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Contact</h2>
        <p className="mb-4">
          Questions about these Terms? Email <a href="mailto:legal@dogbreedsandneeds.com" className="underline hover:text-primary" data-testid="link-terms-email">legal@dogbreedsandneeds.com</a>.
        </p>
      </div>
    </div>
  );
}
