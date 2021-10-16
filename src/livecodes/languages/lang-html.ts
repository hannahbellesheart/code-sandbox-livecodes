import { LanguageSpecs } from '../models';
import { parserPlugins } from './prettier';

export const html: LanguageSpecs = {
  name: 'html',
  title: 'HTML',
  info: false,
  parser: {
    name: 'html',
    pluginUrls: [parserPlugins.html],
  },
  extensions: ['html', 'htm'],
  editor: 'markup',
};
