import React, { useLayoutEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import classes from './AddBillDialog.module.scss'
import { Category } from '../../utils/dataHandler'

interface AddBillDialogProps {
  open: boolean
  categories: Category[]
  handleClose: () => void
  handleSubmit: (a: string, b: number) => void
}

function AddBillDialog(props: AddBillDialogProps) {
  const { open, handleClose, handleSubmit, categories } = props
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const incomeCategory = categories.filter((v) => v.type === 1)
  const outcomeCategory = categories.filter((v) => v.type === 0)

  function onSubmit() {
    if (category && amount) {
      handleSubmit(category, Number(amount))
    } else {
      handleClose()
    }
  }

  useLayoutEffect(() => {
    if (!open) {
      setAmount('')
      setCategory('')
    }
  }, [open])
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">添加记账</DialogTitle>
      <DialogContent>
        <FormControl className={classes.category}>
          <InputLabel htmlFor="grouped-select-category">类型</InputLabel>
          <Select
            defaultValue=""
            id="grouped-select-category"
            value={category}
            onChange={(e) => {
              setCategory((e.target as HTMLInputElement).value)
            }}
          >
            <ListSubheader className={classes.listSubHeader}>
              收入
            </ListSubheader>
            {incomeCategory.map((category) => (
              <MenuItem value={category.id} key={category.id}>
                {category.name}
              </MenuItem>
            ))}
            <ListSubheader className={classes.listSubHeader}>
              支出
            </ListSubheader>
            {outcomeCategory.map((category) => (
              <MenuItem value={category.id} key={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="金额"
            type="number"
            className={classes.amount}
            autoComplete="off"
            value={amount}
            onChange={(e) => {
              setAmount((e.target as HTMLInputElement).value)
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          取消
        </Button>
        <Button onClick={onSubmit} color="primary">
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(AddBillDialog)
