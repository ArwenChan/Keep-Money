import { Bill, Category, getMonth, readCSV } from './dataHandler'

let db: IDBDatabase
export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('keep')
    request.onerror = function (event) {
      console.log('数据库打开报错')
      reject(event)
    }

    request.onsuccess = function (event) {
      db = request.result
      console.log('数据库打开成功')
      resolve(event)
    }

    request.onupgradeneeded = async function (event) {
      console.log('数据库新建')
      db = request.result
      db.createObjectStore('data', { autoIncrement: true }).createIndex(
        'month',
        'month',
        { unique: false }
      )

      db.createObjectStore('category', { keyPath: 'id' })
      const tx = request.transaction
      console.log('downloading...')
      Promise.all([
        readCSV<Bill>('/data/bill.csv'),
        readCSV<Category>('/data/categories.csv'),
      ]).then(([billData, categories]) => {
        tx!.oncomplete = () => {
          initData(billData, categories).then(() => {
            resolve('load data successfully')
          })
        }
      })
    }
  })
}

export async function initData(data: Array<Bill>, categories: Array<Category>) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['data', 'category'], 'readwrite')
    const dataScheme = tx.objectStore('data')
    const categoryScheme = tx.objectStore('category')
    data.forEach((value) => {
      value.time = Number(value.time)
      value.month = getMonth(value.time)
      value.type = Number(value.type) as 0 | 1
      value.amount = Number(value.amount)
      dataScheme.add(value)
    })
    categories.forEach((value) => {
      value.type = Number(value.type) as 0 | 1
      categoryScheme.add(value)
    })
    tx.oncomplete = () => {
      resolve('')
    }
    tx.onerror = (event) => {
      reject(event)
    }
  })
}

export async function addData<T>(scheme: string, data: Array<T>) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(scheme, 'readwrite')
    data.forEach((value) => {
      tx.objectStore(scheme).add(value)
    })
    tx.oncomplete = () => {
      resolve(null)
    }
    tx.onerror = (event) => {
      reject(event)
    }
  })
}

export async function deleteData(scheme: string, ids: string[] | number[]) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(scheme, 'readwrite')
    ids.forEach((v: string | number) => {
      tx.objectStore(scheme).delete(v)
    })
    tx.oncomplete = () => {
      console.log('删除成功')
      resolve(null)
    }
    tx.onerror = (event) => {
      reject(event)
    }
  })
}

export async function queryIndex<T>(
  scheme: string,
  index: string,
  indexValue: any
): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(scheme, 'readonly')
    const request = tx
      .objectStore(scheme)
      .index(index)
      .openCursor(IDBKeyRange.only(indexValue))
    let datas: any = []
    request.onsuccess = function (event) {
      let cursor = request.result
      if (cursor) {
        datas.push({ ...cursor.value, id: cursor.primaryKey })
        cursor.continue()
      } else {
        resolve(datas)
      }
    }
    request.onerror = function (e) {
      reject(e)
    }
  })
}

export async function readAllRecord<T>(table: string): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(table)
    let objectStore = transaction.objectStore(table)
    let request = objectStore.getAll()
    request.onsuccess = function (event) {
      resolve(request.result)
    }

    request.onerror = function (event) {
      reject(event)
    }
  })
}

export async function readAllRecordWithKey<T>(
  table: string
): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(table, 'readonly')
    let objectStore = transaction.objectStore(table)
    let request = objectStore.openCursor()
    let datas: any = []
    request.onsuccess = function (event) {
      let cursor = request.result
      if (cursor) {
        datas.push({ ...cursor.value, id: cursor.primaryKey })
        cursor.continue()
      } else {
        resolve(datas)
      }
    }

    request.onerror = function (event) {
      reject(event)
    }
  })
}
