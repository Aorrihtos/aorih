export type Experience = {
  id: string;
  company: string;
  companyLogo?: string;
  position: string;
  employmentType: string;
  /** ISO date (YYYY-MM-DD). */
  startDate: string;
  /** ISO date (YYYY-MM-DD). Absent while the position is still current. */
  endDate?: string;
  description?: string;
  /** Rendered under the "Aptitudes" label; not necessarily technologies. */
  skills: string[];
};
