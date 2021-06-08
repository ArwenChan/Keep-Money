import React, { ChangeEvent, ReactNode } from 'react'
import clsx from 'clsx'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import { Bill } from '../../utils/dataHandler'
import TextField from '@material-ui/core/TextField'
import classes from './Table.module.scss'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]?: number | string },
  b: { [key in Key]?: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  isNumber: boolean
  id: keyof Bill
  label: string
}

const headCells: HeadCell[] = [
  { id: 'category', isNumber: false, label: '分类' },
  { id: 'amount', isNumber: true, label: '金额' },
  { id: 'time', isNumber: true, label: '时间' },
]

interface EnhancedTableHeadProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Bill
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  filter: ReactNode
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    filter: Filter,
  } = props
  const createSortHandler =
    (property: keyof Bill) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.isNumber ? 'right' : 'left'}
            padding="default"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isNumber ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              Filter
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  onDelete: () => void
  onChangeMonth: (event: ChangeEvent) => void
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, onDelete, onChangeMonth } = props

  return (
    <Toolbar
      className={clsx(classes.toolbarRoot, {
        [classes.toolbarHighlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.toolbarTitle}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.toolbarTitle}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Keep Money
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <TextField
          id="date"
          type="month"
          onChange={onChangeMonth}
          data-testid="calendar"
          inputProps={{ role: 'month' }}
        />
      )}
    </Toolbar>
  )
}

interface EnhancedTableProps {
  data: Array<Bill>
  categoriesMapping: any
  deleteData: (bills: Array<number>) => void
  changeMonth: (event: ChangeEvent) => void
  filter: ReactNode
}

function EnhancedTable(props: EnhancedTableProps) {
  const {
    data: rows,
    categoriesMapping,
    deleteData,
    changeMonth,
    filter,
  } = props
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Bill>('time')
  const [selected, setSelected] = React.useState<number[]>([])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Bill
  ) => {
    if (property !== 'category') {
      const isAsc = orderBy === property && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(property)
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.id!)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, key: number) => {
    const selectedIndex = selected.indexOf(key)
    let newSelected: number[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, key)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleDelete = () => {
    deleteData(selected)
    setSelected([])
  }

  const isSelected = (key: number) => selected.includes(key)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDelete={handleDelete}
          onChangeMonth={changeMonth}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="bill"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              filter={filter}
            />
            <TableBody>
              {stableSort<Bill>(
                rows,
                getComparator<keyof Bill>(order, orderBy)
              ).map((row, index) => {
                const isItemSelected = isSelected(row.id!)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id!)}
                    role="item"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {categoriesMapping[row.category]?.name}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={clsx({
                        [classes.outcomeMoney]: row.type === 0,
                      })}
                    >
                      {row.amount}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(Number(row.time)).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}

export default React.memo(EnhancedTable)
