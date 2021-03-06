import * as React from 'react';
import {FormHelperText, Grid, makeStyles, Theme, WithStyles} from '@material-ui/core';
import {PlainLayoutNarrow} from '../plain-layout/PlainLayoutNarrow';
import {PlainLayoutTitle} from '../plain-layout/PlainLayoutTitle';
import {Form, Formik} from 'formik';
import {TFunction} from 'i18next';
import {UserRegister} from '@byot-frontend/common/src/types/dto/UserRegister';
import {Input} from '../elementary/form/Input';
import {Button} from '../elementary/form/Button';
import {IUserRegister} from '@byot-frontend/common/src/types/interfaces/IUserRegister';
import {Checkbox} from '../elementary/form/Checkbox';
import {useTranslation} from 'react-i18next';
import {registrationSchema} from '@byot-frontend/common/src/types/schemas/validation/RegistrationSchema';

interface Props extends Partial<WithStyles<typeof styles>> {
  onRegister: (values: IUserRegister) => void;
  loading?: boolean;
  children?: React.ReactNode;
}

const styles = (theme: Theme) => ({
  checkbox: {
    fontWeight: 300,
    fontSize: theme.typography.pxToRem(13),
  },
});
const useStyles = makeStyles(styles);

export const RegistrationForm: React.FC<Props> = (props: Props) => {
  const initialValues = {
    ...new UserRegister(),
    consent: false,
    passwordRepeat: '',
  };
  const styles = useStyles(props);
  const {t} = useTranslation();
  const [password, setPassword] = React.useState(initialValues.password);

  return (
    <PlainLayoutNarrow>
      <PlainLayoutTitle>{t('Sign up')}</PlainLayoutTitle>
      <Formik
        onSubmit={(values: typeof initialValues) => props.onRegister(new UserRegister(values))}
        validateOnChange
        validateOnBlur
        validationSchema={registrationSchema(t, password)}
        initialValues={initialValues}>
        {({values, touched, errors, handleChange, handleBlur}) => (
          <Form data-testid="common-auth-registration-form-form">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  value={values.firstName}
                  onChange={handleChange('firstName')}
                  name="firstName"
                  data-testid="common-auth-registration-form-firstName"
                  onBlur={handleBlur('firstName')}
                  label={t('First name')}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={values.lastName}
                  onChange={handleChange('lastName')}
                  name="lastName"
                  data-testid="common-auth-registration-form-lastName"
                  onBlur={handleBlur('lastName')}
                  label={t('Last name')}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  type="email"
                  value={values.email}
                  error={!!(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  onChange={handleChange('email')}
                  name="email"
                  data-testid="common-auth-registration-form-email"
                  onBlur={handleBlur('email')}
                  label={t('Email')}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  type="password"
                  value={values.password}
                  error={!!(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  onChange={e => {
                    handleChange('password')(e);
                    setPassword(e.target.value);
                  }}
                  onBlur={handleBlur('password')}
                  name="password"
                  data-testid="common-auth-registration-form-password"
                  label={t('Password')}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  type="password"
                  value={values.passwordRepeat}
                  error={!!(touched.passwordRepeat && errors.passwordRepeat)}
                  helperText={touched.passwordRepeat && errors.passwordRepeat}
                  onChange={handleChange('passwordRepeat')}
                  onBlur={handleBlur('passwordRepeat')}
                  name="passwordRepeat"
                  data-testid="common-auth-registration-form-passwordRepeat"
                  label={t('Confirm password')}
                />
              </Grid>
              <Grid item xs={12}>
                <Checkbox
                  color="primary"
                  label={t('I allow this website to collect and store submitted data.')}
                  classes={{label: styles.checkbox}}
                  onChange={handleChange('consent')}
                  checked={values.consent}
                  data-testid="common-auth-registration-form-consent"
                />
                {touched.consent && errors.consent && (
                  <FormHelperText error>
                    {t('You have to allow this website to collect the data.')}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth loading={props.loading}>
                  {t('Sign up')}
                </Button>
              </Grid>
            </Grid>

            {props.children}
          </Form>
        )}
      </Formik>
    </PlainLayoutNarrow>
  );
};
