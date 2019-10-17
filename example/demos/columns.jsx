export default [
  {
    label: '日期',
    sortable: true,
    comparator: (a, b) => a.address.localeCompare(b),
    render: (h, { row, options }) => <div style="color: yellow">{row.date}</div>,
  },
  {
    label: '名称',
    render: (h, { row, options }) => <div>{row.name}</div>,
  },
  {
    label: '地址',
    prop: 'address',
  },
];
