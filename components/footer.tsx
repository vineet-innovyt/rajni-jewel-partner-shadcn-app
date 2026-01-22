import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Jewel. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link
              href="/partner/about#privacy"
              className="hover:text-primary transition"
            >
              Privacy
            </Link>
            <Link
              href="/partner/about#terms"
              className="hover:text-primary transition"
            >
              Terms
            </Link>
            <Link
              href="/partner/about#contact"
              className="hover:text-primary transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
