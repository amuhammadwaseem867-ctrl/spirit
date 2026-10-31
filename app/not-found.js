import PageHero from "@/components/PageHero";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main>
      <PageHero
        index="404"
        label="ERROR"
        title={["404 —", "NOTHING HERE."]}
        outline={[1]}
        intro="The page you are looking for does not exist, or has moved somewhere else."
      >
        <Link href="/" className="btn btn-solid" data-magnetic="0.25">
          <span className="btn-label">Return home</span>
          <span className="btn-icon">
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </span>
        </Link>
        <Link href="/shop" className="link-line">
          Shop the system
        </Link>
      </PageHero>
    </main>
  );
}
