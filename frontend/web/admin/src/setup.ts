import {createTheme} from '@byot-frontend/web-common/src/setup/CreateTheme';
import {storeFactory} from '@byot-frontend/common/src/redux/store/Store';
import {WebAdminState} from './redux/WebAdminState';
import {urlLanguageProvider} from '@byot-frontend/common/src/i18n/providers/UrlLanguageProvider';
import {createI18n} from '@byot-frontend/common/src/i18n/CreateI18n';

export const [i18n] = createI18n(
  {
    en: {},
    sk: {},
    cs: {},
  },
  urlLanguageProvider
);
export const theme = createTheme();
export const reduxStore = storeFactory(() => new WebAdminState(), 'webAdmin');
