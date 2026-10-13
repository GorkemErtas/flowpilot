type IconName =
  "arrow" | "check" | "spark" | "grid" | "brain" | "chart" | "menu" | "close";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  check: <path d="m5 12 4.2 4L19 6.5" />,
  spark: (
    <path d="m12 3 1.5 5.8L19 10.5l-5.5 1.7L12 18l-1.5-5.8L5 10.5l5.5-1.7L12 3Z" />
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  brain: (
    <path d="M9 5.3A3.7 3.7 0 0 0 3.7 8.6a3.3 3.3 0 0 0 .6 6.4A4 4 0 0 0 8 19.5M15 5.3a3.7 3.7 0 0 1 5.3 3.3 3.3 3.3 0 0 1-.6 6.4 4 4 0 0 1-3.7 4.5M12 3v18M8.5 9.5l3.5 2 3.5-2M8.5 15l3.5-2 3.5 2" />
  ),
  chart: (
    <>
      <path d="M4 19V5m0 14h16" />
      <path d="m7 15 4-4 3 2 5-6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
