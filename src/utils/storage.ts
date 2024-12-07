const STORAGE_PREFIX = 'cove_';

export const saveToStorage = (key: string, data: any): void => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    if (data === null) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
    console.log(`Saved to storage: ${storageKey}`, data);
  } catch (error) {
    console.error(`Error saving to storage:`, error);
  }
};

export const loadFromStorage = (key: string): any => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const data = localStorage.getItem(storageKey);
    const parsed = data ? JSON.parse(data) : null;
    console.log(`Loaded from storage: ${storageKey}`, parsed);
    return parsed;
  } catch (error) {
    console.error(`Error loading from storage:`, error);
    return null;
  }
};

export const clearStorage = (key?: string): void => {
  try {
    if (key) {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(storageKey);
      console.log(`Cleared storage key: ${storageKey}`);
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log('Cleared all storage');
    }
  } catch (error) {
    console.error(`Error clearing storage:`, error);
  }
};