/**
 * 用于顶级组件抛出事件
 */
export default class EventEmitter {
  constructor(vm) {
    this.vm = vm;
  }

  dispatch(event, ...payload) {
    this.vm.$emit.apply(this.vm, [event, ...payload]);
  }
}
