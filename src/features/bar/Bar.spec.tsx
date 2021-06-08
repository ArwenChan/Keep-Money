import { fireEvent, render, screen } from '@testing-library/react'
import Bar from './Bar'

describe('testing bar', () => {
  const summary: [number, number] = [2000, 1000]
  const openDialog = jest.fn()
  const openModal = jest.fn()
  render(
    <Bar summary={summary} openDialog={openDialog} openModal={openModal} />
  )
  it('test bar render and function', () => {
    expect(screen.getByTestId('bar-string').textContent).toBe(
      '收入：2000，支出：1000更多'
    )
    const more = screen.getByText(/更多/)
    expect(more.className).toBe('underline')
    fireEvent.click(more)
    expect(openModal).toBeCalledTimes(1)

    const outcome = screen.getByText(/支出：1000/)
    expect(outcome.className).toBe('red')

    const button = screen.getByRole('button')
    expect(button).not.toBeNull()
    fireEvent.click(button)
    expect(openDialog).toBeCalledTimes(1)
  })
})
