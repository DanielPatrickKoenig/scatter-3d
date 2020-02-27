<template>
  <div class="filter-builder" :style="enabled ? 'opacity:1;' : 'opacity:.5;'">
    <label :id="'display-label-' + index" :for="'display-' + index"><slot></slot><br /><span>{{renderFilterLabel()}}</span></label><input v-if="enabled" :id="'display-' + index" type="checkbox" />
    <ul v-if="statistics">
        <li v-if="k == tier1Val" v-for="(teir1, k, i) in stats" :key="'teir1-' + i.toString()">
        
        <ul>
            <li><label><input v-on:change="onRadioChange(2)" type="radio" v-model="tier2Val" value="ALL" :name="index + 'teir2'" >all</label></li>
            <li v-for="(teir2, _k, _i) in stats[k]" :key="'teir2-' + _i.toString() + '-' + i.toString()">
            <label><input v-on:change="onRadioChange(2)" type="radio" :name="index + 'teir2'" v-model="tier2Val" :value="_k">{{_k}}</label>
            <ul v-if="tier2Val === _k">
                <li><label><input v-on:change="onRadioChange(3)" type="radio" v-model="tier3Val" value="ALL" :name="index + 'teir3'" >all</label></li>
                <li v-for="(teir3, __k, __i) in stats[k][_k]" :key="'teir3-' + __i.toString() + '-' + _i.toString() + '-' + i.toString()">
                <label><input v-on:change="onRadioChange(3)" type="radio" :name="index + 'teir3'" v-model="tier3Val" :value="__k">{{__k}}</label>
                <ul v-if="tier3Val === __k">
                    <li><label><input v-on:change="onRadioChange(4)" type="radio" v-model="tier4Val" value="ALL" :name="index + 'teir4'" >all</label></li>
                    <li v-for="(teir4, ___k, ___i) in stats[k][_k][__k]" :key="'teir3-' + ___i.toString() + '-' + __i.toString() + '-' + _i.toString() + '-' + i.toString()">
                    <label><input v-on:change="onRadioChange(4)" type="radio" :name="index + 'teir4'" v-model="tier4Val" :value="___k">{{___k}}</label>
                    </li>
                </ul>
                </li>
            </ul>
            </li>
        </ul>
        </li>
        <!-- <li v-for="(t, i) in teirs" :key="'teir-' + i.toString()">
        <select v-on:change="onSelectionChange" :index="i">
            <option :value="allProxy">All</option>
            
            <option v-for="(d, k, j) in teirVals[i]" :key="'teir-option-' + i.toString() + '-' + j + 'i'" :value="k" v-on:change="onSelectionChange">
            {{k}}
            </option>
        </select>
        </li> -->
    </ul>
    <!-- <button v-on:click="onCinfirm">Confirm</button> -->
  </div>
  
