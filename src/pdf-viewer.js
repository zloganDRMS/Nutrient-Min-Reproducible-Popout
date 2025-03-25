import { useEffect, useRef, useState} from 'react';
import { usePdfViewerWindow } from './use-pdf-viewer-window';

export const PdfViewer = (props) => {
  const {
    base64, 
    viewInNewWindow,
  } = props;
  
  const {
    popin,
    popout,
  } = usePdfViewerWindow();
  const containerRef = useRef(null);
  const PSPDFKitRef = useRef(null);
  const instanceRef = useRef(null);
  const isLoadingRef = useRef(false);

  const unloadPdfViewer = async (container) => {
    if (PSPDFKitRef.current && instanceRef.current) {
      try {
        await PSPDFKitRef.current.unload(container);
        instanceRef.current = null;
      } catch (error) {
        console.error('Error unloading PSPDFKit:', error);
      }
    }
  };

  const popoutTool = {
    type: 'custom',
    id: 'popout-button',
    title: viewInNewWindow ? 'Pop in' : 'Pop out',
    onPress: (event) => {
      if (viewInNewWindow) {
        popin();
      } else {
        popout();
      }
    },
    icon: viewInNewWindow
      ? '/popin.svg'
      : '/popout.svg',
  };

  const loadPdfViewer = async (container) => {
    if(!container || !base64?.image || isLoadingRef.current) {
      return;
    }
    isLoadingRef.current = true;
      try {
        PSPDFKitRef.current = PSPDFKitRef.current || await import('@nutrient-sdk/viewer');
        await unloadPdfViewer(container);
        instanceRef.current = await PSPDFKitRef.current.load({
          theme: PSPDFKitRef.current.Theme.AUTO,
          container: container,
          styleSheets: [],
          document: `data:application/pdf;base64,${base64.image}`,
          baseUrl: `${window.location.protocol}//${window.location.host}/`,
          printOptions: {
            mode: PSPDFKitRef.current.PrintMode.EXPORT_PDF,
            quality: PSPDFKitRef.current.PrintQuality.HIGH,
          },
          toolbarItems: [
            ...makeToolbar(PSPDFKitRef.current.defaultToolbarItems),
          ],
          licenseKey: process.env.REACT_APP_PSPDFKIT_KEY,
          useIframe: true,
        });
      }
      catch(e) {
        console.error('Error in useEffect:', e.message, e.stack);
      }
      finally {
        isLoadingRef.current = false;
      }
  }

  const makeToolbar = (defaultItems) => {
    return [popoutTool, ...defaultItems];
  };
  useEffect(() => {
    const container = containerRef.current;
    if(PSPDFKitRef.current) PSPDFKitRef.current.unload(container);
    loadPdfViewer(container);
    return () => {
      unloadPdfViewer(container);
    };
  }, [base64, viewInNewWindow]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
