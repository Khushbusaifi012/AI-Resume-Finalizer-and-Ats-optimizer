export function scoreRating(score: number): {
  label: string;
  description: string;
  className: string;
} {
  if (score >= 85) {
    return {
      label: "Excellent",
      description: "Your resume is highly ATS-ready",
      className:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    };
  }
  if (score >= 70) {
    return {
      label: "Good",
      description: "Solid foundation with room to polish",
      className:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
    };
  }
  if (score >= 50) {
    return {
      label: "Fair",
      description: "A few improvements will boost your score",
      className:
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    };
  }
  return {
    label: "Needs work",
    description: "Focus on structure and keywords first",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
  };
}
