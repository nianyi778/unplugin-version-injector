import type { Plugin } from 'vite';
import { createVersionInjector } from './core';

export default function versionInjectorPlugin(options = {}): Plugin {
  const inject = createVersionInjector(options);

  return {
    name: 'vite-version-injector',
    transformIndexHtml(html) {
      return inject(html);
    },
  };
}