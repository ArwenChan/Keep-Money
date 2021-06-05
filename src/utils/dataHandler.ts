import Papa from 'papaparse'
import { openDB, readAllRecord, readAllRecordWithKey } from './dbHelper'

export interface Bill {
  id?: number
  type: 0 | 1
  category: string
  amount: number
  time: number
  month: string
}

export interface Category {
  id: string
  name: string
  type: 0 | 1
}

export async function readCSV<T>(path: string): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(path, {
      download: true,
      header: true,
      complete: (results) => {
        resolve(results.data)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}

export function getMonth(milliseconds?: number): string {
  const date: Date = milliseconds ? new Date(milliseconds) : new Date()
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getCategoryMapping(categories: Array<Category>) {
  let result: any = {}
  categories.forEach((v) => {
    result[v.id] = { name: v.name, type: v.type }
  })
  return result
}

async function initData(): Promise<[Bill[], Category[]]> {
  return openDB().then(async () => {
    return Promise.all([
      readAllRecordWithKey<Bill>('data'),
      readAllRecord<Category>('category'),
    ])
  })
}

export function computeSummary(data: Bill[]): [number, number] {
  let income = 0
  let outcome = 0
  data.forEach((bill) => {
    if (bill.type === 0) {
      outcome += bill.amount
    } else {
      income += bill.amount
    }
  })
  return [income, outcome]
}

class BaseResource {
  data: any
  status: 'pending' | 'error' | 'success' = 'pending'
  error: any
  promise: Promise<any> | null = null
  read() {
    switch (this.status) {
      case 'pending':
        throw this.promise
      case 'error':
        throw this.error
      default:
        return this.data
    }
  }
}

class AsyncResource extends BaseResource {
  constructor(promise: any) {
    super()
    this.promise = promise
      .then((data: any) => {
        this.status = 'success'
        this.data = data
      })
      .catch((error: any) => {
        this.status = 'error'
        this.error = error
      })
  }
}

export const initResource = new AsyncResource(initData())
