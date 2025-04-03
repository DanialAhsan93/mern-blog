import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  window.history.scrollRestoration = 'manual';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return null
}

export default ScrollToTop;

// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     // Disable the browser's default scroll restoration behavior
//     window.history.scrollRestoration = 'manual';

//     // Scroll to top after the component mounts and route changes
//     const timer = setTimeout(() => {
//       window.scrollTo(0, 0);
//     }, 100); // Small delay to ensure the page has time to render

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [pathname]);

//   return null;
// }

// export default ScrollToTop;