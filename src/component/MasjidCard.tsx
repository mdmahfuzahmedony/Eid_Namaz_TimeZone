"use client";

interface MasjidCardProps {
  name: string;
  type: string;
  jamaat1: string;
  jamaat2?: string | null;
  districtName: string;
  upazilaName?: string;
  unionName?: string;
  gram?: string;
  imamName?: string | null;
  mapLink?: string | null;
  imageUrl?: string | null;
}

export default function MasjidCard({
  name, type, jamaat1, jamaat2,
  districtName, upazilaName, unionName, gram,
  imamName, mapLink, imageUrl,
}: MasjidCardProps) {
  const locationParts = [upazilaName, districtName].filter(Boolean).join(", ");
  const fullLocation = [gram, unionName, locationParts].filter(Boolean).join(", ");

  return (
    <div className="
      group relative flex flex-col overflow-hidden
      bg-background rounded-[14px]
      border border-foreground/[0.08]
      hover:border-primary hover:-translate-y-0.5
      transition-all duration-200
    ">

      {/* Image */}
    {/* Image */}
<div className="relative h-[120px] overflow-hidden flex-shrink-0 flex items-center justify-center"
  style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}
>
  {imageUrl ? (
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  ) : (
    <div className="flex flex-col items-center gap-1.5">
      <svg className="w-9 h-9 opacity-20 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7v2h1v11h5v-6h4v6h5V9h1V7L12 2zm0 2.5L20 9v1h-1v10h-3v-6H8v6H5V10H4V9l8-4.5z" />
      </svg>
      <span className="text-[9px] tracking-widest text-white/20">ছবি নেই</span>
    </div>
  )}

  {/* Badge — গাঢ় হলুদ টেক্সট, পড়তে সহজ */}
  <span className="absolute top-2.5 left-2.5 bg-primary text-yellow-900 text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px]">
    {type}
  </span>
</div>
      {/* Body */}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">

        {/* Name */}
        <h3 className="text-[13px] font-bold text-foreground leading-[1.45] line-clamp-2">
          {name}
        </h3>

        {/* Location */}
        {fullLocation && (
          <div className="flex items-center gap-1.5 text-[11px] text-foreground/40 overflow-hidden">
            <svg className="w-[11px] h-[11px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="truncate">{fullLocation}</span>
          </div>
        )}

        {/* Jamaat Times */}
        <div className="flex gap-2">
          <div className="
            flex-1 text-center rounded-[10px] px-2.5 py-2
            bg-amber-50 dark:bg-amber-950/30
            border border-amber-200/60 dark:border-amber-500/20
          ">
            <p className="text-[9px] font-semibold text-foreground/40 mb-0.5">১ম জামাত</p>
            <p className="text-[15px] font-extrabold text-amber-700 dark:text-amber-300 leading-none tracking-wide">
              {jamaat1}
            </p>
          </div>

          {jamaat2 && (
            <div className="
              flex-1 text-center rounded-[10px] px-2.5 py-2
              bg-amber-50 dark:bg-amber-950/30
              border border-amber-200/60 dark:border-amber-500/20
            ">
              <p className="text-[9px] font-semibold text-foreground/40 mb-0.5">২য় জামাত</p>
              <p className="text-[15px] font-extrabold text-amber-700 dark:text-amber-300 leading-none tracking-wide">
                {jamaat2}
              </p>
            </div>
          )}
        </div>

        {/* Imam */}
        {imamName && (
          <div className="
            flex items-center gap-1.5 text-[11px] text-foreground/50
            bg-foreground/[0.04] rounded-[8px] px-2.5 py-[7px]
          ">
            <svg className="w-[11px] h-[11px] flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            <span className="truncate">{imamName}</span>
          </div>
        )}

        {/* Map Link */}
        {mapLink && (
          <>
            <div className="h-px bg-foreground/[0.07]" />
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline mt-auto"
            >
              <svg className="w-[11px] h-[11px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              গুগল ম্যাপে দেখুন
            </a>
          </>
        )}

      </div>
    </div>
  );
}
