export function RakumonLogo({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg
      aria-label="Rakumon brand mark"
      className={className}
      role="img"
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="128" height="128" rx="30" fill="#FFFFFF" />
      <rect x="8" y="8" width="112" height="112" rx="26" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
      <path
        d="M40 96V32h28.5c7.8 0 14 2 18.4 6.1 4.5 4 6.7 9.4 6.7 16.1 0 4.7-1.2 8.7-3.7 12.1-2.4 3.4-5.8 5.9-10.1 7.5L96 96H80.4L66.2 76.5H54.6V96H40Zm14.6-31.6h13c3.5 0 6.3-.9 8.2-2.6 2-1.7 3-4.1 3-7.2s-1-5.5-3-7.2c-2-1.7-4.7-2.5-8.2-2.5h-13v19.5Z"
        fill="#22C55E"
      />
    </svg>
  );
}
