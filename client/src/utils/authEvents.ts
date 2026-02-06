type AuthInvalidListener = () => void;

const authInvalidListeners = new Set<AuthInvalidListener>();

export function onAuthInvalid(listener: AuthInvalidListener) {
  authInvalidListeners.add(listener);
  return () => authInvalidListeners.delete(listener);
}

export function emitAuthInvalid() {
  authInvalidListeners.forEach((listener) => listener());
}
