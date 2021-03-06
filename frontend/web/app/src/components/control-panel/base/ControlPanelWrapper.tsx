import * as React from 'react';
import {makeStyles, Theme} from '@material-ui/core';
import {WithStyles} from '@byot-frontend/web-common/src/types/WithStyles';
import {ControlPanelSidebar} from './ControlPanelSidebar';
import {LinkMenuItem} from '@byot-frontend/common/src/types/app/structurals/MenuItem';

interface Props extends WithStyles<typeof styles> {
  children: React.ReactNode;
  menuItems: LinkMenuItem[];
  selected?: string;
}

const styles = (theme: Theme) => ({
  content: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '33%',
      paddingBottom: theme.spacing(10),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: '25%',
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '20%',
    },
  },
});
const useStyles = makeStyles(styles);

export const ControlPanelWrapper: React.FC<Props> = (props: Props) => {
  const styles = useStyles(props);
  return (
    <>
      <ControlPanelSidebar selected={props.selected} menuItems={props.menuItems} />
      <div className={styles.content}>{props.children}</div>
    </>
  );
};
