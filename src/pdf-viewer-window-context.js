import { useState, createContext, useEffect } from 'react';
import { PdfViewerWindowed } from './pdf-viewer-windowed';
import NewWindow from './new-window';
import { useTheme } from '@mui/material/styles';
const PdfViewerWindowContext = createContext();

const PdfViewerWindowProvider = ({ children, base64 }) => {
  const theme = useTheme();
  const [imageOpen, setImageOpen] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  const [loadingWindow, setLoadingWindow] = useState(false);
  const [features, setFeatures] = useState(null);
  const [newWindow, setNewWindow] = useState(null);
  const [viewerSettings, setViewerSettings] = useState({});
  const [blob, setBlob] = useState(null);
  const [viewInNewWindow, setViewInNewWindow] = useState(false);
  const [recordingLabels, setRecordingLabels] = useState([]);
  const [onClose, setOnClose] = useState(() => () => {});
  const [savedBase64, setSavedBase64] = useState(null);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.stopPropagation();
      resetPdfViewerWindowInfo();
      setWindowOpen(false);
      return undefined;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      resetPdfViewerWindowInfo();
    };
  }, []);
  useEffect(() => {
    if (features) {
      const featuresJSON = JSON.stringify(features);
      window.localStorage.setItem('viewerFeatures', featuresJSON);
    }
  }, [features]);

  const resetPdfViewerWindowInfo = () => {
    setLoadingWindow(false);
    setImageOpen(false);
    setSavedBase64(null);
    setViewerSettings({});
    setBlob(null);
    setOnClose(() => () => {});
    setRecordingLabels([]);
  };
  const getFeatures = async () => {
    if (
      !features ||
      !features.top ||
      !features.left ||
      !features.width ||
      !features.height
    ) {
      const featuresJSON =
        window.localStorage.getItem('viewerFeatures');
      if (featuresJSON) {
        const feats = JSON.parse(featuresJSON);
        setFeatures(feats);
        return;
      }
      const details = await window.getScreenDetails();
      if (!details) {
        throw new Error('Permission denied or not supported.');
      }

      const numOfScreens = details.screens.length;
      const currentScreen = details.currentScreen;

      let targetScreen =
        numOfScreens === 1
          ? currentScreen
          : details.screens.find(
              (screen) => screen !== currentScreen,
            );

      if (!targetScreen) {
        targetScreen = details.screens[1];
      }

      const left = targetScreen.availLeft;
      const top =
        targetScreen === currentScreen
          ? targetScreen.availHeight / 5
          : targetScreen.availTop;
      const width = targetScreen.availWidth;
      const height =
        targetScreen === currentScreen
          ? targetScreen.availHeight / 1.3
          : targetScreen.availHeight;

      setFeatures({
        left,
        top,
        width,
        height,
        fullScreen: targetScreen !== currentScreen,
      });
    }
  };
  const handleWindowUnloaded = () => {
    onClose();
    setWindowOpen(false);
    setNewWindow(null);
  };
  const handleWindowOpened = (newWindow) => {
    const ele = newWindow.document.getElementById(
      'new-window-container',
    );
    if (ele) ele.setAttribute('style', 'height:100%;width:100%;');
    setNewWindow(newWindow);
  };
  const waitForNewWindow = () => {
    return new Promise((resolve) => {
      const checkNewWindow = setInterval(() => {
        setNewWindow((currentWindow) => {
          if (currentWindow) {
            clearInterval(checkNewWindow);
            resolve();
          }
          return currentWindow;
        });
      }, 500);
    });
  };
  const openImage = async () => {
    setLoadingWindow(true);
    var viewerType = window.localStorage.getItem(`viewerType`);
    if (!newWindow && viewerType === 'window') {
      try {
        await getFeatures();
      } catch (error) {
        console.error('Error getting screen details:', error);
        popin();
        return;
      }
      setWindowOpen(true);
      await waitForNewWindow();
      setImageOpen(true);
      return;
    } else if (newWindow) {
      setImageOpen(true);
      return;
    }
    setLoadingWindow(false);
  };

  const popout = async () => {
    try {
      await getFeatures();
    } catch (error) {
      console.error('Error getting screen details:', error);
      popin();
      return;
    }
    window.localStorage.setItem('viewerType', 'window');
    setImageOpen(false);
    setViewInNewWindow(true);
    setWindowOpen(true);
    await waitForNewWindow();
    setImageOpen(true);
  };
  const popin = () => {
    window.localStorage.setItem('viewerType', 'standard');
    setViewInNewWindow(false);
    setImageOpen(false);
    setWindowOpen(false);
    setNewWindow(null);
  };

  return (
    <PdfViewerWindowContext.Provider
      value={{
        savedBase64,
        base64,
        viewInNewWindow,
        loadingWindow,
        viewerSettings,
        windowOpen,
        blob,
        recordingLabels,
        openImage,
        resetPdfViewerWindowInfo,
        setViewerSettings,
        setLoadingWindow,
        setOnClose,
        setImageOpen,
        setBlob,
        setSavedBase64,
        setRecordingLabels,
        popin,
        popout,
      }}>
      {children}
      {windowOpen && (
        <NewWindow
          name='Image Viewer'
          title='Image Viewer'
          features={features}
          setFeatures={setFeatures}
          onOpen={handleWindowOpened}
          onUnload={handleWindowUnloaded}
          copyStyles>
          {imageOpen && (
            <PdfViewerWindowed
              base64={base64}
              loadingWindow={loadingWindow}
              setLoadingWindow={setLoadingWindow}
              settings={viewerSettings}
              blob={blob}
              resetPdfViewerWindowInfo={resetPdfViewerWindowInfo}
              theme={theme}
              setRecordingLabels={setRecordingLabels}
              popin={popin}
              popout={popout}
            />
          )}
        </NewWindow>
      )}
    </PdfViewerWindowContext.Provider>
  );
};

export { PdfViewerWindowContext, PdfViewerWindowProvider };
