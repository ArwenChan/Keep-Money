import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { AppContext } from '../../App'
import { Bill } from '../../utils/dataHandler'
import BarChart from './BarChart'
import * as echarts from 'echarts/core'

jest.mock('echarts/core')
jest.mock('echarts/components', () => ({
  GridComponent: jest.fn(),
  TitleComponent: jest.fn(),
}))
jest.mock('echarts/charts', () => ({
  BarChart: jest.fn(),
}))
jest.mock('echarts/renderers', () => ({
  CanvasRenderer: jest.fn(),
}))
const mockSetOption = jest.fn()

beforeEach(() => {
  //@ts-ignore
  echarts.init = jest.fn().mockReturnValue({
    setOption: mockSetOption,
  })
  //@ts-ignore
  echarts.use = jest.fn()
})

describe('test bar chart', () => {
  it('test bar chart render', async () => {
    const data: Bill[] = [
      {
        type: 0,
        time: 1561910400000,
        category: '8s0p77c323',
        amount: 5400,
        month: '201907',
        id: 1,
      },
      {
        type: 0,
        time: 1561910400000,
        category: '0fnhbcle6hg',
        amount: 1500,
        month: '201907',
        id: 2,
      },
      {
        type: 0,
        time: 1563897600000,
        category: '3tqndrjqgrg',
        amount: 3900,
        month: '201907',
        id: 3,
      },
      {
        type: 0,
        time: 1564502400000,
        category: 'bsn20th0k2o',
        amount: 1900,
        month: '201907',
        id: 4,
      },
      {
        type: 0,
        time: 1564502400000,
        category: 'bsn20th0k2o',
        amount: 1000,
        month: '201907',
        id: 5,
      },
      {
        type: 1,
        time: 1561910400000,
        category: 's73ijpispio',
        amount: 30000,
        month: '201907',
        id: 34,
      },
      {
        type: 1,
        time: 1564502400000,
        category: '5il79e11628',
        amount: 1000,
        month: '201907',
        id: 35,
      },
    ]
    const categoriesMapping: any = {
      '0fnhbcle6hg': {
        name: '房屋租赁',
        type: 0,
      },
      '1bcddudhmh': {
        name: '车贷',
        type: 0,
      },
      '1vjj47vpd28': {
        name: '股票投资',
        type: 1,
      },
      '3tqndrjqgrg': {
        name: '日常饮食',
        type: 0,
      },
      '5il79e11628': {
        name: '基金投资',
        type: 1,
      },
      '8s0p77c323': {
        name: '房贷',
        type: 0,
      },
      bsn20th0k2o: {
        name: '交通',
        type: 0,
      },
      hc5g66kviq: {
        name: '车辆保养',
        type: 0,
      },
      j1h1nohhmmo: {
        name: '旅游',
        type: 0,
      },
      odrjk823mj8: {
        name: '家庭用品',
        type: 0,
      },
      s73ijpispio: {
        name: '工资',
        type: 1,
      },
    }
    const open = true
    const onClose = jest.fn()
    const props = { data, categoriesMapping, open, onClose }
    const appRef = createRef<HTMLDivElement>()

    const { rerender } = render(
      <div className="App" id="app" ref={appRef}>
        <AppContext.Provider value={appRef}>
          <BarChart {...props} />
        </AppContext.Provider>
      </div>
    )
    const mask = screen.getByRole('mask')
    expect(mask).toBeInTheDocument()
    expect(screen.queryByRole('board')).toBeInTheDocument()
    expect(mockSetOption).toBeCalledTimes(1)
    expect(mockSetOption).toBeCalledWith({
      title: {
        text: '本月支出情况',
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'category',
        data: ['房屋租赁', '交通', '日常饮食', '房贷'],
      },
      xAxis: {
        type: 'value',
      },
      series: [
        {
          data: [1500, 2900, 3900, 5400],
          type: 'bar',
          label: {
            show: true,
            position: 'inside',
          },
        },
      ],
    })
    fireEvent.click(mask)
    expect(onClose).toBeCalledTimes(1)

    props.open = false
    rerender(
      <div className="App" id="app" ref={appRef}>
        <AppContext.Provider value={appRef}>
          <BarChart {...props} />
        </AppContext.Provider>
      </div>
    )
    expect(mask).not.toBeInTheDocument()
  })

  it('test bar chart not render when open is false', async () => {
    const data: Bill[] = []
    const categoriesMapping: any = {}
    let open = false
    const onClose = jest.fn()
    const props = { data, categoriesMapping, open, onClose }
    const appRef = createRef<HTMLDivElement>()

    render(
      <div className="App" id="app" ref={appRef}>
        <AppContext.Provider value={appRef}>
          <BarChart {...props} />
        </AppContext.Provider>
      </div>
    )
    const mask = screen.queryByRole('mask')
    expect(mask).toBeNull()
  })
  it('test bar chart not render when app not ready', async () => {
    const data: Bill[] = []
    const categoriesMapping: any = {}
    let open = false
    const onClose = jest.fn()
    const props = { data, categoriesMapping, open, onClose }
    const appRef = createRef<HTMLDivElement>()

    render(
      <div className="App" id="app">
        <AppContext.Provider value={appRef}>
          <BarChart {...props} />
        </AppContext.Provider>
      </div>
    )
    const mask = screen.queryByRole('mask')
    expect(mask).toBeNull()
  })
})
