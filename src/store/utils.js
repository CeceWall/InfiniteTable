export function isSameColumn(column1, column2) {
  if (!column1 || !column2 || !column1.label || !column2.label) {
    return false;
  }
  return column1.label === column2.label;
}
