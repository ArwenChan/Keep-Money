import { IconButton } from '@material-ui/core'
import classes from './Bar.module.scss'
import AddCircleIcon from '@material-ui/icons/AddCircle'

// interface BarProps {
//   addData: (bill: Bill) => void
// }
export default function Bar() {
  //   const { addData } = props
  return (
    <div className={classes.bar}>
      <IconButton className={classes.button}>
        <AddCircleIcon
          style={{ fontSize: 60, color: 'black' }}
          className={classes.icon}
        />
      </IconButton>
    </div>
  )
}
