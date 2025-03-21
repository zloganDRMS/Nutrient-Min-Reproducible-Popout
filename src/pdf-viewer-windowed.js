import { Backdrop, CircularProgress } from '@mui/material';
import { PdfViewerWindowProvider } from './pdf-viewer-window-context';
import { PdfViewer } from './pdf-viewer';

export const PdfViewerWindowed = (props) => {
  const {
    base64,
    setLoadingWindow,
    settings,
    blob,
    theme,
    setRecordingLabels,
    popin,
    popout,
  } = props;
  return (
    <div style={{
      height: '100vh',
      width: '100vw'
    }}>
      <PdfViewer
        height={'100%'}
        blob={blob}
        base64={base64}
        settings={settings}
        setLoading={setLoadingWindow}
        theme={theme}
        setRecordingLabels={setRecordingLabels}
        popin={popin}
        popout={popout}
        viewInNewWindow={true}
      />
    </div>
  );
};