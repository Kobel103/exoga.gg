import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';
import path from 'path';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      // Match the flat file structure: src/app/common/i18n/en.json, fr.json, etc.
      loadPath: path.join(__dirname, '{{lng}}.json')
    },
    detection: {
      order: ['header', 'querystring', 'cookie'],
      caches: []
    },
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false
    }
  });

export { i18next };
export const i18nMiddleware = middleware.handle(i18next);
