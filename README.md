# infinite-table

## Props

| 属性名              | 类型                                      |      | 说明                                    | 默认值 |
| ------------------- | ----------------------------------------- | ---- | --------------------------------------- | ------ |
| data                | Array                                     |      | 要展示的列表内容                        |        |
| height              | [Number, String]                          | 是   | 定义表格的高度，可以使用数组或css来设置 |        |
| headerHeight        | Number                                    | 否   | 定义表头的高度，可以使用数字            | 48     |
| rowHeight           | Number                                    | 否   | 定义每行的行高，暂不支持动态行高        | 48     |
| rowKey              | String                                    | 是   | 区别每行的key                           |        |
| striped             | Boolean                                   | 否   | 是否采用明暗间隔的行                    | true   |
| highlightCurrentRow | Boolean                                   | 否   | 是否高亮选中的行                        | true   |
|                     | [`function(rowItem, rowIndex)`, `Object`] | 否   | 渲染行时，而外添加的class和attrs        |        |



