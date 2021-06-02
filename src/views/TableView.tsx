import {
  Bill,
  Category,
  getCategoryMapping,
  initResource,
} from '../utils/dataHandler'
import Table from '../features/table/Tabel'
import { ChangeEvent, useState } from 'react'
import Bar from '../features/bar/Bar'

import classes from './TableView.module.scss'
import {
  queryIndex,
  addData as addDBData,
  deleteData as deleteDBData,
} from '../utils/dbHelper'

export default function TableView() {
  const initialData: [Bill[], Category[]] = initResource.read()
  const [data, setData] = useState<Array<Bill>>(initialData[0])
  const [categoriesMapping, setCategoriesMapping] = useState<any>(
    getCategoryMapping(initialData[1])
  )

  function addData(bill: Bill) {
    setData(data.concat(bill))
    addDBData<Bill>('data', [bill])
  }
  function deleteData(bills: Array<number>) {
    deleteDBData('data', bills).then(() => {
      console.log(`deleted: ${bills}`)
      setData(data.filter((v) => !bills.includes(v.id)))
    })
  }
  function changeMonth(event: ChangeEvent) {
    const month: string = (event.target as HTMLInputElement).value
    queryIndex<Bill>('data', 'month', month.split('-').join('')).then(
      (result) => {
        setData(result)
      }
    )
  }
  return (
    <div className={classes.view}>
      <Table
        data={data}
        categories={categoriesMapping}
        deleteData={deleteData}
        changeMonth={changeMonth}
      />
      <Bar />
    </div>
  )
}
