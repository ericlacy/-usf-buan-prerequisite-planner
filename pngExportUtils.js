// pngExportUtils.js
// Utility functions for PNG export functionality in React components

/**
 * Generates and downloads a PNG image of a specified DOM element
 * @param {string} elementSelector - CSS selector for the element to capture
 * @param {string} filename - Base filename for the downloaded image
 * @param {Function} setWarningMessage - State setter for warning messages
 * @param {Object} options - html2canvas options override
 */
export const generatePngImage = async (
  elementSelector = '.planner-container', 
  filename = 'course_planner', 
  setWarningMessage,
  options = {}
) => {
  try {
    setWarningMessage?.('Generating image...');
    
    // Try to load html2canvas
    let html2canvas;
    
    try {
      const html2canvasModule = await import('html2canvas');
      html2canvas = html2canvasModule.default;
    } catch (importError) {
      setWarningMessage?.('Image generation not available. Please take a screenshot instead.');
      setTimeout(() => setWarningMessage?.(null), 4000);
      return false;
    }
    
    // Get the target element
    const targetElement = document.querySelector(elementSelector);
    if (!targetElement) {
      setWarningMessage?.(`Unable to find element: ${elementSelector}`);
      setTimeout(() => setWarningMessage?.(null), 3000);
      return false;
    }

    // Hide elements that shouldn't be captured
    const elementsToHide = [
      '.save-button',
      '.pdf-button', 
      '.export-button',
      '.warning-banner'
    ];
    
    const hiddenElements = [];
    elementsToHide.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        hiddenElements.push({
          element,
          originalDisplay: element.style.display,
          originalVisibility: element.style.visibility
        });
        element.style.visibility = 'hidden';
      }
    });

    // Default html2canvas options
    const defaultOptions = {
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: targetElement.scrollWidth,
      height: targetElement.scrollHeight,
      scrollX: 0,
      scrollY: 0
    };

    // Merge with custom options
    const canvasOptions = { ...defaultOptions, ...options };

    // Create canvas from the element
    const canvas = await html2canvas(targetElement, canvasOptions);

    // Restore hidden elements
    hiddenElements.forEach(({ element, originalDisplay, originalVisibility }) => {
      element.style.display = originalDisplay || '';
      element.style.visibility = originalVisibility || 'visible';
    });

    // Generate filename with timestamp
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/[^a-zA-Z0-9]/g, '_');
    
    const finalFilename = `${filename}_${timestamp}.png`;
    
    // Download the image
    const success = await downloadCanvasAsPng(canvas, finalFilename);
    
    if (success) {
      setWarningMessage?.(`Image saved as: ${finalFilename}`);
      setTimeout(() => setWarningMessage?.(null), 4000);
      return true;
    } else {
      setWarningMessage?.('Failed to download image.');
      setTimeout(() => setWarningMessage?.(null), 3000);
      return false;
    }

  } catch (error) {
    console.error('PNG generation error:', error);
    setWarningMessage?.('Image generation failed. Please try taking a screenshot instead.');
    setTimeout(() => setWarningMessage?.(null), 5000);
    return false;
  }
};

/**
 * Downloads a canvas element as a PNG file
 * @param {HTMLCanvasElement} canvas - Canvas element to download
 * @param {string} filename - Filename for the download
 * @returns {Promise<boolean>} Success status
 */
const downloadCanvasAsPng = (canvas, filename) => {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        resolve(true);
      }, 'image/png', 1.0); // Maximum quality PNG
    } catch (error) {
      console.error('Canvas download error:', error);
      resolve(false);
    }
  });
};

/**
 * React hook for PNG export functionality
 * @param {string} elementSelector - CSS selector for element to capture
 * @param {string} baseFilename - Base filename for downloads
 * @returns {Object} Export utilities
 */
export const usePngExport = (elementSelector = '.exportable', baseFilename = 'export') => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportMessage, setExportMessage] = React.useState(null);
  
  const exportPng = React.useCallback(async (customFilename, customOptions) => {
    setIsExporting(true);
    const success = await generatePngImage(
      elementSelector,
      customFilename || baseFilename,
      setExportMessage,
      customOptions
    );
    setIsExporting(false);
    return success;
  }, [elementSelector, baseFilename]);
  
  const clearMessage = React.useCallback(() => {
    setExportMessage(null);
  }, []);
  
  return {
    exportPng,
    isExporting,
    exportMessage,
    clearMessage
  };
};

/**
 * CSS styles for clean PNG capture (inject into document head)
 */
export const pngCaptureStyles = `
  @media print {
    .save-button, 
    .export-button, 
    .pdf-button, 
    .warning-banner { 
      display: none !important; 
    }
    .exportable { 
      background: white !important; 
      padding: 10px !important; 
    }
  }
  
  /* Ensure full width capture */
  .exportable { 
    max-width: none; 
  }
`;

/**
 * Example usage in a React component:
 * 
 * import { usePngExport, pngCaptureStyles } from './pngExportUtils';
 * 
 * const MyComponent = () => {
 *   const { exportPng, isExporting, exportMessage } = usePngExport('.my-container', 'my_export');
 * 
 *   // Inject styles
 *   useEffect(() => {
 *     const style = document.createElement('style');
 *     style.textContent = pngCaptureStyles;
 *     document.head.appendChild(style);
 *     return () => document.head.removeChild(style);
 *   }, []);
 * 
 *   return (
 *     <div className="my-container">
 *       <button onClick={() => exportPng('custom_name')} disabled={isExporting}>
 *         {isExporting ? 'Generating...' : 'Save PNG'}
 *       </button>
 *       {exportMessage && <div>{exportMessage}</div>}
 *       // Your content here
 *     </div>
 *   );
 * };
 */
