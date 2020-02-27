import axios from 'axios'
let DATA = {}
function loadData (handler) {
  // let self = this
  axios.get('src/assets/fcadata.txt').then((response) => {
    DATA = response.data
    handler(DATA)
  })
}
function getData () {
  return DATA
}
function slice (list, d) {
  let currentData = d ? JSON.parse(JSON.stringify(d)) : JSON.parse(JSON.stringify(DATA))
  for (let i = 0; i < list.length; i++) {
    currentData = currentData[list[i]]
  }
  return currentData
}
function objectValues (obj, list) {
  if (!isNaN(obj)) {
    list.push(obj)
  }
  for (let o in obj) {
    if (isNaN(obj[o])) {
      objectValues(obj[o], list)
    } else {
      // console.log(o)
      list.push(obj[o])
    }
  }
  return list
}
const DataSlicer = {
  loadData: loadData,
  getData: getData,
  slice: slice,
  objectValues: objectValues
}
export default DataSlicer
