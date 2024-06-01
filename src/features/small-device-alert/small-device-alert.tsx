import { useEffect, useState } from 'react';

export const SmallDeviceAlert = () => {
  const [isVisible, setIsVisible] = useState(false);

  const doNotShowAgain = () => {
    setIsVisible(false);
    localStorage.setItem('smallDeviceWarning', 'true');
  };

  useEffect(() => {
    // retrieve from local storage
    const smallDeviceWarning = localStorage.getItem('smallDeviceWarning');

    if (!smallDeviceWarning) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className="small-device-notification-overlay select-none">
      <button onMouseUp={doNotShowAgain}>Do not show again</button>

      <h1>
        This web application is not intended for small devices, responsivness will be arranged in
        future
      </h1>
    </div>
  );
};
