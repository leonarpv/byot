import * as React from 'react';
import {ListItem, ListItemIcon, ListItemText, makeStyles, Theme} from '@material-ui/core';
import {WithStyles} from '@byot-frontend/web-common/src/types/WithStyles';
import {Link} from 'react-router-dom';
import {CreateCSSProperties, CSSProperties} from '@material-ui/styles';

interface Props extends WithStyles<typeof styles> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  link: string;
  selected?: boolean;
}

const styles = (theme: Theme) => ({
  root: {
    position: 'relative',
  } as CSSProperties,
  highlight: (props: Props) =>
    ({
      width: theme.spacing(1 / 2),
      backgroundColor: props.selected ? theme.palette.grey[300] : 'transparent',
      transition: `background-color ${theme.transitions.duration.standard}ms`,
      display: 'block',
      left: 0,
      top: 0,
      height: '100%',
      position: 'absolute',
    } as CreateCSSProperties<Props>),
  icon: (props: Props) =>
    ({
      color: props.selected
        ? theme.palette.secondary.main
        : theme.palette.type === 'light' && theme.palette.grey[500],
      transition: `color ${theme.transitions.duration.standard}ms`,
    } as CreateCSSProperties<Props>),
  textPrimary: (props: Props) =>
    ({
      color:
        theme.palette.type === 'light' &&
        (props.selected ? theme.palette.grey[900] : theme.palette.grey[500]),
      transition: `color ${theme.transitions.duration.standard}ms`,
      fontWeight: 500,
    } as CreateCSSProperties<Props>),
});
const useStyles = makeStyles(styles);

export const DrawerMenuItem: React.FC<Props> = (props: Props) => {
  const styles = useStyles(props);
  return (
    <ListItem
      button
      component={Link}
      to={props.link}
      classes={{root: styles.root}}
      data-testid="control-panel-drawer-menu-item">
      <span className={styles.highlight} />
      <ListItemIcon classes={{root: styles.icon}}>{props.icon}</ListItemIcon>
      <ListItemText classes={{primary: styles.textPrimary}} primary={props.children} />
    </ListItem>
  );
};
