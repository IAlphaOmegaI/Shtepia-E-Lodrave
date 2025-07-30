import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Use atomWithStorage to persist auth state, with initial value of false to avoid hydration mismatch
// The actual auth state will be set by AuthProvider after mount
export const authorizationAtom = atomWithStorage('isAuthorized', false);