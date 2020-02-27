<template>
  <div :id="chartID" class="dpk-line-chart" :style="'width:' + wide.toString() + 'px;height:' + high.toString() + 'px;'">
    <svg>
      <line v-for="(v, i) in values" :key="'line-'+i.toString()" :x1="getLiveBounds().x + ((getLiveBounds().width / (values.length - 1))  * i)" :x2="getLiveBounds().x + ((getLiveBounds().width / (values.length - 1))  * i)" :y1="getLiveBounds().y" :y2="getLiveBounds().height + getLiveBounds().y"></line>
      <g v-for="(sr, i) in ratios" :key="'group'+i.toString()">
        <circle v-for="(r, j) in sr" :key="'circle-'+i.toString()+'-'+j.toString()" r="6" :cx="getLiveBounds().x + ((getLiveBounds().width / (values.length - 1))  * i)" :vas="r" :cy="(getLiveBounds().height + getLiveBounds().y) - (r * getLiveBounds().height)" :fill="chartColors[j]"></circle>
        <line v-for="(r, j) in sr" :key="'line-'+i.toString()+'-'+j.toString()" v-if="i > 0" :x1="getLiveBounds().x + ((getLiveBounds().width / (values.length - 1))  * i)" :x2="getLiveBounds().x + ((getLiveBounds().width / (values.length - 1))  * (i - 1))" :y1="(getLiveBounds().height + getLiveBounds().y) - (r * getLiveBounds().height)" :y2="(getLiveBounds().height + getLiveBounds().y) - (ratios[i - 1][j] * getLiveBounds().height)" :stroke="chartColors[j]"></line>
      </g>
    </svg>
    <ul>

    </ul>
  </div>
</template>
<script>
import DPKBaseChart from './DPKBaseChart.js'
export default {
  extends: DPKBaseChart
}
</script>
<style lang="scss" scoped>
.dpk-line-chart {
  svg {
    > line {
      stroke:#333333;
    }
  }
}
</style>
