interface HasCreatedAt {
  created_at: string;
}

export const filterLeadsByDateRange = <T extends HasCreatedAt>(
  data: T[],
  startDate: Date,
  endDate: Date
): T[] =>
  data.filter((item) => {
    const date = new Date(item.created_at);
    return date >= startDate && date <= endDate;
  });

const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return Math.round(((current - previous) / previous) * 100);
};

export interface MetricProps<T> {
  currentPeriod: T[];
  previousPeriod: T[];
  percentageChange: number;
}

export const getMetrics = <T extends HasCreatedAt>(
  data: T[] | null,
  period: "week" | "month"
): MetricProps<T> => {
  if (!data)
    return {
      currentPeriod: [],
      previousPeriod: [],
      percentageChange: 0,
    };

  const now = new Date();
  let startCurrentPeriod, startPreviousPeriod, endPreviousPeriod;

  if (period === "week") {
    startCurrentPeriod = new Date(now.getTime());
    startCurrentPeriod.setDate(now.getDate() - 7);
    startPreviousPeriod = new Date(now.getTime());
    startPreviousPeriod.setDate(now.getDate() - 14);
    endPreviousPeriod = new Date(now.getTime());
    endPreviousPeriod.setDate(now.getDate() - 7);
  } else if (period === "month") {
    startCurrentPeriod = new Date(now.getTime());
    startCurrentPeriod.setDate(now.getDate() - 30);
    startPreviousPeriod = new Date(now.getTime());
    startPreviousPeriod.setDate(now.getDate() - 60);
    endPreviousPeriod = new Date(now.getTime());
    endPreviousPeriod.setDate(now.getDate() - 30);
  } else {
    throw new Error("Invalid period");
  }

  const currentPeriod = filterLeadsByDateRange(data, startCurrentPeriod, now);
  const previousPeriod = filterLeadsByDateRange(
    data,
    startPreviousPeriod,
    endPreviousPeriod
  );

  const percentageChange = calculatePercentageChange(
    currentPeriod.length,
    previousPeriod.length
  );

  return {
    currentPeriod: currentPeriod,
    previousPeriod: previousPeriod,
    percentageChange,
  };
};
