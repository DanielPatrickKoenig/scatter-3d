const Shapes = {
  calandar: 'M26.8,81.9l3.3-3.3l-3.3-3.3l3.4-3.4l3.3,3.3l3.3-3.3l3.4,3.4l-3.3,3.3l3.3,3.3l-3.4,3.4L33.5,82l-3.3,3.3L26.8,81.9zM53.9,85.3l3.3-3.3l3.3,3.3l3.4-3.4l-3.3-3.3l3.3-3.3l-3.4-3.4l-3.3,3.3l-3.3-3.3l-3.4,3.4l3.3,3.3l-3.3,3.3L53.9,85.3z M77.7,85.3L81,82l3.3,3.3l3.4-3.4l-3.3-3.3l3.3-3.3l-3.4-3.4L81,75.2l-3.3-3.3l-3.4,3.4l3.3,3.3l-3.3,3.3L77.7,85.3z M130,23.7v103.2H9.4V51.9v-4.8V23.7h18.6V13.3h19.7v25.4H27.9V28.5H14.2v18.6h104.5v4.8H14.2V122h111V28.5h-8.7v-4.8H130z M32.7,33.9h10.1V18.1H32.7V33.9zM91.8,28.5h-39v-4.8h39V13.3h19.7v25.4H91.8V28.5z M96.6,23.7v4.8v5.4h10.1V18.1H96.6V23.7z M40.2,61.2H26.8V66h13.5V61.2zM64,61.2H50.5V66H64V61.2z M87.7,61.2H74.2V66h13.5V61.2z M111.4,61.2H98V66h13.5V61.2z M111.4,76.9H98v4.8h13.5V76.9z M40.2,92.5H26.8v4.8h13.5V92.5z M64,92.5H50.5v4.8H64V92.5z M87.7,92.5H74.2v4.8h13.5V92.5z M111.4,92.5H98v4.8h13.5V92.5z M26.8,112.9h13.5v-4.8H26.8V112.9z M50.5,112.9H64v-4.8H50.5V112.9z M74.2,112.9h13.5v-4.8H74.2V112.9z M98,112.9h13.5v-4.8H98V112.9z',
  search: 'M119.1,22.9C101.7,4.8,72.8,4.2,54.6,21.6C38.4,37.2,36.2,62,48.4,80.1L38.1,90l-1.3-1.4c-0.6-0.6-1.8-0.7-2.4-0.1L11,111c-2.2,2.1-3.4,4.9-3.5,7.9c-0.1,3,1.1,5.9,3.1,8c2.2,2.2,5,3.4,7.9,3.5c2.9,0.1,5.8-1,8-3.1L50,104.8c0.7-0.7,0.7-1.7,0.1-2.4l-1.3-1.4l10.3-9.9c7.5,5.6,16.6,8.7,26.2,8.9c12.2,0.3,23.7-4.3,32.5-12.7C135.9,70,136.5,41.1,119.1,22.9z M24.3,124.8c-3.1,3-8.1,2.9-11.1-0.2c-1.5-1.5-2.2-3.5-2.2-5.6c0-2.1,0.9-4.1,2.4-5.5l22.2-21.3l1.3,1.4c0,0,0,0,0,0l8.3,8.6c0,0,0,0,0,0l1.3,1.4L24.3,124.8z M46.4,98.6L41.1,93l-0.6-0.6l9.8-9.4l5.9,6.2L46.4,98.6z M115.4,85c-8.1,7.8-18.8,12-30.1,11.7c-11.3-0.2-21.8-4.9-29.6-13C39.6,66.9,40.2,40.2,57,24.1c8.4-8.1,19.3-11.9,30.1-11.7c10.8,0.2,21.5,4.6,29.6,13C132.8,42.1,132.2,68.9,115.4,85z M111.2,30.5c-6.4-6.7-15-10.5-24.3-10.7c-9.3-0.2-18,3.2-24.7,9.6c-13.8,13.2-14.2,35.2-1,49c6.6,6.9,15.4,10.5,24.3,10.6c8.9,0.2,17.8-3,24.7-9.6c6.7-6.4,10.5-15,10.7-24.3C121,46,117.6,37.2,111.2,30.5z M107.8,77.1C95.4,89,75.6,88.6,63.6,76.1C51.7,63.7,52.1,43.9,64.6,32c6-5.8,13.9-8.9,22.3-8.7c8.3,0.2,16.1,3.6,21.9,9.6c5.8,6,8.9,13.9,8.7,22.3C117.2,63.5,113.8,71.3,107.8,77.1z',
  chevron: 'M69.7,126.4c-2.6,0-5-1.4-6.3-3.7L8.4,24.9c-2-3.5-0.7-7.9,2.7-9.8c3.4-2,7.9-0.8,9.8,2.8l48.8,86.6l48.8-86.6c1.9-3.5,6.4-4.7,9.8-2.8c3.5,1.9,4.7,6.4,2.8,9.8L76,122.7C74.7,125,72.3,126.4,69.7,126.4z',
  searchDetail: '',
  profileWithArrow: ''
}
const ChartingThresholds = [0, 5, 10, 15, 20, 25, 50, 100, 500, 1000, 5000, 10000]
const ChartColors = ['#00aeef', '#f26d7d', '#7cc576', '#fdc689', '#a186be', '#ec008c', '#c69c6d', '#ed145b', '#f26522', '#acd373', '#aba000', '#f5989d']
const ChartTypes = {
  Bar: 'bar',
  Line: 'line',
  OverUnder: 'overunder'
}
function processedMouseEvent (e) {
  return {
    x: e.pageX,
    y: e.pageY
  }
}
function getHighest (list, threshold) {
  let highest = -99999999999
  for (let i = 0; i < list.length; i++) {
    if (list[i] > highest) {
      highest = list[i]
    }
  }
  if (threshold) {
    for (let j = 0; j < ChartingThresholds.length; j++) {
      if (highest < ChartingThresholds[j]) {
        highest = ChartingThresholds[j]
        j = ChartingThresholds.length + 1
      }
    }
  }
  return highest
}
function getLowest (list) {
  let lowest = 99999999999
  for (let i = 0; i < list.length; i++) {
    if (list[i] < lowest) {
      lowest = list[i]
    }
  }
  return lowest
}
function getRatios (list, highest) {
  let _highest = highest !== undefined ? highest : getHighest(list, true)
  let ratios = []
  for (let i = 0; i < list.length; i++) {
    ratios.push(list[i] / _highest)
  }
  return ratios
}
function getDenomenator (val) {
  let found = false
  let denom = 11
  while (!found) {
    denom--
    found = val / denom === Math.round(val / denom)
  }
  return denom
}
const Utilties = {
  Shapes: Shapes,
  ChartColors: ChartColors,
  ChartTypes: ChartTypes,
  processedMouseEvent: processedMouseEvent,
  getHighest: getHighest,
  getLowest: getLowest,
  getRatios: getRatios,
  getDenomenator: getDenomenator
}
export default Utilties
