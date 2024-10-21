'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";

  interface Window {
    width: undefined | number;
    height: undefined | number;
  }

  const initState: Window = {
    width: undefined,
    height: undefined
  }

  export const defaultAvatarSrc = "/uploads/default/default_avatar.jpg"

  export function useWindowSize() {
    const [windowSize, setWindowSize]: [Window, Dispatch<SetStateAction<Window>>] = useState(initState);
    useEffect(() => {
      let throttle = false;
      let timeoutId: NodeJS.Timeout
      function handleResize() {
        if (!throttle) {
          throttle = true;
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
          setTimeout(() => {
            throttle = false
          }, 250)
          window.clearTimeout(timeoutId)
          timeoutId = setTimeout(() => {
              setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
              });
          }, 400)
        }
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