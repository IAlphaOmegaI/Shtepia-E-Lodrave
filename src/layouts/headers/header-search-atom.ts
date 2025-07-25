import { atom, useAtom } from 'jotai';

const headerSearchAtom = atom(false);

export const useHeaderSearch = () => {
  const [show, setShow] = useAtom(headerSearchAtom);
  
  const showHeaderSearch = () => setShow(true);
  const hideHeaderSearch = () => setShow(false);
  
  return { show, showHeaderSearch, hideHeaderSearch };
};