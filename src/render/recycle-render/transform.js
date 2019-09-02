/* eslint-disable import/prefer-default-export */

/**
 * 使用当前块的index和offset，移动的距离，行高和总共的元素个数
 * 计算移动后的index和offset
 * @param anchorItem
 * @param delta
 * @param rowHeight
 * @param totalLength
 * @return {{offset: number, index: (*|number)}|*}
 */
export function calculateAnchorItem(anchorItem, delta, rowHeight, totalLength) {
  if (delta === 0 || totalLength === 0) {
    return anchorItem;
  }
  const { index, offset } = anchorItem;
  const realDelta = delta + offset;
  let nextOffset = 0;
  let nextIndex = index;
  if (delta < 0) {
    nextIndex = index + Math.floor(realDelta / rowHeight);
    if (nextIndex < 0) {
      nextIndex = 0;
      nextOffset = 0;
    } else if (realDelta >= 0) {
      nextOffset = realDelta % rowHeight;
    } else {
      nextOffset = rowHeight + (realDelta % rowHeight);
    }
  } else {
    nextIndex = index + Math.floor(realDelta / rowHeight);
    if (nextIndex >= totalLength) {
      nextIndex = totalLength - 1;
      nextOffset = 0;
    } else {
      nextOffset = realDelta % rowHeight;
    }
  }
  return {
    index: nextIndex,
    offset: nextOffset,
  };
}
