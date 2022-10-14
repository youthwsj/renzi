<template>
  <div id="container" />
</template>
<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  mounted() {
    const data = [
      { item: '身高', '小王': 70, b: 30 },
      { item: '体重', '小王': 60, b: 70 },
      { item: '加班时长', '小王': 50, b: 60 },
      { item: 'Users', '小王': 40, b: 50 },
      { item: 'Test', '小王': 60, b: 70 }
    ]
    const { DataView } = DataSet
    const dv = new DataView().source(data)
    dv.transform({
      type: 'fold',
      fields: ['小王', 'b'], // 展开字段集
      key: 'user', // key字段
      value: 'score' // value字段
    })

    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500
    })
    chart.data(dv.rows)
    chart.scale('score', {
      min: 0,
      max: 80
    })
    chart.coordinate('polar', {
      radius: 0.8
    })
    chart.tooltip({
      shared: true,
      showCrosshairs: true,
      crosshairs: {
        line: {
          style: {
            lineDash: [4, 4],
            stroke: '#333'
          }
        }
      }
    })
    chart.axis('item', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null
          }
        }
      }
    })
    chart.axis('score', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null
          }
        }
      }
    })
   // dwadw
    chart
      .line()
      .position('item*score')
      .color('user')
      .size(2)
    chart
      .point()
      .position('item*score')
      .color('user')
      .shape('circle')
      .size(4)
      .style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1
      })
    chart
      .area()
      .position('item*score')
      .color('user')
    chart.render()
  }
}
</script>
