export const daysLeft = (deadline: number | bigint): number => {
  const deadlineTime =
    typeof deadline === "bigint" ? Number(deadline) : deadline;

  const difference = new Date(deadlineTime).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return Math.max(0, Math.ceil(remainingDays));
};

export const calculateBarPercentage = (
  goal: number,
  raisedAmount: number
): number => {
  if (goal <= 0) return 0;
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (
  url: any,
  callback: (isValid: boolean) => void
): void => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
