import React, { useEffect, useRef } from 'react';

const GoogleTranslate = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (document.querySelector('#google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate && !isInitialized.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr,te,ta,kn,gu,pa,bn,ml',
            // OMITTING layout PROPERTY FORCES A NATIVE HTML <select> TAG
          },
          'google_translate_element'
        );
        isInitialized.current = true;

        // Fix the dropdown reset issue - ensure it always shows something
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement) {
            // Ensure the first option is always "Select Language" with empty value
            const firstOption = selectElement.options[0];
            if (firstOption) {
              firstOption.value = '';
              firstOption.text = 'Select Language';
            }

            // Function to ensure dropdown always has a visible value
            const ensureDropdownValue = () => {
              // If no value is selected or it's blank, reset to first option (Select Language)
              if (!selectElement.value || selectElement.selectedIndex === -1) {
                selectElement.selectedIndex = 0;
              }
            };

            // Monitor for when Google Translate resets the dropdown
            const observer = new MutationObserver(() => {
              ensureDropdownValue();
            });
            
            observer.observe(selectElement, {
              attributes: true,
              childList: true,
              subtree: true
            });

            // Also listen for change events
            selectElement.addEventListener('change', () => {
              setTimeout(ensureDropdownValue, 200);
            });

            // Initial check
            ensureDropdownValue();

            // Periodic check to catch any edge cases
            const intervalId = setInterval(ensureDropdownValue, 500);
            
            // Cleanup interval after 10 seconds (should be stable by then)
            setTimeout(() => clearInterval(intervalId), 10000);
          }
        }, 1000);
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      isInitialized.current = false;
    };
  }, []);

  return (
    <div className="h-9 overflow-hidden flex items-center">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
