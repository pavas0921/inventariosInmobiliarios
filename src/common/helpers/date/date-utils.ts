export const calculateDemoEndDate = () => {
  const today = new Date();
  const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return endDate;
};
