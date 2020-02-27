<template>
  <div :id="chartID" class="dpk-over-under-chart" :style="'width:' + wide.toString() + 'px;height:' + high.toString() + 'px;'">
    <svg>
      <g v-for="(sr, i) in ratios" :key="'group'+i.toString()">
        <rect v-for="(r, j) in sr" :key="'bar-'+i.toString()+'-'+j.toString()" r="6" :x="getLiveBounds().x + (((getLiveBounds().width - (getLiveBounds().width / (values.length * 1.5))) / (values.length - 1))  * i) + ((j >= 2 ? ((getLiveBounds().width - (getLiveBounds().width / (values.length * 1.5))) / ratios.length) * 0.3 : 0))" :vas="r" :y="(r >= 0) ? ((getLiveBounds().height * 0.65) + getLiveBounds().y) - (r * (getLiveBounds().height * 0.65)) : (getLiveBounds().height * 0.65) + getLiveBounds().y" :height="(r >= 0 ? r : r * -1) * (getLiveBounds().height * 0.65)" :width="((getLiveBounds().width - (getLiveBounds().width / (values.length * 1.5))) / ratios.length) * (j >= 2 ? 0.4 : 0.6)" :fill="chartColors[j]"></rect>
      </g>
    </svg>
    <ul>

    </ul>
  </div>
</template>
<script>
import DPKBaseChart from './DPKBaseChart.js'
export default {
  extends: BaseChart
}
</script>
<style lang="scss" scoped>
.dpk-over-under-chart {
  svg {
    > line {
      stroke:#333333;
    }
    > g{
      > rect{
        opacity: .8;
      }
    }
  }
}
</style>
