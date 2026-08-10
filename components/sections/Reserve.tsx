import Image from "next/image";
import { photos } from "@/lib/content/photos";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function Reserve() {
  return (
    <section
      id="reserve"
      className="scroll-mt-24 relative min-h-[560px] w-full overflow-hidden text-center sm:aspect-[19/10] sm:min-h-0 sm:max-h-[90vh]"
    >
      <Image
        src={photos.reservation01}
        alt=""
        fill
        aria-hidden
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/75" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-16 sm:px-10 lg:px-14">
        <SectionEyebrow
          eyebrow="RESERVATION"
          heading="ご予約について"
          className="mb-8"
        />

        <p className="mx-auto mb-10 max-w-[720px] text-[14px] leading-[2] text-cream/80 sm:mb-12 sm:text-base">
          当店は完全予約制のコース料理専門店です。日本国内のお客様は、お電話にてご予約ください。ご希望の日時・人数・コースをお伝えいただければ、空席をご確認のうえご案内いたします。
        </p>
        <ReserveButton
          variant="outline"
          className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] sm:min-w-[320px] sm:w-auto sm:px-16"
        />
      </div>
    </section>
  );
}
