import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import { Category } from '../../utils/dataHandler'
import Filter from './Filter'

describe('test Filter', () => {
  const categories: Category[] = [
    { id: '110', type: 0, name: '租房' },
    { id: '111', type: 0, name: '饮食' },
    { id: '112', type: 1, name: '投资' },
  ]
  const onChange = jest.fn()
  it('test Filter render', async () => {
    const filters: string[] = []
    render(
      <Filter categories={categories} filters={filters} onChange={onChange} />
    )
    const select = screen.getByTestId('mutiple-checkbox-filter')
    expect(select.textContent).toBe('分类filter-outlined.svg')
    let lis = screen.queryAllByRole('option')
    expect(lis.length).toEqual(0)

    fireEvent.mouseDown(screen.getByRole('button'))

    lis = screen.queryAllByRole('option')
    expect(lis.length).toEqual(5)
    expect(lis[0].textContent).toBe('收入')
    expect(within(lis[0]).queryByRole('checkbox')).toBeNull()
    expect(lis[1].textContent).toBe('投资')
    expect(within(lis[1]).queryByRole('checkbox')).not.toBeNull()
    expect(lis[2].textContent).toBe('支出')
    expect(within(lis[2]).queryByRole('checkbox')).toBeNull()
    expect(lis[3].textContent).toBe('租房')
    expect(within(lis[3]).queryByRole('checkbox')).not.toBeNull()
    expect(lis[4].textContent).toBe('饮食')
    expect(within(lis[4]).queryByRole('checkbox')).not.toBeNull()

    fireEvent.click(screen.getByText('租房'))
    expect(onChange).toBeCalledWith(['110'])
    fireEvent.click(screen.getByText('饮食'))
    expect(onChange).toBeCalledWith(['111'])

    fireEvent.keyDown(document.activeElement!, {
      key: 'Escape',
      code: 'Escape',
    })
    await waitForElementToBeRemoved(lis)
  })

  it('test Filter with filters', () => {
    const filters: string[] = ['110']
    render(
      <Filter categories={categories} filters={filters} onChange={onChange} />
    )
    const select = screen.getByTestId('mutiple-checkbox-filter')
    expect(select.textContent).toBe('分类filter.svg')
    let lis = screen.queryAllByRole('option')
    expect(lis.length).toEqual(0)

    fireEvent.mouseDown(screen.getByRole('button'))

    lis = screen.queryAllByRole('option')
    expect(lis.length).toEqual(5)
    fireEvent.click(screen.getByText('租房'))
    expect(onChange).toBeCalledWith([])
    fireEvent.click(screen.getByText('饮食'))
    expect(onChange).toBeCalledWith(['110', '111'])
  })
})
