import React, { useState, useEffect } from 'react';

const PngSaveExample = () => {
  const [warningMessage, setWarningMessage] = useState(null);

  // PNG image generation function
  const generateImage = async () => {
    try {
      setWarningMessage('Generating course planner image...');
      
      // Try to load html2canvas
      let html2canvas;
      
      try {
        const html2canvasModule = await import('html2canvas');
        html2canvas = html2canvasModule.default;
      } catch (importError) {
        setWarningMessage('Image generation not available. Please take a screenshot instead.');
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }
      
      // Get the planner container
      const plannerElement = document.querySelector('.planner-container');
      if (!plannerElement) {
        setWarningMessage('Unable to capture planner view');
        setTimeout(() => setWarningMessage(null), 3000);
        return;
      }

      // Temporarily hide the save button and warning to avoid recursive capture
      const saveButton = document.querySelector('.save-button');
      const warningDiv = document.querySelector('.warning-banner');
      
      if (saveButton) saveButton.style.visibility = 'hidden';
      if (warningDiv) warningDiv.style.display = 'none';

      // Create high-quality canvas from the planner
      const canvas = await html2canvas(plannerElement, {
        scale: 2, // High resolution for crisp text and lines
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Clean white background
        width: plannerElement.scrollWidth,
        height: plannerElement.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Show hidden elements again
      if (saveButton) saveButton.style.visibility = 'visible';
      if (warningDiv) warningDiv.style.display = 'flex';

      // Create download link
      const link = document.createElement('a');
      
      // Generate filename with timestamp
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/[^a-zA-Z0-9]/g, '_');
      
      const filename = `USF_BUAN_Planner_${timestamp}.png`;
      
      // Convert canvas to blob and create download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setWarningMessage(`Course planner saved as: ${filename}`);
        setTimeout(() => setWarningMessage(null), 4000);
      }, 'image/png', 1.0); // Maximum quality PNG

    } catch (error) {
      console.error('Image generation error:', error);
      setWarningMessage('Image generation failed. Please try taking a screenshot instead.');
      setTimeout(() => setWarningMessage(null), 5000);
    }
  };

  // Add styles for clean PNG capture
  const captureStyles = `
    @media print {
      .save-button, .warning-banner { display: none !important; }
      .planner-container { 
        background: white !important; 
        padding: 10px !important; 
      }
    }
    /* PNG capture optimization */
    .planner-container { 
      max-width: none; 
    }
  `;

  // Inject capture styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = captureStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="planner-container" style={{ 
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif", 
      background: "#fafbfc", 
      minHeight: "100vh", 
      padding: 20 
    }}>
      
      {/* Header with Save Button */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        marginBottom: 16 
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            Business Analytics Course Planner
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Click "Save Image" to download a PNG snapshot of your course plan
          </p>
        </div>
        
        {/* PNG Save Button */}
        <button 
          className="save-button"
          onClick={generateImage}
          style={{ 
            padding: "8px 16px", 
            border: "1px solid #FDBB30", 
            borderRadius: 6, 
            background: "#FDBB30",
            color: "#0f172a",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          ⬇ Save Image
        </button>
      </div>

      {/* Warning Display */}
      {warningMessage && (
        <div className="warning-banner" style={{ 
          background: "#f0f9ff", 
          border: "1px solid #0ea5e9", 
          borderRadius: 8, 
          padding: "12px 16px", 
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <div style={{ 
            width: 20, 
            height: 20, 
            borderRadius: "50%", 
            background: "#0ea5e9", 
            color: "#fff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: 12, 
            fontWeight: 600,
            flexShrink: 0
          }}>
            ℹ
          </div>
          <div style={{ fontSize: 13, color: "#0c4a6e", fontWeight: 500 }}>
            {warningMessage}
          </div>
        </div>
      )}

      {/* Example Content to Capture */}
      <div style={{ 
        background: "white", 
        padding: 20, 
        borderRadius: 12, 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: 20
      }}>
        <h3 style={{ margin: "0 0 16px", color: "#374151" }}>Course Planning Content</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 16 
        }}>
          {/* Sample course boxes */}
          {['BUS 204', 'BUS 312', 'BUS 315'].map((course, idx) => (
            <div key={course} style={{ 
              padding: 16, 
              border: "2px solid #3b82f6", 
              borderRadius: 8,
              background: idx === 0 ? "#dcfce7" : "#dbeafe",
              textAlign: "center"
            }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{course}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                {idx === 0 ? "Completed" : "Available"}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: "#f8fafc", 
          borderRadius: 6 
        }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            <strong>Progress:</strong> 1/3 courses completed • Generated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div style={{ 
        background: "#fff7ed", 
        border: "1px solid #fed7aa", 
        borderRadius: 8, 
        padding: 16 
      }}>
        <h4 style={{ margin: "0 0 8px", color: "#9a3412" }}>Installation Required:</h4>
        <p style={{ margin: 0, fontSize: 13, color: "#7c2d12" }}>
          To use PNG export functionality, install html2canvas:<br />
          <code style={{ 
            background: "#fef3c7", 
            padding: "2px 6px", 
            borderRadius: 4, 
            fontFamily: "monospace" 
          }}>
            npm install html2canvas
          </code>
        </p>
      </div>
    </div>
  );
};

export default PngSaveExample;
