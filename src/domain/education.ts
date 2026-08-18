export type Education = {
  id: string;
  institution: string;
  degree: string;
  logo?: string;
  /** ISO date (YYYY-MM-DD). */
  startDate: string;
  /** ISO date (YYYY-MM-DD). Absent while the studies are still ongoing. */
  endDate?: string;
  description: string;
};
