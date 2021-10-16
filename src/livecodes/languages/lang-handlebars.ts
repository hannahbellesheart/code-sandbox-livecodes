import { LanguageSpecs } from '../models';
import { parserPlugins } from './prettier';
import { escapeCode, getLanguageCustomSettings } from './utils';

const url = 'https://cdn.jsdelivr.net/npm/handlebars@4.7.7/dist/handlebars.min.js';
const runtimeUrl = 'https://cdn.jsdelivr.net/npm/handlebars@4.7.7/dist/handlebars.runtime.min.js';

export const handlebars: LanguageSpecs = {
  name: 'handlebars',
  title: 'Handlebars',
  parser: {
    name: 'glimmer',
    pluginUrls: [parserPlugins.glimmer],
  },
  compiler: {
    url,
    factory: () => async (code, { config }) => {
      const options = getLanguageCustomSettings('handlebars', config);
      const data = config.customSettings.template?.data || {};

      if (config.customSettings.template?.prerender !== false) {
        const template = (self as any).Handlebars.compile(code, options);
        return template(data);
      }

      const templateSpec = (self as any).Handlebars.precompile(code, options);
      return `<!-- ... compiling ... -->

  <script src="${runtimeUrl}"></script>
  <script>
  window.addEventListener("load", () => {
    const template = Handlebars.template(${templateSpec});
    const content = template({
      ...${escapeCode(JSON.stringify(data || {}))},
      ...window.templateData,
    });
    document.body.innerHTML += content
    parent.postMessage({type: 'compiled', payload: {language: 'handlebars', content}}, '*');
  });
  </script>
  `;
    },
  },
  extensions: ['hbs', 'handlebars'],
  editor: 'markup',
  editorLanguage: 'html',
};
