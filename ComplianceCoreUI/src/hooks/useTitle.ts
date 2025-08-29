import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para actualizar el título del documento (la pestaña del navegador).
 */
function useTitle(title: string, prevailOnUnmount: boolean = false) {
  // Guardamos una referencia al título original del documento para poder restaurarlo.
  // useRef se usa aquí para que el valor persista durante todo el ciclo de vida del componente
  // sin provocar nuevos renders si cambia.
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    // Cuando el componente se monta o el `title` cambia, actualizamos el título del documento.
    document.title = title;

    // Guardamos el título original en una variable local para usarlo en la limpieza.
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