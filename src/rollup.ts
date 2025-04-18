import type { Plugin } from 'rollup';
import { createVersionInjector } from './core';
import type { VersionInjectorOptions } from './types';

export default function versionInjector(options: VersionInjectorOptions = {}): Plugin {
  const shouldInject = options.log !== false;
  if (!shouldInject) {
    return { name: 'unplugin-version-injector' };
  }

  const processHtml = createVersionInjector(options);

  return {
    name: 'unplugin-version-injector',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.html')) {
          file.source = processHtml(file.source as string);
        }
      }
    },
  };
}