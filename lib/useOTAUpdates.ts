import { useEffect } from 'react';
import * as Updates from 'expo-updates';

// Проверяет EAS Update при запуске: скачивает новый JS-бандл и сразу
// перезапускает приложение. В dev-режиме (__DEV__) выключено.
export function useOTAUpdates() {
  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {
        // нет сети или updates не настроены — тихо продолжаем со старой версией
      }
    })();
  }, []);
}
