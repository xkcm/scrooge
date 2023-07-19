import { LocalStorageDictionary } from "./local-storage.types";

function setItem<K extends keyof LocalStorageDictionary>(
  key: K,
  value: LocalStorageDictionary[K],
) {
  return localStorage.setItem(key, value);
}

function getItem<K extends keyof LocalStorageDictionary>(
  key: K,
): LocalStorageDictionary[K] | null {
  return localStorage.getItem(key);
}

export default {
  setItem,
  getItem,
};
