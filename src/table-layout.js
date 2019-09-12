/**
 * 计算分配宽度为默认值的列宽度, 分配的规则是，将不能整除的部分加再在index较小的元素上
 * @param totalWidth 总共要分配的宽度
 * @param totalColumn 总共要分配的列数
 * @param index 当前列的index
 * @return {number} 该列的宽度
 */
export function calcDefaultColumnWidth(totalWidth, totalColumn, index) {
  const commonWidth = Math.floor(totalWidth / totalColumn);
  const modWidth = totalWidth % totalColumn;
  return commonWidth + (index < modWidth ? 1 : 0);
}

export function getTableBodyHeight(rowHeight, dataLength) {
  return rowHeight * dataLength;
}

// 计算每列的宽度
// 如果column设置了width，则使用column的宽度
// 如果存在未设置宽度的列，则根据容器宽度与列总宽度的关系，设置其值
export function doColumnWidthLayout(tableWidth, columns) {
  // TODO 修改column默认width的获取方式
  const defaultColumnWidth = 80;
  let defaultWidthColumnCount = 0;
  let defaultColumnRestWidth = tableWidth;
  const totalColumnWidth = columns.reduce((totalWidth, column) => {
    let columnWidth = column.width;
    const { hasWidth } = column;
    if (!hasWidth) {
      defaultWidthColumnCount += 1;
      columnWidth = defaultColumnWidth;
    } else {
      defaultColumnRestWidth -= column.width;
    }
    return totalWidth + columnWidth;
  }, 0);

  let n = 0;
  return columns.map((column) => {
    const { hasWidth } = column;
    let { width } = column;
    if (!hasWidth) {
      if (totalColumnWidth <= tableWidth) {
        width = calcDefaultColumnWidth(defaultColumnRestWidth, defaultWidthColumnCount, n);
        n += 1;
      } else {
        width = defaultColumnWidth;
      }
    }
    return {
      ...column,
      width,
    };
  });
}
