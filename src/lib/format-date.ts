const parts = (iso: string) => iso.split('-');

/** `2021-08-01` -> `08/2021`, the format the original portfolio used. */
export const formatMonthYear = (iso: string): string => {
  const [year = '', month = ''] = parts(iso);
  return `${month}/${year}`;
};

/** `2021-08-01`, `2023-06-01` -> `08/2021 -> 06/2023`. */
export const formatPeriod = (startDate: string, endDate?: string): string =>
  `${formatMonthYear(startDate)} -> ${endDate ? formatMonthYear(endDate) : 'Present'}`;

/** `2024-05-12` -> `12/05/2024`. */
export const formatDay = (iso: string): string => {
  const [year = '', month = '', day = ''] = parts(iso);
  return `${day}/${month}/${year}`;
};
