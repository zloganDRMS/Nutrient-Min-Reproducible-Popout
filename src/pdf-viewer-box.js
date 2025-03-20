import { PdfViewer } from './pdf-viewer';
import { usePdfViewerWindow } from './use-pdf-viewer-window';
export const PdfViewerBox = (props) => {
  const { base64, setViewImage } = props;
  const {
    viewInNewWindow
  } = usePdfViewerWindow();
  const handleBackClick = () => {
    setViewImage(false);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <div
        style={{
          height: '5vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <button onClick={handleBackClick}>Back</button>
      </div>
      {viewInNewWindow ? 
        <div style={{ height: '95vh' }}>
        </div>
        :
        <div style={{ height: '95vh' }}>
          <PdfViewer 
          base64={base64} 
          />
        </div>
      }
    </div>
  );
};
