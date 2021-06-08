import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import ListSubheader from '@material-ui/core/ListSubheader'
import classes from './Filter.module.scss'
import { Category } from '../../utils/dataHandler'
import { ReactComponent as FilterAltIcon } from './filter.svg'
import { ReactComponent as FilterAltOutlinedIcon } from './filter-outlined.svg'

interface MultipleSelectFilterProps {
  categories: Category[]
  filters: string[]
  onChange: (a: string[]) => void
}

function MultipleSelectFilter(props: MultipleSelectFilterProps) {
  const { categories, filters, onChange } = props

  const incomeCategory = categories.filter((v) => v.type === 1)
  const outcomeCategory = categories.filter((v) => v.type === 0)

  const hasFilters = React.useMemo(() => filters.length > 0, [filters])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(event.target.value as string[])
  }

  return (
    <FormControl>
      <Select
        labelId="mutiple-checkbox-filter-label"
        id="mutiple-checkbox-filter"
        data-testid="mutiple-checkbox-filter"
        multiple
        value={filters}
        onChange={handleChange}
        renderValue={(value) => <p className={classes.render}>分类</p>}
        displayEmpty={true}
        className={classes.filter}
        IconComponent={hasFilters ? FilterAltIcon : FilterAltOutlinedIcon}
      >
        <ListSubheader className={classes.listSubHeader}>收入</ListSubheader>
        {incomeCategory.map((category) => (
          <MenuItem
            value={category.id}
            key={category.id}
            className={classes.item}
          >
            <Checkbox checked={filters.indexOf(category.id) > -1} />
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
        <ListSubheader className={classes.listSubHeader}>支出</ListSubheader>
        {outcomeCategory.map((category) => (
          <MenuItem
            value={category.id}
            key={category.id}
            className={classes.item}
          >
            <Checkbox checked={filters.indexOf(category.id) > -1} />
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default React.memo(MultipleSelectFilter)
