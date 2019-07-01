<template>
  <div class="hello">
    <div style="width: 550px; height: 210px">
      <infinite-table :data="data">
        <infinite-table-column label="a" width="218">
          <template slot-scope="props">
            <div style="color: red">
              {{ props.row.a }}
            </div>
          </template>
        </infinite-table-column>
        <infinite-table-column label="b" />
        <infinite-table-column label="c" />
        <infinite-table-column label="d" />
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
      })),
    ])(100);
    return {
      data,
    };
  },
  props: {
    msg: String,
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
