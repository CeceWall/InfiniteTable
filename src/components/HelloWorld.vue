<template>
  <div class="hello" style="height: 100%;">
    <div style="width: 100%; height: 100%">
      <infinite-table
        ref="table" :data="data" height="100%" :highlight-row="highlightRow" :row-class-name="rowClassName"
        header-height="60px" row-height="40px"
      >
        <infinite-table-column label="a" width="418" />
        <infinite-table-column label="b" width="124px">
          <template slot-scope="props">
            <span style="color: red" title="123">
              {{ '21095-56-5' }}
            </span>
          </template>
        </infinite-table-column>
        <infinite-table-column label="c" />
        <infinite-table-column label="d" width="128" />
        <infinite-table-column label="e" width="158" />
        <infinite-table-column label="f" width="128" />
        <infinite-table-column label="g" width="128" />
        <infinite-table-column label="h" width="128" />
        <infinite-table-column label="i" width="128" />
        <infinite-table-column label="j" width="128" />
        <infinite-table-column label="k" width="128" />
        <infinite-table-column label="l" width="128" />
        <infinite-table-column label="m" width="128" />
        <infinite-table-column label="n" width="128" />
        <infinite-table-column label="o" width="128" />
        <infinite-table-column label="p" width="128" />
        <infinite-table-column label="q" width="128" />
        <infinite-table-column label="r" width="128" />
        <infinite-table-column label="s" width="128" />
        <infinite-table-column label="t" width="128" />
        <infinite-table-column label="u" width="128" />
        <infinite-table-column label="v" width="128" />
        <infinite-table-column label="w" width="128" />
        <infinite-table-column label="x" width="128" />
        <infinite-table-column label="y" width="128" />
        <infinite-table-column label="z" width="128" />
        <infinite-table-column label="aa" width="128" />
      </infinite-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import fp from 'lodash/fp';
import InfiniteTable from './infinite-table/table.vue';
import InfiniteTableColumn from './infinite-table/table-column';

export default {
  name: 'HelloWorld',
  components: {
    InfiniteTable,
    InfiniteTableColumn,
  },
  data() {
    const data = _.flow([
      _.times,
      fp.map((item, index) => ({
        a: `${item}-${index}`,
        b: `${item}-${index}`,
        c: `${item}-${index}`,
        d: `${item}-${index}`,
        e: `${item}-${index}`,
        f: `${item}-${index}`,
        g: `${item}-${index}`,
        h: `${item}-${index}`,
        i: `${item}-${index}`,
        j: `${item}-${index}`,
        k: `${item}-${index}`,
        l: `${item}-${index}`,
        m: `${item}-${index}`,
        n: `${item}-${index}`,
        o: `${item}-${index}`,
        p: `${item}-${index}`,
        q: `${item}-${index}`,
        r: `${item}-${index}`,
        s: `${item}-${index}`,
        t: `${item}-${index}`,
        u: `${item}-${index}`,
        v: `${item}-${index}`,
        w: `${item}-${index}`,
        x: `${item}-${index}`,
        y: `${item}-${index}`,
        z: `${item}-${index}`,
        aa: `${item}-${index}`,
      })),
    ])(1000);

    return {
      data,
      highlightRow: true,
    };
  },
  mounted() {
    let n = 0;
    setInterval(() => {
      if (n < this.data.length) {
        // this.$refs.table.selectRow(this.data[n]);
        n += 1;
      }
    }, 1000);
  },
  props: {
    msg: String,
  },
  methods: {
    rowClassName(rowData) {
      const index = this.data.indexOf(rowData);
      return index % 2 === 0 ? 'even' : 'odd';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
