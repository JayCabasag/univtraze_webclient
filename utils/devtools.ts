import { DevtoolsOptions, devtools } from 'zustand/middleware';
import { StateCreator, StoreMutatorIdentifier } from 'zustand/vanilla';

type Devtools = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initializer: StateCreator<T, [...Mps, ['zustand/devtools', never]], Mcs>,
  devtoolsOptions?: DevtoolsOptions
) => StateCreator<T, Mps, [['zustand/devtools', never], ...Mcs]>;

type DevtoolsImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  devtoolsOptions?: DevtoolsOptions
) => StateCreator<T, [], []>;

const isDevEnv = process.env.REACT_APP_CUSTOM_NODE_ENV
  ? process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production'
  : process.env.NODE_ENV !== 'production';

const devOnlyDevtoolsImpl: DevtoolsImpl = (fn, devtoolsOptions = {}) => (set, get, api) => {
  if (isDevEnv) {
    return devtools(fn, devtoolsOptions)(set, get, api);
  }
  return fn(set, get, api);
};

export const devOnlyDevtools = devOnlyDevtoolsImpl as unknown as Devtools;