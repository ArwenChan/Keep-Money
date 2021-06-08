import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import React, { createRef, Suspense } from 'react'
require('fake-indexeddb/auto')

describe('test table view', () => {
  it('test table view render', async () => {
    const { AppContext } = await import('../App')
    const { default: TableView } = await import('./TableView')
    const appRef = createRef<HTMLDivElement>()
    let container: HTMLElement
    await waitFor(() => {
      container = render(
        <div className="App" id="app" ref={appRef}>
          <AppContext.Provider value={appRef}>
            <Suspense fallback={'loading...'}>
              <TableView />
            </Suspense>
          </AppContext.Provider>
        </div>
      ).container
    })
    let items: HTMLElement[]
    expect(screen.queryByText('loading...')).toBeInTheDocument()
    await waitFor(() => {
      items = screen.getAllByRole('item')
      expect(items.length).toEqual(8)
    })
    //@ts-ignore
    expect(container).toMatchSnapshot()
    expect(screen.getByText('更多')).toBeInTheDocument()
    const button = screen.getByTestId('add-button')
    fireEvent.click(button)
    // into dialog
    expect(screen.getByText('添加记账')).toBeInTheDocument()
    const dialog = within(screen.getByRole('dialog'))
    const input = dialog.getByLabelText('金额') as HTMLInputElement

    const buttons = dialog.queryAllByRole('button')
    expect(buttons.length).toEqual(3)
    fireEvent.mouseDown(buttons[0])
    let lis = screen.queryAllByRole('option')
    expect(lis.length).toEqual(13)
    fireEvent.click(lis[1])
    await waitForElementToBeRemoved(lis)
    fireEvent.change(input, {
      target: {
        value: '123',
      },
    })
    fireEvent.click(buttons[2])
    // dialog remove
    await waitForElementToBeRemoved(buttons)
    // data added
    await waitFor(() => {
      expect(screen.queryAllByRole('item').length).toEqual(9)
    })

    const calendar = screen.getByTestId('calendar')
    expect(calendar).toBeInTheDocument()
    fireEvent.change(within(calendar).getByRole('month'), {
      target: {
        value: '2010-07',
      },
    })
    await waitForElementToBeRemoved(items!)

    fireEvent.change(within(calendar).getByRole('month'), {
      target: {
        value: '2019-11',
      },
    })
    await waitFor(() => {
      items = screen.getAllByRole('item')
      expect(items.length).toEqual(2)
    })
    //@ts-ignore
    fireEvent.click(within(items[0]).getByRole('checkbox'))
    expect(screen.queryByTestId('calendar')).toBeNull()
    expect(screen.queryByText('1 selected')).not.toBeNull()
    fireEvent.click(screen.getByLabelText('delete'))
    // @ts-ignore
    await waitForElementToBeRemoved(items[0])
    items = screen.getAllByRole('item')
    expect(items.length).toEqual(1)

    fireEvent.mouseDown(screen.getByText('分类'))
    const options = screen.queryAllByRole('option')
    expect(options.length).toEqual(13)
    expect(options[0].textContent).toBe('收入')
    expect(options[1].textContent).toBe('股票投资')
    fireEvent.click(screen.getByText('股票投资'))
    await waitFor(() => {
      expect(screen.queryAllByRole('item').length).toEqual(0)
    })
  }, 20000)
})
