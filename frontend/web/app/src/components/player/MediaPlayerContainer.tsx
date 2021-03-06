import * as React from 'react';
import {MediaPlayerSkeleton} from './MediaPlayerSkeleton';
import {makeStyles, Theme} from '@material-ui/core';
import {CSSProperties} from '@material-ui/styles';

interface Props {
  children?: React.ReactNode;
  ratio?: '16:9' | '4:3';
}

const styles = (theme: Theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    minHeight: theme.spacing(10),
  } as CSSProperties,
  skeleton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
  } as CSSProperties,
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 20,
    borderRadius: theme.shape.borderRadius,
  } as CSSProperties,
});
const useStyles = makeStyles(styles);

export const MediaPlayerContainer: React.FC<Props> = (props: Props) => {
  const styles = useStyles(props);
  const [height, setHeight] = React.useState(0);
  const [node, setNode] = React.useState<HTMLDivElement | undefined>(undefined);
  const ref = React.useCallback(node => setNode(node), []);
  const ratio = props.ratio || '16:9';
  React.useLayoutEffect(() => {
    const onResize = () => {
      const width = node?.getBoundingClientRect().width || 0;
      if (width > 0) {
        const [w, h] = ratio.split(':');
        setHeight((width / parseInt(w)) * parseInt(h));
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [node, ratio]);
  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.skeleton}>
        <MediaPlayerSkeleton />
      </div>
      {height > 0 && (
        <div
          className={styles.container}
          style={{height: `${height}px`}}
          data-testid="media-player-container">
          {props.children}
        </div>
      )}
    </div>
  );
};
