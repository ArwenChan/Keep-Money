export default function getOption(xData: string[], yData: number[]) {
  return {
    title: { text: '支出情况' },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    yAxis: {
      type: 'category',
      data: xData,
    },
    xAxis: {
      type: 'value',
    },
    series: [
      {
        data: yData,
        type: 'bar',
        label: {
          show: true,
          position: 'inside',
        },
      },
    ],
  }
}
