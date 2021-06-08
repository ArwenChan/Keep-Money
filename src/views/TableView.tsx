import {
  Bill,
  Category,
  computeSummary,
  getCategoryMapping,
  getMonth,
  initResource,
} from '../utils/dataHandler'
import Table from '../features/table/Table'
import React, { ChangeEvent, useMemo, useState } from 'react'
import Bar from '../features/bar/Bar'

import classes from './TableView.module.scss'
import {
  queryIndex,
  addData as addDBData,
  deleteData as deleteDBData,
  readAllRecordWithKey,
} from '../utils/dbHelper'
import AddBillDialog from '../features/addBill/AddBillDialog'
import BarChart from '../features/chart/BarChart'
import Filter from '../features/filter/Filter'

export default function TableView() {
  const initialData: [Bill[], Category[]] = initResource.read()
  const [data, setData] = useState<Array<Bill>>(initialData[0])
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [month, setMonth] = useState<string>('')
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const categories = initialData[1]
  const categoriesMapping = getCategoryMapping(initialData[1])
  const viewData = useMemo(() => {
    if (filterCategories.length > 0) {
      return data.filter((d) => filterCategories.includes(d.category))
    }
    return data
  }, [data, filterCategories])
  const summary = useMemo(() => computeSummary(viewData), [viewData])

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    setOpenDialog(false)
  }

  function handleOpenModal() {
    setOpenModal(true)
  }

  function handleCloseModal() {
    setOpenModal(false)
  }

  function deleteData(bills: Array<number>) {
    deleteDBData('data', bills).then(() => {
      setData(data.filter((v) => !bills.includes(v.id!)))
    })
  }

  function changeMonth(event: ChangeEvent) {
    const monthValues: string[] = (
      event.target as HTMLInputElement
    ).value.split('-')
    const newMonth = monthValues.join('')
    setMonth(newMonth)
    refreshData(newMonth)
  }

  function refreshData(month: string) {
    if (month) {
      queryIndex<Bill>('data', 'month', month).then((result) => {
        setData(result)
      })
    } else {
      readAllRecordWithKey<Bill>('data').then((result) => {
        setData(result)
      })
    }
  }

  function handleSubmitDialog(categoryId: string, amount: number) {
    const time = new Date().getTime()
    addDBData<Bill>('data', [
      {
        type: categoriesMapping[categoryId].type,
        time,
        category: categoryId,
        amount,
        month: getMonth(time),
      },
    ]).then(() => {
      setOpenDialog(false)
      refreshData(month)
    })
  }

  return (
    <div className={classes.view}>
      <Table
        data={viewData}
        categoriesMapping={categoriesMapping}
        deleteData={deleteData}
        changeMonth={changeMonth}
        filter={
          <Filter
            categories={categories}
            onChange={setFilterCategories}
            filters={filterCategories}
          />
        }
      />
      <Bar
        summary={summary}
        openDialog={handleOpenDialog}
        openModal={handleOpenModal}
      />
      <AddBillDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmitDialog}
        categories={categories}
      />
      <BarChart
        data={data}
        categoriesMapping={categoriesMapping}
        open={openModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}
