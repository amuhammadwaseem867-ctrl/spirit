import { redirect } from "next/navigation";

/**
 * /product is a landing point — the real product
 * experiences live at /product/[slug]. Send visitors
 * to the CORE PERFORMANCE piece by default.
 */
export default function ProductIndexPage() {
  redirect("/product/core-performance");
}