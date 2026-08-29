import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntlReservationForm } from "@/components/reserve/IntlReservationForm";
import { MultilineText } from "@/components/i18n/MultilineText";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SiteNotices } from "@/components/sections/SiteNotices";
import { photos } from "@/lib/content/photos";
import { getLocale } from "@/lib/i18n/getLocale";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.intlReserveTitle),
    description: t(locale, copy.meta.intlReserveDesc),
  };
}

function policyBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function IntlReservePage() {
  const locale = await getLocale();
  const policies = policyBullets(t(locale, copy.intlForm.policyItems));

  return (
    <div className="relative w-full overflow-x-clip bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main>
        <section className="relative min-h-[280px] w-full overflow-hidden sm:min-h-[590px]">
          <Image
            src={photos.tennai06}
            alt=""
            fill
            aria-hidden
            sizes="100vw"
            className="object-cover object-[50%_21%]"
            priority
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-16">
            <SectionEyebrow
              eyebrow="RESERVATION"
              heading={t(locale, copy.intlForm.heading)}
              as="h1"
              tone="onDark"
            />
          </div>
        </section>

        <SiteNotices />

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:gap-12">
            <p className="text-center font-serif-jp text-[17px] font-medium tracking-[0.08em] text-cream sm:text-[19px]">
              {t(locale, copy.intlForm.closed)}
            </p>

            <p className="border-y border-cream/12 py-8 text-center text-[14px] leading-[2] tracking-[0.04em] text-cream/80 sm:text-[15px] sm:leading-[2.1]">
              <MultilineText text={t(locale, copy.intlForm.phoneNotice)} />
            </p>

            <div>
              <h2 className="font-serif-jp mb-6 text-center text-[20px] tracking-[0.12em] text-cream sm:text-[22px]">
                {t(locale, copy.intlForm.policyHeading)}
              </h2>
              <ul className="mx-auto max-w-2xl list-disc space-y-3 pl-5 text-[14px] leading-[2] tracking-[0.04em] text-cream/85 sm:text-[15px]">
                {policies.map((item) => (
                  <li key={item}>
                    <MultilineText text={item} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-cream/10 bg-ink-raised px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <IntlReservationForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
