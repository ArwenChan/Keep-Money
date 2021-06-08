import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import { Category } from '../../utils/dataHandler'
import AddBillDialog from './AddBillDialog'

describe('test add bill dialog', () => {
  let open
  let props
  const categories: Category[] = [
    { id: '110', type: 0, name: '租房' },
    { id: '111', type: 0, name: '饮食' },
    { id: '112', type: 1, name: '投资' },
  ]
  const handleClose = jest.fn()
  const handleSubmit = jest.fn()

  it('test add bill dialog render and function', async () => {
    open = true
    props = { open, categories, handleClose, handleSubmit }
    render(<AddBillDialog {...props} />)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByText('添加记账')).toBeInTheDocument()
    expect(dialog.getByText('类型')).toBeInTheDocument()
    const input = dialog.getByLabelText('金额') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(dialog.getByText('确认')).toBeInTheDocument()
    expect(dialog.getByText('取消')).toBeInTheDocument()

    const buttons = dialog.queryAllByRole('button')
    expect(buttons.length).toEqual(3)
    fireEvent.mouseDown(buttons[0])
    let lis = screen.queryAllByRole('option')
    expect(lis.length).toEqual(5)

    expect(lis[0].textContent).toBe('收入')
    expect(lis[1].textContent).toBe('投资')
    expect(lis[2].textContent).toBe('支出')
    expect(lis[3].textContent).toBe('租房')
    expect(lis[4].textContent).toBe('饮食')

    fireEvent.click(lis[1])
    await waitForElementToBeRemoved(lis)

    fireEvent.change(input, {
      target: {
        value: 'abc',
      },
    })
    expect(input.value).toBe('')
    // when amount is blank, confirm button fire handleClose
    fireEvent.click(buttons[2])
    expect(handleClose).toBeCalled()

    fireEvent.change(input, {
      target: {
        value: '123',
      },
    })
    expect(input.value).toBe('123')

    fireEvent.click(buttons[2])
    expect(handleSubmit).toBeCalledWith('112', 123)

    fireEvent.click(buttons[1])
    expect(handleClose).toBeCalled()
  })
  it('test add bill dialog not render', () => {
    open = false
    const props = { open, categories, handleClose, handleSubmit }
    render(<AddBillDialog {...props} />)
    expect(screen.queryByRole('none')).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
