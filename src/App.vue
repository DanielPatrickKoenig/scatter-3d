<template>
  <div>
    <sp3d class="prespectiv-view" v-if="shouldRender" :chartdata="chartData" :perspective="40" :distfactor="3" :signature="signature" :colors="colors" :labels="metricNames" :select="showSubCharts" v-on:point-selection="pointClicked" v-on:data-update="onDataUpdated"></sp3d>
    <div class="subcharts-container" v-if="showSubCharts">
      <div>
        <h3>
          {{featurNames.split(',')[selectedIndex]}}
        </h3>
        <ul>
          <!-- <li>
            <a v-on:click="showSubCharts = false;">close</a>
          </li> -->
        </ul>
        <div v-if="chartData.length > 0">
          <!-- <piechart :chartdata="subChartData.pie" :colors="colors" textcolor="#333333" title="" hovertitle="" :scale="1"></piechart>
          <barchart :chartdata="subChartData.bar" :colors="colors" textcolor="#333333" title="" hovertitle="" :scale="1"></barchart> -->
          <dpkbarchart :values="subChartData.dpkBar" uid="n"></dpkbarchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from './components/EventBus.js'
import ThreeRendering from './components/ThreeRendering.vue'
import LayerList from './components/LayerList.vue'
import ThreeObjectEditor from './components/ThreeObjectEditor.vue'
import ScatterPlot3D from './components/ScatterPlot3D.vue'
import {ObjectTypes} from './components/ObjectTypes.js'
import {AxisTypes} from './components/AxisTypes.js'
import ChartPie from './components/charts/ChartPie.vue'
import ChartBar from './components/charts/ChartBar.vue'
import BarChart from './components/charts/BarChart.vue'
import Utilties from './components/utils/Utilities.js'
export default {
  components: {
    threerender: ThreeRendering,
    layers: LayerList,
    editor: ThreeObjectEditor,
    sp3d: ScatterPlot3D,
    barchart: ChartBar,
    piechart: ChartPie,
    dpkbarchart: BarChart
  },
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      ObjectTypes: ObjectTypes,
      AxisTypes: AxisTypes,
      tempData: {
        active: false,
        objId: -1,
        objData: {}
      },
      objectManifest: [
        {type: ObjectTypes.CYLINDER, position: {x: 2, y: 5, z: -26}, rotation: {x: 0, y: 22, z: 0}, scale: {x: 6, y: 5, z: 1}, ratio: 0.3},
        {type: ObjectTypes.CONE, position: {x: 10, y: -10, z: -16}, rotation: {x: 0, y: -50, z: 0}, scale: {x: 4, y: 4, z: 1}},
        {type: ObjectTypes.BOX, position: {x: -1, y: 0, z: -11}, rotation: {x: 0, y: -40, z: 0}, scale: {x: 4, y: 3, z: 2}},
        {type: ObjectTypes.SPHERE, position: {x: 3, y: 2, z: -11}, rotation: {x: 0, y: -40, z: 0}, scale: {x: 4, y: 3, z: 2}}
      ],
      centers: {x: 50, y: 50},
      canRenderViewports: true,
      signature: 0,
      chartData: [],
      showSubCharts: true,
      subChartData: {},
      metricNames: ['X Axis', 'Y Axis', 'Z Axis', 'Size', '???'],
      featurNames: 'Color,Overall appearance,Trunk,Spare tire,Gas cap,Doors,Running boards,Ease of entry and exit,Layout of the dashboard,Location of cup holders,Space for electronics and other items,Glove box,Visibility,Comfort,Roominess,How the car handles,Smoothness of the ride,Cabin noise,Braking system,Ease of acceleration,Sound system,Navigation system,Backup camera,Bluetooth capability',
      colors: Utilties.ChartColors,
      selectedIndex: -1,
      laodedData: null
    }
  },
  computed: {
    shouldRender: function () {
      var self = this
      return self.$data.canRenderViewports && self.$data.objectManifest !== null && self.$data.objectManifest !== undefined
    }
  },
  methods: {
    onDataUpdated: function (e) {
      let self = this
      self.$data.chartData = e
    },
    pointClicked: function (e) {
      let self = this
      self.$data.showSubCharts = false
      setTimeout(function (_self) {
        let cs = {}
        let customCS = []
        let selectedCS = {}
        self.$data.selectedIndex = e.index
        for (let i = 0; i < _self.$data.chartData.length; i++) {
          cs[_self.$data.metricNames[i]] = _self.$data.chartData[i][e.index]
          customCS.push({label: document.querySelector('#display-label-' + i.toString() + ' > span:last-child').innerHTML.split(' &gt; ').join('<br />'), value: _self.$data.chartData[i][e.index]})
        }
        for (let j = 0; j < e.metricIndexes.length; j++) {
          selectedCS[_self.$data.metricNames[e.metricIndexes[j]]] = _self.$data.chartData[e.metricIndexes[j]][e.index]
        }
        _self.$data.subChartData = {bar: cs, pie: selectedCS, dpkBar: customCS}
        _self.$data.showSubCharts = true
      }, 10, self)
    },
    addObject: function (e) {
      var self = this
      self.$data.objectManifest.push(JSON.parse(JSON.stringify(self.$data.tempData.objData)))
      self.$data.tempData.objData = {}
      self.$data.tempData.objId = -1
      self.$data.tempData.active = false
      self.rerenderViewports()
      // console.log(self.$data.objectManifest)
    },
    cancelAdd: function (e) {
      var self = this
      self.$data.tempData.objData = {}
      self.$data.tempData.objId = -1
      self.$data.tempData.active = false
    },
    typeSelectorChange: function (e) {
      var self = this
      // console.log('############### selected ##################')
      if (self.$data.tempData.objId >= 0) {
        var selectedObjectType = {}
        for (var o in ObjectTypes) {
          if (ObjectTypes[o].id === self.$data.tempData.objId) {
            selectedObjectType = JSON.parse(JSON.stringify(ObjectTypes[o])).template
            selectedObjectType.type = ObjectTypes[o]
          }
        }
        // console.log(selectedObjectType)
        self.$data.tempData.objData = selectedObjectType
      }
    },
    getQuatStyle: function (isLeft, isTop) {
      var self = this
      var left = isLeft ? 0 : self.$data.centers.x
      var top = isTop ? 0 : self.$data.centers.y
      var width = isLeft ? self.$data.centers.x : 100 - self.$data.centers.x
      var height = isTop ? self.$data.centers.y : 100 - self.$data.centers.y
      return 'left:' + left + '%;top:' + top + '%;width:' + width + '%;height:' + height + '%;'
    },
    rerenderViewports: function () {
      var self = this
      self.$data.canRenderViewports = false
      setTimeout(function () {
        self.$data.canRenderViewports = true
      }, 10)
    },
    updateViewports: function () {
      var self = this
      self.$data.signature += 1
      if (self.$data.signature > 20) {
        self.$data.signature = 0
      }
    },
    getTypeLabel: function (t) {
      return t.label
    },
    saveClicked: function (e) {
      // var self = this
      // console.log(JSON.stringify(self.$data.objectManifest))
    },
    deleteClicked: function (n) {
      var self = this
      self.$data.objectManifest.splice(n, 1)
      self.rerenderViewports()
    },
    createChartData: function () {
      let self = this
      let valueCount = self.$data.featurNames.split(',').length
      let metrics = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']
      for (let i = 0; i < metrics.length; i++) {
        let metrickValues = []
        for (let j = 0; j < valueCount; j++) {
          metrickValues.push(Math.random() * 5)
        }
        self.$data.chartData.push(metrickValues)
      }
    }
  },
  mounted: function () {
    var self = this
    // self.createChartData()
    // window.addEventListener('resize', function () {
    //   self.rerenderViewports()
    // })
    EventBus.$on('wireframe-drag-element', (n) => {
      // console.log(n)
      switch (n.axis) {
        case AxisTypes.X: {
          self.$data.objectManifest[n.index].position.z = n.x / n.scale
          self.$data.objectManifest[n.index].position.y = (n.y / n.scale)
          break
        }
        case AxisTypes.Y: {
          self.$data.objectManifest[n.index].position.x = n.x / n.scale
          self.$data.objectManifest[n.index].position.z = n.y / n.scale
          break
        }
        case AxisTypes.Z: {
          self.$data.objectManifest[n.index].position.x = n.x / n.scale
          self.$data.objectManifest[n.index].position.y = (n.y / n.scale)
          break
        }
      }
      self.updateViewports()
    })
    EventBus.$on('wireframe-rotate-element', (n) => {
      // console.log(self.$data.objectManifest[n.index])
      switch (n.axis) {
        case AxisTypes.X: {
          // self.$data.objectManifest[n.index].rotation.set(n.r, self.$data.objectManifest[n.index].rotation.y, self.$data.objectManifest[n.index].rotation.z)
          self.$data.objectManifest[n.index].rotation.x = n.r
          break
        }
        case AxisTypes.Y: {
          // self.$data.objectManifest[n.index].rotation.set(self.$data.objectManifest[n.index].rotation.x, n.r, self.$data.objectManifest[n.index].rotation.z)
          self.$data.objectManifest[n.index].rotation.y = n.r
          break
        }
        case AxisTypes.Z: {
          // self.$data.objectManifest[n.index].rotation.set(self.$data.objectManifest[n.index].rotation.x, self.$data.objectManifest[n.index].rotation.y, n.r)
          self.$data.objectManifest[n.index].rotation.z = n.r
          break
        }
      }
      self.updateViewports()
    })
    EventBus.$on('wireframe-scale-x-element', (n) => {
      // console.log(n)
      self.$data.objectManifest[n.index].scale.x = n.s
      self.updateViewports()
    })
    EventBus.$on('wireframe-scale-y-element', (n) => {
      self.$data.objectManifest[n.index].scale.y = n.s
      self.updateViewports()
    })
    EventBus.$on('wireframe-scale-z-element', (n) => {
      self.$data.objectManifest[n.index].scale.z = n.s
      self.updateViewports()
    })
    EventBus.$on('editor-value-change', (n) => {
      self.updateViewports()
      if (n) {
        self.rerenderViewports()
      }
    })
    EventBus.$on('editor-point-change', (n) => {
      // console.log(n)
      self.$data.objectManifest[n.o].points[n.p][n.prop] = Number(n.value)
      self.rerenderViewports()
    })
    EventBus.$on('editor-point-add', (n) => {
      // console.log(n)
      self.$data.objectManifest[n].points.push({x: 0, y: 0, z: 0})
      self.rerenderViewports()
    })
  }
}
</script>

