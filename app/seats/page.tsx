import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SeatsHero } from "@/components/seats/SeatsHero";
import { SeatDetail } from "@/components/seats/SeatDetail";
import { seatList } from "@/lib/content/seats";

export const metadata: Metadata = {
  title: "お席について | 恩納豚（おんなとん）",
  description:
    "お座敷・テーブル席・個室など、恩納豚のお席のご案内です。完全予約制。",
};

export default function SeatsPage() {
  return (
    <div className="relative w-full bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main>
        <SeatsHero />
        {seatList.map((seat) => (
          <SeatDetail key={seat.id} seat={seat} />
        ))}
      </main>

      <Footer />
    </div>
  );
}
