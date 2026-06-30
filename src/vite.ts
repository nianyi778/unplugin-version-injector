import type { Plugin } from 'vite';
import { createVersionInjector } from './core';
import type {VersionInjectorOptions} from "./types";

export default function versionInjectorPlugin(options:VersionInjectorOptions = {}): Plugin {
  const inject = createVersionInjector(options);

  return {
    name: 'vite-version-injector',
    transformIndexHtml(html) {
      return inject(html);
    },
  };
}