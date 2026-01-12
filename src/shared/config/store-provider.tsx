'use client';

import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/app/providers/store';

let store: AppStore | undefined;

function getOrInitializeStore(): AppStore {
  if (!store) {
    store = makeStore();
  }
  return store;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeInstance = useMemo(() => getOrInitializeStore(), []);

  return <Provider store={storeInstance}>{children}</Provider>;
}
