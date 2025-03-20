import { Backdrop, CircularProgress } from '@mui/material';
import { PdfViewer } from './pdf-viewer';
import { PdfViewerWindowProvider } from './pdf-viewer-window-context';

export const PdfViewerWindowed = (props) => {
  const {
    base64,
    loadingWindow,
    setLoadingWindow,
    settings,
    blob,
    theme,
    setRecordingLabels,
    popin,
    popout,
  } = props;
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PdfViewerWindowProvider>
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
        </PdfViewerWindowProvider>
      </div>
      <Backdrop
        sx={{
          position: 'absolute',
          zIndex: 9999,
        }}
        open={loadingWindow}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
};