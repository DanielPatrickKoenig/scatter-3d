<template>
  <div class="single-axis">
    <axiselement v-for="(o, i) in objects" :key="'group'+i.toString()" :axis='axis' :object="o" :offset="offset" :scale="scale" :index="i"></axiselement>
  </div>
</template>
<script>
// import {AxisTypes} from './AxisTypes.js'
import SingleAxisWireFrameElement from './SingleAxisWireFrameElement.vue'
export default {
  components: {
    axiselement: SingleAxisWireFrameElement
  },
  props: ['objects', 'axis', 'scale'],
  data () {
    return {
      offset: {x: 200, y: 200},
      svgID: 'svgElement_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('')
    }
  },
  mounted: function () {
    // var self = this
  }
}
</script>
<style lang="scss" scoped>
svg.single-axis{
  width:100%;
  height:100%;
  position:absolute;
}
</style>
