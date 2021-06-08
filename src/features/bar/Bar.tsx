import { IconButton } from '@material-ui/core'
import classes from './Bar.module.scss'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'

interface BarProps {
  summary: [number, number]
  openDialog: () => void
  openModal: () => void
}

function Bar(props: BarProps) {
  const { summary, openDialog, openModal } = props
  return (
    <div className={classes.bar}>
      <span className={classes.barSummary} data-testid="bar-string">
        收入：{summary[0]}，
        <span className={classes.red}>支出：{summary[1]}</span>
        <span className={classes.underline} onClick={openModal}>
          更多
        </span>
      </span>
      <IconButton
        className={classes.button}
        onClick={openDialog}
        data-testid="add-button"
      >
        <AddCircleIcon
          style={{ fontSize: 60, color: 'black' }}
          className={classes.icon}
        />
      </IconButton>
    </div>
  )
}

export default React.memo(Bar)
