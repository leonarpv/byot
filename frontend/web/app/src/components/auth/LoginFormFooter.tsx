import * as React from 'react';
import {Box} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {Button} from '@byot-frontend/web-common/src/components/elementary/form/Button';
import {useTranslation} from '@byot-frontend/common/src/i18n/UseTranslation';
import {Router} from '../../router/Router';

interface Props {}

export const LoginFormFooter: React.FC<Props> = (props: Props) => {
  const {t} = useTranslation();
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" mt={4}>
      <Button variant="text" component={Link} to={Router.resetPassword.URI()}>
        {t('Forgot password?')}
      </Button>
      <Button color="secondary" variant="text" component={Link} to={Router.register.URI()}>
        {t("Don't have an account?")}
      </Button>
    </Box>
  );
};
