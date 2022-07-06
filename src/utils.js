export const numberFormatter = (value) => {
  if (value === 0) {
    return 0;
  }

  const digit = value > 1000 ? 0 : 1;

  return (value / 1000).toFixed(digit) + "K";
};
