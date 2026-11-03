export function getItem(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null
    }
}

export function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}