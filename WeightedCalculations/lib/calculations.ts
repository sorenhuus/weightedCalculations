/**
 * Calculate the product of two numbers
 * @param x - First number (as string)
 * @param y - Second number (as string)
 * @returns The product of x and y, or 0 if inputs are invalid
 */
export const calculateRowSum = (x: string, y: string): number => {
  const xNum = parseFloat(x) || 0;
  const yNum = parseFloat(y) || 0;
  return xNum * yNum;
};

/**
 * Calculate the total sum of all rows
 * @param rows - Array of row objects with x and y properties
 * @returns The sum of all row calculations
 */
export const calculateTotal = (
  rows: Array<{ x: string; y: string }>
): number => {
  return rows.reduce((sum, row) => {
    return sum + calculateRowSum(row.x, row.y);
  }, 0);
};