<style lang="scss">
div.viewports{
  position: fixed;
  top:0;
  left:0;
  right:250px;
  bottom:0;
  > div{
    position: absolute;
    box-shadow: 0 0 0 1px #000000 inset
  }
}
.object-listing{
  width:250px !important;
  position: fixed;
  top:0;
  right:0;
  bottom:0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 !important;
  margin-top:40px !important;
}
div.editor-top-nav{
  height: 40px;
  width:250px;
  position: fixed;
  top: 0;
  right: 0;
  > button{
    width:50%;
  }
}
div.add-object-window{
  position:fixed;
  left: 0;
  top:0;
  bottom: 0;
  right:0;
  background-color: rgba(0,0,0,.85);
  > div{
    background-color: rgba(255,255,255,.9);
    width: 300px;
    padding: 6px;
    margin:50px auto;
    > select {
      width:100%;
    }
  }
}
label.object-row-label{
  > button{
    float:right;
  }
}
div.subcharts-container{
  position:fixed;
  left: 0;
  height: 250px;
  right: 0;
  bottom: 0;
  background-color: rgba(230, 230, 230, .8);
  > div {
    height:180px;
    width: 1010px;
    margin: 5px auto;
    position: relative;
    > h3{
      display: inline-block;
      padding:6px;
      margin:0;
    }
    > ul{
      display:inline-block;
      position: absolute;
      top:0px;
      right: 5px;
    }
    > div{
      height: 180px;
      > div.echarts-chart{
        display:inline-block;
        height: 200px;
        > div{
          height: 100%;
          > div {
            height: 100%;
            canvas {
              height: 100%;
            }
          }
        }
      }
      > div.echarts-chart:first-child{
        width: 400px;
      }
      > div.echarts-chart:last-child{
        width: 600px;
      }
    } 
  }
}
body{
  font-family: Arial, Helvetica, sans-serif;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 11px;
}

h1, h2 {
  font-weight: normal;
}


a {
  color: #42b983;
}
.dpk-bar-chart, .dpk-line-chart, .dpk-over-under-chart{
  position: relative;
  > svg {
    width: 100%;
    height: 100%;
  }
}
</style>
