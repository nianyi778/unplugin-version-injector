import { versionInjectorPlugin } from './core';
import type { VersionInjectorOptions } from './types';

export default function versionInjector(options: VersionInjectorOptions = {}) {
  return versionInjectorPlugin.webpack(options);
}