import { useEffect } from 'react';

const useDocumentTitle = (title, prevailOnUnmount = false) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} | Teaching Torch`;

    return () => {
      if (!prevailOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [title, prevailOnUnmount]);
};

export default useDocumentTitle;
