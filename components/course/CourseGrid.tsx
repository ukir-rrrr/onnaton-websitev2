import Image from "next/image";
import { courseList } from "@/lib/content/courses";
import { ReserveButton } from "@/components/ui/ReserveButton";

/** Full course cards — used on /course detail page. */
export function CourseGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {courseList.map((course) => (
        <div
          key={course.name}
          className="flex flex-col overflow-hidden rounded-sm border border-cream/10 bg-ink-raised"
        >
          <div className="h-[220px] overflow-hidden sm:h-[260px]">
            <Image
              src={course.photo}
              alt={course.name}
              width={640}
              height={260}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-7 sm:p-8">
            <h2 className="font-serif-jp mb-3 text-xl font-semibold text-cream sm:text-[23px]">
              {course.name}
            </h2>
            <p className="mb-5 text-xl font-semibold text-gold sm:text-[22px]">
              {course.price}
            </p>
            <div className="mb-4 flex flex-col gap-1.5 text-[13px] text-cream/85">
              <span>使用する肉：{course.meat}</span>
              <span>品数：{course.dishes}</span>
            </div>
            <p className="mb-5 flex-1 text-sm leading-[1.85] text-cream/92">
              {course.desc}
            </p>
            <p className="mb-6 text-[13px] leading-[1.7] text-cream/75">
              {course.note}
            </p>
            <ReserveButton variant="outline" className="min-h-11 w-full py-3.5 text-[14px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
