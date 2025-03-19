import { useEffect, useRef, useState } from 'react';import 
{ pdf } from '@react-pdf/renderer';
import { RecordingLabelPdf } from './pdf-viewer-label-recording';
import { usePdfViewerWindow } from './use-pdf-viewer-window';

export const PdfViewer = (props) => {
  const { 
    height = '100%', 
    base64, 
    viewInNewWindow,
    setRecordingLabels,
  } = props;
  
  const {
    popin,
    popout,
  } = usePdfViewerWindow();
  const containerRef = useRef(null);
  const PSPDFKitRef = useRef(null);
  const instanceRef = useRef(null);
  let instance;
  let recordingLabelId;
  

  const editTools = [
    {
      type: 'custom',
      id: 'recording-label-button',
      dropdownGroup: 'label-group',
      title: 'Recording Label',
      onPress: (event) => {
        const label = new PSPDFKitRef.current.Annotations.ImageAnnotation({
          pageIndex: instanceRef.current.viewState.currentPageIndex,
          contentType: 'application/pdf',
          imageAttachmentId: recordingLabelId,
          description: 'Recording Label',
          boundingBox: new PSPDFKitRef.current.Geometry.Rect({
            left: 25,
            top: 25,
            width:200,
            height:60,
          }),
        });
        instanceRef.current.create(label);
        if (setRecordingLabels)
          setRecordingLabels((prevState) => [
            ...prevState,
            base64.id,
          ]);
      },
    },
  ].filter(Boolean);
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

  const makeToolbar = (defaultItems) => {
    return [...editTools, popoutTool, ...defaultItems];
  };
  useEffect(() => {
    const container = containerRef.current;
    if(base64)
    {
      (async () => {
        try {
          PSPDFKitRef.current = await import('pspdfkit');
          await PSPDFKitRef.current.unload(container)
          console.log(instanceRef);
          if(instanceRef.current) {
            await PSPDFKitRef.current.unload(container);
          }
          instanceRef.current = await PSPDFKitRef.current.load({
            theme: PSPDFKitRef.current.Theme.AUTO,
            container: container,
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
          });
          const recordingLabelBlob = await pdf(<RecordingLabelPdf />).toBlob();
          recordingLabelId = await instanceRef.current.createAttachment(recordingLabelBlob);
        }
        catch(e) {
          console.error('Error in useEffect:', e.message, e.stack);
        }
      })();
    }
    else {
      console.log('base64 is falsy');
    }
    return () => {
      console.log(PSPDFKitRef)
      if(PSPDFKitRef.current && instanceRef.current) {
        PSPDFKitRef.current.unload(container);
        instanceRef.current = null;
      }
    };
  }, [base64]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
