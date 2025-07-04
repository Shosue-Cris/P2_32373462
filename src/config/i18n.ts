import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

// Para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de i18n
i18n.configure({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  directory: path.join(__dirname, 'locales'),
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  syncFiles: true,
  objectNotation: true,
});

export default i18n;