</template>
<script>
import DataSlicer from './utils/DataSlicer.js'
export default {
  props: ['stats', 't1', 'index', 'startteir', 'enabled'],
  data () {
    return {
      statistics: this.stats,
      teirs: [],
      tier1Val: this.t1,
      tier2Val: this.startteir ? this.startteir : 'ALL',
      tier3Val: 'ALL',
      tier4Val: 'ALL',
      teirVals: [],
      allProxy: 'allfiltersselcted'
    }
  },
  methods: {
    renderFilterLabel: function () {
      let self = this
      let label = 'No Selection'
      if (self.$data.tier2Val !== 'ALL') {
        label = self.$data.tier2Val
      }
      if (self.$data.tier3Val !== 'ALL') {
        label += ' > ' + self.$data.tier3Val
      }
      if (self.$data.tier4Val !== 'ALL') {
        label += ': ' + self.$data.tier4Val
      } else if (self.$data.tier3Val !== 'ALL') {
        label += ': *'
      }
      return label
    },
    onRadioChange: function (index) {
      let self = this
      switch (index) {
        case 2: {
          self.$data.tier3Val = 'ALL'
          self.$data.tier4Val = 'ALL'
          break
        }
        case 3: {
          self.$data.tier4Val = 'ALL'
          break
        }
        case 4: {
          break
        }
      }
      self.onCinfirm()
    },
    onCinfirm: function () {
      let self = this
      // console.log('hhhhhhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeeeeeeeellllllllllllllllllllll0000000000000000000')
      let list = []
      if (self.$data.tier2Val !== 'ALL') {
        list.push(self.$data.tier2Val)
      }
      if (self.$data.tier3Val !== 'ALL') {
        list.push(self.$data.tier3Val)
      }
      if (self.$data.tier4Val !== 'ALL') {
        list.push(self.$data.tier4Val)
      }
      // console.log(list)
      // let slices = DataSlicer.slice(list, self.$data.statistics[self.$data.tier1Val])
      // console.log(slices)
      self.$emit('confirm', {keys: list, index: self.index})
    },
    getTeirData: function (index) {
      let self = this
      // console.log(index)
      // let teir = self.$data.teirs[0]
      let stats = JSON.parse(JSON.stringify(self.$data.statistics))
      let teirData = stats[self.$data.teirs[0]]
      for (let i = 1; i < index + 1; i++) {
        teirData = teirData[self.$data.teirs[i]]
      }
      console.log(teirData)
      return teirData
    },
    onSelectionChange: function (e) {
      let self = this
      // console.log('index = ' + e.target.getAttribute('index').toString())
      if (Number(e.target.getAttribute('index')) + 1 < self.$data.teirs.length) {
        // console.log('index = ' + e.target.getAttribute('index').toString())
        self.regress(Number(e.target.getAttribute('index')))
      }
      let slices = DataSlicer.slice(self.$data.teirs, self.$data.statistics)
      // console.log(slices)
      if (isNaN(slices)) {
        let teirList = []
        self.$data.teirVals = []
        for (let i = 1; i < self.$data.teirs.length; i++) {
          teirList.push(self.$data.teirs[i])
        }
        for (let j = 0; j < self.$data.teirs.length; j++) {
          self.$data.teirVals.push(self.getTeirData(j))
        }
        // console.log('---------------------------- ####### ---------------------------')
        // console.log(self.$data.teirs)
        teirList.push(e.target.value)
        self.$data.teirs = teirList
        self.$forceUpdate()
        // console.log(self.$data.teirs)
      }
      self.processSelection()
    },
    processSelection: function () {
      let self = this
      let teirList = []
      for (let i = 1; i < self.$data.teirs.length; i++) {
        teirList.push(self.$data.teirs[i])
      }
      // console.log(teirList)
      // console.log(DataSlicer.objectValues(DataSlicer.slice(teirList, self.$data.statistics[self.$data.teirs[0]]), []))
    },
    regress: function (index) {
      let self = this
      let teirList = [self.$data.teirs[0]]
      for (let i = 0; i < index; i++) {
        teirList.push(self.$data.teirs[i])
      }
      self.$data.teirs = teirList
    }
  },
  mounted: function () {
    let self = this
    let n = 0
    for (let s in self.$data.statistics) {
      if (n === 0) {
        self.$data.teirs.push(s)
      }
      n++
    }
    for (let j = 0; j < self.$data.teirs.length; j++) {
      self.$data.teirVals.push(self.getTeirData(j))
    }
    if (self.startteir) {
      self.onRadioChange(2)
    }
    // console.log('---------------------------- ####### ---------------------------')
    // console.log(self.$data.teirVals)
    // console.log(self.$data.teirs)
  }
}
</script>
<style lang="scss" scoped>
div.filter-builder{
  position:relative;
  z-index: 200;
  > input{
    position:absolute;
    left: 0;
    top:0;
  }
  > label{
    padding-left: 20px;
    display: inline-block;
    > span{
      display: inline-block;
    }
  }
  > input:checked + ul{
      display:block;
  }
  > input:checked + ul + button{
      display:block;
  }
  > ul {
      display:none;
      > li {
          display: block;
      }
      
  }
  > button {
      display:none;
  }
}
ul{
  margin-left: 9px;
  padding:0;
  > li {
    display: block;
    box-shadow: 0 1px 0 #999999 inset;
  }
}
</style>