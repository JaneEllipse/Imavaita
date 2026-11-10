// @ts-check
import { defineConfig } from 'astro/config';

// Remplacer par le domaine définitif d'IMAVAITA avant la mise en ligne.
export default defineConfig({
  site: 'https://imavaita.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
