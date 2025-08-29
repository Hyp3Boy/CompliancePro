import { useEffect, useRef } from 'react';

function useTitle(title: string, prevailOnUnmount: boolean = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;

    const originalTitle = defaultTitle.current;

    // La función de limpieza de useEffect se ejecuta cuando el componente se va a desmontar.
    return () => {
      // Si `prevailOnUnmount` es falso, restauramos el título original.
      if (!prevailOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [title, prevailOnUnmount]); // El efecto se volverá a ejecutar si el título o la opción de prevalecer cambian.
}

export default useTitle;