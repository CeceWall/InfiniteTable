let id = 0;

export function getTableId() {
  id += 1;
  return id;
}

export function isComponent(vnode, name) {
  return vnode.componentOptions && vnode.componentOptions.Ctor.options.name === name;
}
