'use client'
import { throttle } from 'throttle-debounce';
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const validateEmail = (email:FormDataEntryValue | null) => {
    if (typeof email === 'string' || email instanceof String) {
        return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
    return null
  };

  interface Window {
    width: undefined | number;
    height: undefined | number;
  }

  const initState: Window = {
    width: undefined,
    height: undefined
  }

  export function useWindowSize() {
    const [windowSize, setWindowSize]: [Window, Dispatch<SetStateAction<Window>>] = useState(initState);
  
    useEffect(() => {
      function handleResize() {
        throttle(250, () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        })
      }
      
      window.addEventListener("resize", handleResize);
       
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }