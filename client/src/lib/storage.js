// Storage utility with fallback for tracking prevention
class SafeStorage {
  constructor() {
    this.isAvailable = this.checkAvailability();
    this.fallbackStorage = new Map();
  }

  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using fallback storage');
      return false;
    }
  }

  setItem(key, value) {
    try {
      if (this.isAvailable) {
        localStorage.setItem(key, value);
      } else {
        this.fallbackStorage.set(key, value);
      }
    } catch (e) {
      this.fallbackStorage.set(key, value);
    }
  }

  getItem(key) {
    try {
      if (this.isAvailable) {
        return localStorage.getItem(key);
      } else {
        return this.fallbackStorage.get(key) || null;
      }
    } catch (e) {
      return this.fallbackStorage.get(key) || null;
    }
  }

  removeItem(key) {
    try {
      if (this.isAvailable) {
        localStorage.removeItem(key);
      } else {
        this.fallbackStorage.delete(key);
      }
    } catch (e) {
      this.fallbackStorage.delete(key);
    }
  }

  clear() {
    try {
      if (this.isAvailable) {
        localStorage.clear();
      } else {
        this.fallbackStorage.clear();
      }
    } catch (e) {
      this.fallbackStorage.clear();
    }
  }
}

export const safeStorage = new SafeStorage();