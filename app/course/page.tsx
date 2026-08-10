import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExecutiveCourse } from "@/components/course/ExecutiveCourse";

export const metadata: Metadata = {
  title: "エグゼクティブコース | 恩納豚（おんなとん）",
  description:
    "もとぶ牛・あぐー豚を味わう恩納豚のエグゼクティブコース。お一人様 10,500円（税別）。完全予約制。",
};

export default function CoursePage() {
  return (
    <div className="relative w-full bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main>
        <ExecutiveCourse />
      </main>

      <Footer />
    </div>
  );
}
