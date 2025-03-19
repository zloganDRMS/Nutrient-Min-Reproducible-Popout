import { useContext } from 'react';
import { PdfViewerWindowContext } from './pdf-viewer-window-context';

export const usePdfViewerWindow = () =>
  useContext(PdfViewerWindowContext);
