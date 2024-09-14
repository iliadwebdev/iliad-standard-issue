// Default styles
import defaultStyles from './useRippleDefaultStyles.module.scss';
import clsx from 'clsx';

// React
import { useEffect, useState, useRef } from 'react';

// Mantine
import { useDebouncedState } from '@mantine/hooks';

function round(value) {
  return Math.round(value * 100) / 100;
}

function useRipple(rippleClassName = '') {
  const rippleRef = useRef(null);
  //ripples are just styles that we attach to span elements
  const [ripples, setRipples] = useState([]);

  //add a debounce so that if the user doesn't click after 1s, we remove the ripples
  const [_debounced, _setDebounced] = useDebouncedState(ripples, 1000);

  function clickHandler({ clientX, clientY }, button) {
    let { clientWidth, clientHeight } = button;
    let size = Math.max(clientWidth, clientHeight);

    let { left, top } = button.getBoundingClientRect();
    let relativeLeft = round(clientX - left - size / 2);
    let relativeTop = round(clientY - top - size / 2);

    setRipples([
      ...ripples,
      {
        left: `${relativeLeft}px`,
        top: `${relativeTop}px`,
        height: `${size}px`,
        width: `${size}px`,
      },
    ]);
  }

  useEffect(() => {
    let controller = new AbortController();
    //check if there's a ref
    if (rippleRef.current) {
      const button = rippleRef.current;

      //add an event listener to the button
      button.addEventListener('click', (e) => clickHandler(e, button), {
        signal: controller.signal,
      });

      //clean up when the component is unmounted
      return () => {
        controller.abort();
      };
    }
  }, [rippleRef, ripples]);

  // Clear ripples if user hasn't interacted with the button for 1s
  useEffect(() => {
    if (_debounced.length) {
      setRipples([]);
    }
  }, [_debounced.length]);

  // If the ripples change, update the debounced state
  useEffect(() => {
    if (ripples.length) {
      _setDebounced(ripples);
    }
  }, [ripples]);

  //map through the ripples and return span elements.
  //this will be added to the button component later
  let state_ripples = ripples?.map((style, i) => {
    return (
      <span
        key={i}
        style={style}
        data-ripple='true'
        className={clsx(rippleClassName, defaultStyles.ripple)}
      />
    );
  });

  return [state_ripples, rippleRef, defaultStyles.rippleContainer];
}

function useRipples(rippleClassName = '') {
  const ripplesRefByKey = useRef({});
  const [ripples, _setRipples] = useState({});
  const timersRef = useRef({});

  function clickHandler({ clientX, clientY }, [key, element]) {
    let { clientWidth, clientHeight } = element;
    let size = Math.max(clientWidth, clientHeight);

    let { left, top } = element.getBoundingClientRect();
    let relativeLeft = round(clientX - left - size / 2);
    let relativeTop = round(clientY - top - size / 2);

    let ripple = {
      left: `${relativeLeft}px`,
      top: `${relativeTop}px`,
      height: `${size}px`,
      width: `${size}px`,
    };

    addRipple(key, ripple);
  }

  function addRipple(key, ripple) {
    _setRipples((prev) => {
      return {
        ...prev,
        [key]: [...(prev[key] || []), ripple],
      };
    });
    scheduleRemoval(key);
  }

  function scheduleRemoval(key) {
    let timeout = timersRef?.current?.[key];
    if (timeout) {
      clearTimeout(timeout);
    }

    timersRef.current[key] = setTimeout(() => {
      removeRipple(key);
    }, 1000);
  }

  function removeRipple(key) {
    _setRipples((prev) => {
      let { [key]: _, ...rest } = prev;
      return rest;
    });
  }

  useEffect(() => {
    let controllers = [];

    for (let [key, element] of Object.entries(ripplesRefByKey.current)) {
      let controller = new AbortController();
      element.addEventListener(
        'click',
        (e) => clickHandler(e, [key, element]),
        {
          signal: controller.signal,
        }
      );
      controllers.push(controller);
    }

    return () => {
      for (let controller of controllers) {
        controller.abort();
      }
    };
  }, [ripplesRefByKey, ripples]);

  function getRipplesRef(element, key) {
    if (!ripplesRefByKey.current[key]) {
      ripplesRefByKey.current[key] = element;
    }

    return ripplesRefByKey.current[key];
  }

  function getRipples(key) {
    let __ripples = ripples[key] || [];
    return __ripples?.map((style, i) => {
      return (
        <span
          key={i}
          style={style}
          data-ripple='true'
          className={clsx(rippleClassName, defaultStyles.ripple)}
        />
      );
    });
  }

  useEffect(() => {
    () => {};
    return () => {
      for (let timer of Object.values(timersRef.current)) {
        clearTimeout(timer);
      }
    };
  }, []);

  return [getRipples, getRipplesRef, defaultStyles.rippleContainer];
}

export default useRipple;

export { useRipples, useRipple };
