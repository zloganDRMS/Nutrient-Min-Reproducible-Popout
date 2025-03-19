import { useState, useEffect } from 'react';
import './App.css';
import { PdfViewerBox } from './pdf-viewer-box';
import { PdfViewerWindowProvider } from './pdf-viewer-window-context';
function App() {
  const [base64, setBase64] = useState({ id: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(false);

  useEffect(() => {
    async function fetchData() { 
      try {
        const response = await fetch('/image.json')
        const data = await response.json();
        setBase64(data);
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching the JSON:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='App'>
      {!viewImage && (
        <header className='App-header'>
          <p>Image Viewer Min Repro</p>
          <button
            onClick={() => {
              setViewImage((prevState) => !prevState);
            }}>
            Toggle Image
          </button>
        </header>
      )}
      {!loading && viewImage && (
        <PdfViewerWindowProvider base64={base64}>
          <PdfViewerBox base64={base64} setViewImage={setViewImage} />
        </PdfViewerWindowProvider>
      )}
    </div>
  );
}

export default App;
