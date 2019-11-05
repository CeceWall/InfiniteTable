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

export const NotifyMixin = {
  methods: {
    notify(componentName, eventName, ...params) {
      let parent = this.$parent || this.$root;
      let { name } = parent.$options;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
  },
};
