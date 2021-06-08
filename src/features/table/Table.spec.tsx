import { fireEvent, render, screen, within } from '@testing-library/react'
import { Bill } from '../../utils/dataHandler'
import Table from './Table'

describe('test table', () => {
  it('test table render', () => {
    const data: Array<Bill> = [
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
        time: 1623063290531,
        category: '0fnhbcle6hg',
        amount: 1500,
        month: '202106',
        id: 2,
      },
      {
        type: 0,
        time: 1623083403918,
        category: '0fnhbcle6hg',
        amount: 1500,
        month: '202106',
        id: 3,
      },
    ]
    const categoriesMapping = {
      '8s0p77c323': {
        name: '房贷',
        type: 0,
      },
      '0fnhbcle6hg': {
        name: '房屋租赁',
        type: 0,
      },
    }
    const deleteData = jest.fn()
    const changeMonth = jest.fn()
    const filter = <span>filter</span>
    const props = { data, categoriesMapping, deleteData, changeMonth, filter }
    const { container } = render(<Table {...props} />)
    expect(container).toMatchSnapshot()

    const calendar = screen.getByTestId('calendar')
    expect(calendar).toBeInTheDocument()
    fireEvent.change(within(calendar).getByRole('month'), {
      target: {
        value: '2010-07',
      },
    })
    expect(changeMonth).toBeCalledTimes(1)
    let items = screen.getAllByRole('item')
    expect(items.length).toEqual(3)
    expect(within(items[0]).queryByText('2019-7-1')).not.toBeNull()
    expect(within(items[1]).queryByText('2021-6-7')).not.toBeNull()
    expect(within(items[2]).queryByText('2021-6-8')).not.toBeNull()
    const tableitems = screen.getAllByRole('rowgroup')
    expect(tableitems.length).toEqual(2)
    const tableHeader = tableitems[0]

    // order by time reverse
    fireEvent.click(within(tableHeader).getByText('时间'))
    items = screen.getAllByRole('item')
    expect(items.length).toEqual(3)
    expect(within(items[0]).queryByText('2021-6-8')).not.toBeNull()
    expect(within(items[1]).queryByText('2021-6-7')).not.toBeNull()
    expect(within(items[2]).queryByText('2019-7-1')).not.toBeNull()

    //order by amount
    fireEvent.click(within(tableHeader).getByText('金额'))
    items = screen.getAllByRole('item')
    expect(items.length).toEqual(3)
    expect(within(items[0]).queryByText('1500')).not.toBeNull()
    expect(within(items[1]).queryByText('1500')).not.toBeNull()
    expect(within(items[2]).queryByText('5400')).not.toBeNull()

    //order by amount reverse
    fireEvent.click(within(tableHeader).getByText('金额'))
    items = screen.getAllByRole('item')
    expect(items.length).toEqual(3)
    expect(within(items[0]).queryByText('5400')).not.toBeNull()
    expect(within(items[1]).queryByText('1500')).not.toBeNull()
    expect(within(items[2]).queryByText('1500')).not.toBeNull()

    //select first one
    fireEvent.click(within(items[0]).getByRole('checkbox'))
    expect(screen.queryByTestId('calendar')).toBeNull()
    expect(screen.queryByText('1 selected')).not.toBeNull()

    //select second one
    fireEvent.click(within(items[1]).getByRole('checkbox'))
    expect(screen.queryByText('2 selected')).not.toBeNull()

    // select last one
    fireEvent.click(within(items[2]).getByRole('checkbox'))
    expect(screen.queryByText('3 selected')).not.toBeNull()

    fireEvent.click(within(items[1]).getByRole('checkbox'))
    expect(screen.queryByText('2 selected')).not.toBeNull()

    fireEvent.click(within(items[2]).getByRole('checkbox'))
    expect(screen.queryByText('1 selected')).not.toBeNull()

    fireEvent.click(within(items[0]).getByRole('checkbox'))
    expect(screen.queryByText('1 selected')).toBeNull()
    expect(screen.queryByTestId('calendar')).not.toBeNull()

    //test all select
    const selectAll = screen.getByLabelText('select all')
    fireEvent.click(selectAll)
    expect(screen.queryByTestId('calendar')).toBeNull()
    expect(screen.queryByText('3 selected')).not.toBeNull()
    fireEvent.click(selectAll)
    expect(screen.queryByTestId('calendar')).not.toBeNull()
    expect(screen.queryByText('3 selected')).toBeNull()

    fireEvent.click(selectAll)
    fireEvent.click(screen.getByLabelText('delete'))
    expect(deleteData).toBeCalledTimes(1)
    expect(screen.queryByLabelText('delete')).toBeNull()
  })
})
