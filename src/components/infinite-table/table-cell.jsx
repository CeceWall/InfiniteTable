// 支持
export default {
  name: 'table-cell',
  props: {
    cellTag: {
      type: String,
      default: 'td',
    },
    ellipsisHover: {
      type: Boolean,
      default: false,
    },
    ellipsisHoverRender: {
      type: Function,
      default: null,
    },
    resizable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHoverItemVisible: false,
    };
  },
  methods: {
    handleMouseMove(evt) {
    },
    handleMouseEnter() {
      const { cellContent } = this.$refs;
      const { offsetWidth, scrollWidth } = cellContent;
      if (offsetWidth < scrollWidth && this.ellipsisHover) {
        this.isHoverItemVisible = true;
      }
    },
    handleMouseLeave() {
      this.isHoverItemVisible = false;
    },
    getEllipsisHoverRender() {
      return this.ellipsisHoverRender || (<div>{this.$slots.default}</div>);
    },
  },
  render(h) {
    const {
      cellTag, $slots, getEllipsisHoverRender, isHoverItemVisible,
    } = this;
    return (
      <cellTag
        class="infinite-table__cell"
        on-mousemove={this.handleMouseMove}
        on-mouseenter={this.handleMouseEnter}
        on-mouseleave={this.handleMouseLeave}
      >
        <div ref="cellContent" class="cell-content">
          {$slots.default}
        </div>
        {
          isHoverItemVisible && (
            <div class="cell-hover-content">
              {getEllipsisHoverRender()}
            </div>
          )
        }
      </cellTag>
    );
  },
};
