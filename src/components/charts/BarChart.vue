<template>
  <div :id="chartID" class="dpk-bar-chart" :style="'width:' + wide.toString() + 'px;height:' + high.toString() + 'px;'">
    <svg>
      <path v-for="(rat, i) in ratios" :key="'bar-'+i.toString()" :d="renderPath(rat, i)" :fill="chartColors[0]"></path>
      <line x1="0" x2="3000" :y1="getLiveHeight() + 1" :y2="getLiveHeight() + 1" stroke="#000000"></line>
      <line v-for="(label, i) in sideLabels" :key="'sl='+i.toString()" x1="0" x2="3000" :y1="((getLiveHeight() / sideLabels.length) * i) + 1" :y2="((getLiveHeight() / sideLabels.length) * i) + 1" stroke="#000000"></line>
    </svg>
    <ul class="side-labels-container">
      <li v-for="(label, i) in sideLabels" :key="'side-'+i.toString()" :style="'top:' + (getLiveHeight() - (getLiveHeight() * ((chartMax * (i + 1)) / (chartMax * (sideLabels.length))))).toString() + 'px;'">{{chartMax * (i + 1)}}</li>
    </ul>
    <ul class="label-container">
      <li v-for="(val, i) in values" :key="'label_' + i.toString()" :style="'top:0;left:' + ((wide / values.length) * i).toString() + 'px;width:' + (wide / values.length).toString() + 'px;'" v-html="val.label">
      </li>
    </ul>
  </div>
</template>
<script>
// import Utilties from '../../utilities/Utilities.js'
import DPKBaseChart from './DPKBaseChart.js'
export default {
  extends: DPKBaseChart,
  methods: {
    renderPath: function (ratio, index) {
      let self = this
      let barWidth = (self.$data.wide / self.values.length) * 0.6
      let offset = (self.$data.wide / (self.values.length)) * (index + 0.5)
      let points = []
      let bottom = self.getLiveHeight()
      points.push({x: offset - (barWidth / 2), y: bottom})
      points.push({x: offset + (barWidth / 2), y: bottom})
      points.push({x: offset + (barWidth / 2), y: bottom - (bottom * ratio)})
      points.push({x: offset - (barWidth / 2), y: bottom - (bottom * ratio)})
      let pathString = ''
      for (let i = 0; i < points.length; i++) {
        pathString += i === 0 ? 'M ' : ' L '
        pathString += points[i].x.toString() + ' ' + points[i].y.toString()
      }
      pathString += ' Z'
      return pathString
    }
  }
}
</script>
<style lang="scss" scoped>
.dpk-bar-chart{
  ul.side-labels-container{
    position:absolute;
    top:0;
    left:0;
    padding:0;
    margin:0;
    > li{
      display:block;
      position: absolute;
      padding: 0;
      margin:0;
    }
  }
  > ul.label-container{
    position:absolute;
    bottom: 0;
    left: 0;
    right:0;
    height: 30px;
    padding: 2px 0 0 0;
    margin:0;
    > li{
      position: absolute;
      text-align: center;
      display: block;
      padding: 6px 0 0 0;
      margin:0;
    }
  }
}
</style>
