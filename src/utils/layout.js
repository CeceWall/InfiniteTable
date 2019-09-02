let scrollBarWidth;

/**
 * 获取当前页面中滚动条的宽度
 * @return {number|*}
 */
export function getScrollWidth() {
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  const outer = document.createElement('div');
  outer.className = 'scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
}

/**
 * 自动给数字添加px单位
 * 如果参数不是数字，那么原样返回
 * @param number 要添加px单位的数字
 * @return {string|*}
 */
export function num2px(number) {
  if (typeof number === 'number' && !Number.isNaN(number)) {
    return `${number}px`;
  }
  return number;
}

export function px2num(str) {
  const num = parseFloat(str);
  if (Number.isNaN(num)) {
    return 0;
  }
  return num;
}

/**
 * 获取clientHeight和clientWidth
 * @param {HTMLElement} el;
 */
export function getClientSize(el) {
  if (el instanceof HTMLElement) {
    const height = el.clientHeight;
    const width = el.clientWidth;
    return {
      height,
      width,
    };
  }
  console.error('getClientSize错误: el不是HTMLElement对象');
  return null;
}
