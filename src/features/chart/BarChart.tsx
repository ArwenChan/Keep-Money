import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { Bill } from '../../utils/dataHandler'
import React, { useContext, useEffect, useRef, useState } from 'react'
import unzip from 'lodash-es/unzip'
import classes from './BarChart.module.css'
import ReactDOM from 'react-dom'
import getOption from './chartOption'
import { AppContext } from '../../App'

echarts.use([GridComponent, BarChart, CanvasRenderer, TitleComponent])
interface BarChartProps {
  data: Bill[]
  categoriesMapping: any
  open: boolean
  onClose: () => void
}

function BarChartModal(props: BarChartProps) {
  const { data, categoriesMapping, open, onClose } = props
  const chartEl = useRef(null)
  const appRef = useContext(AppContext)
  const [el] = useState<HTMLDivElement>(document.createElement('div'))
  let dataCategoried: { [Key in keyof any]: number } = {}
  data
    .filter((d) => d.type === 0)
    .forEach((d) => {
      if (dataCategoried[d.category] === undefined) {
        dataCategoried[d.category] = d.amount
      } else {
        dataCategoried[d.category] += d.amount
      }
    })
  const dataOrdered: Array<[string, number]> = Array.from(
    Object.entries(dataCategoried)
  ).sort((a: [string, number], b: [string, number]) => a[1] - b[1])

  const xyData = dataOrdered.map((v) => [categoriesMapping[v[0]]['name'], v[1]])
  const [xData, yData] = unzip(xyData)

  function paint() {
    const chartDom = chartEl.current
    const myChart = echarts.init(chartDom!)
    const option = getOption(xData, yData)
    myChart.setOption(option)
  }

  useEffect(() => {
    if (appRef?.current) {
      if (open) {
        appRef.current.appendChild(el)
        paint()
      } else if (el.parentNode) {
        console.log('remove el')
        appRef.current.removeChild(el)
      }
    }
  }, [open, el])

  return ReactDOM.createPortal(
    <div className={classes.mask} onClick={onClose} role="mask">
      <div ref={chartEl} className={classes.board} role="board"></div>
    </div>,
    el
  )
}

export default BarChartModal
