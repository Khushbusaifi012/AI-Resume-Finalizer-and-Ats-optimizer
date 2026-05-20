export default function WaveDivider() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 w-full translate-y-px text-slate-100 dark:text-slate-950"
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="block h-10 w-full sm:h-14 lg:h-16"
      >
        <path
          fill="currentColor"
          d="M0,48 C240,96 480,8 720,48 C960,88 1200,16 1440,56 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
}
