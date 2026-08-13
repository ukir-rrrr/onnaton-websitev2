import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SeatsHero } from "@/components/seats/SeatsHero";
import { SeatsFacts } from "@/components/seats/SeatsFacts";
import { SeatDetail } from "@/components/seats/SeatDetail";
import { SeatsGallery } from "@/components/seats/SeatsGallery";
import { seatList } from "@/lib/content/seats";
import { getLocale } from "@/lib/i18n/getLocale";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.seatsTitle),
    description: t(locale, copy.meta.seatsDesc),
  };
}

export default function SeatsPage() {
  return (
    <div className="relative w-full bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main>
        <SeatsHero />
        <SeatsFacts />
        {seatList.map((seat) => (
          <SeatDetail key={seat.id} seat={seat} />
        ))}
        <SeatsGallery />
      </main>

      <Footer />
    </div>
  );
}
