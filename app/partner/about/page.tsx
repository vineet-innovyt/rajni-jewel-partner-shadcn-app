"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth-context";

export default function InfoPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("privacy");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }

    // Handle hash-based navigation
    const hash = window.location.hash.slice(1) || "privacy";
    if (["privacy", "terms", "contact"].includes(hash)) {
      setActiveSection(hash);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Section Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => {
              setActiveSection("privacy");
              window.history.pushState(null, "", "/info#privacy");
            }}
            className={`pb-4 px-4 font-medium transition ${
              activeSection === "privacy"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => {
              setActiveSection("terms");
              window.history.pushState(null, "", "/info#terms");
            }}
            className={`pb-4 px-4 font-medium transition ${
              activeSection === "terms"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => {
              setActiveSection("contact");
              window.history.pushState(null, "", "/info#contact");
            }}
            className={`pb-4 px-4 font-medium transition ${
              activeSection === "contact"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Contact Us
          </button>
        </div>

        {/* Privacy Policy Section */}
        {activeSection === "privacy" && (
          <div id="privacy" className="max-w-3xl space-y-6 animate-fadeIn">
            <h1 className="text-4xl font-bold text-foreground">
              Privacy Policy
            </h1>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Jewel, we are committed to protecting your privacy and
                ensuring you have a positive experience on our website. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website and use
                our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly such as when you
                create an account, make a purchase, or contact us. This includes
                your name, email address, phone number, shipping address, and
                payment information. We also automatically collect certain
                information about your device and how you interact with our
                website, including IP address, browser type, and pages visited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to provide, maintain, and
                improve our services, process transactions, send transactional
                and promotional communications, and comply with legal
                obligations. Your information helps us personalize your shopping
                experience and provide better customer service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                4. Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information with trusted
                service providers who assist us in operating our website and
                conducting our business, subject to confidentiality agreements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                5. Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                security system is impenetrable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                6. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at privacy@jewel.com or visit our Contact page for
                more information.
              </p>
            </section>
          </div>
        )}

        {/* Terms of Service Section */}
        {activeSection === "terms" && (
          <div id="terms" className="max-w-3xl space-y-6 animate-fadeIn">
            <h1 className="text-4xl font-bold text-foreground">
              Terms of Service
            </h1>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                2. Use License
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Jewel's website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on the website
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                3. Disclaimer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on Jewel's website are provided "as is". Jewel
                makes no warranties, expressed or implied, and hereby disclaims
                and negates all other warranties including, without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                4. Limitations
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Jewel or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Jewel's website, even
                if Jewel or an authorized representative has been notified
                orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                5. Accuracy of Materials
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on Jewel's website could include
                technical, typographical, or photographic errors. Jewel does not
                warrant that any of the materials on its website are accurate,
                complete, or current. Jewel may make changes to the materials
                contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                6. Links
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Jewel has not reviewed all of the sites linked to its website
                and is not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by Jewel of
                the site. Use of any such linked website is at the user's own
                risk.
              </p>
            </section>
          </div>
        )}

        {/* Contact Us Section */}
        {activeSection === "contact" && (
          <div id="contact" className="max-w-3xl space-y-6 animate-fadeIn">
            <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Get in Touch
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We'd love to hear from you! Whether you have questions about our
                products, need assistance with your order, or want to provide
                feedback, please don't hesitate to reach out. Our team is here
                to help.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Contact Information
              </h2>
              <div className="space-y-4 bg-card border border-border rounded-lg p-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="mailto:support@jewel.com"
                      className="hover:text-primary transition"
                    >
                      support@jewel.com
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    General inquiries and customer support
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="tel:+1-800-JEWEL-99"
                      className="hover:text-primary transition"
                    >
                      +1 (800) JEWEL-99
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monday - Friday, 9 AM - 6 PM EST
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Address
                  </h3>
                  <p className="text-muted-foreground">
                    Jewel Headquarters
                    <br />
                    123 Diamond Avenue
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Business Hours
              </h2>
              <div className="bg-secondary/50 rounded-lg p-6 space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Quick Links
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/products" className="text-primary hover:underline">
                  Shop All Products
                </Link>
                <Link href="/cart" className="text-primary hover:underline">
                  View Cart
                </Link>
                <Link href="/orders" className="text-primary hover:underline">
                  View Orders
                </Link>
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
