// BUAN_PNG_Integration.jsx
// Exact code integration for Business Analytics Course Planner PNG export

import React, { useState, useEffect } from 'react';

/* 
=== STEP 1: Install Dependencies ===
npm install html2canvas

=== STEP 2: Add PNG Export Function ===
Add this function to your PrereqPlanner component:
*/

const PngExportIntegration = () => {
  const [warningMessage, setWarningMessage] = useState(null);
  const [view, setView] = useState("major"); // major or minor

  // PNG image generation function - ADD THIS TO YOUR COMPONENT
  const generateImage = async () => {
    try {
      setWarningMessage('Generating course planner image...');
      
      // Import html2canvas dynamically
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

      // Hide save button and warnings during capture
      const saveButton = document.querySelector('.save-button');
      const warningDiv = document.querySelector('.warning-banner');
      
      if (saveButton) saveButton.style.visibility = 'hidden';
      if (warningDiv) warningDiv.style.display = 'none';

      // Create high-quality canvas
      const canvas = await html2canvas(plannerElement, {
        scale: 2, // 2x resolution for crisp text
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

      // Create download
      const link = document.createElement('a');
      
      // Generate descriptive filename
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/[^a-zA-Z0-9]/g, '_');
      
      const filename = `USF_BUAN_${view}_Planner_${timestamp}.png`;
      
      // Convert to blob and download
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
      }, 'image/png', 1.0); // Maximum quality

    } catch (error) {
      console.error('Image generation error:', error);
      setWarningMessage('Image generation failed. Please try taking a screenshot instead.');
      setTimeout(() => setWarningMessage(null), 5000);
    }
  };

  // CSS for clean capture - ADD THIS TO YOUR COMPONENT
  const captureStyles = `
    @media print {
      .save-button, .warning-banner { display: none !important; }
      .planner-container { 
        background: white !important; 
        padding: 10px !important; 
      }
    }
    .planner-container { 
      max-width: none; 
    }
  `;

  // Inject styles - ADD THIS TO YOUR COMPONENT
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
      
      {/* === STEP 3: Add Save Button === */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 20 
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
          Business Analytics Course Planner
        </h1>
        
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

      {/* === STEP 4: Add Warning Display === */}
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
          <div style={{ fontSize: 13, color: "#0c4a6e", fontWeight: 500 }}>
            {warningMessage}
          </div>
        </div>
      )}

      {/* Your existing planner content goes here */}
      <div style={{ 
        background: "white", 
        padding: 20, 
        borderRadius: 12, 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
      }}>
        <p>Your existing course planner SVG and controls go here...</p>
        <p>The PNG export will capture everything inside .planner-container</p>
      </div>
    </div>
  );
};

/* 
=== INTEGRATION CHECKLIST ===

1. ✅ Install html2canvas: `npm install html2canvas`

2. ✅ Add the generateImage function to your component

3. ✅ Add the captureStyles CSS and useEffect

4. ✅ Add className="planner-container" to your main div

5. ✅ Add className="save-button" to your save button

6. ✅ Add className="warning-banner" to warning messages

7. ✅ Update button onClick={generateImage}

8. ✅ Test PNG export functionality


=== FILE STRUCTURE ===

YourProject/
├── src/
│   ├── components/
│   │   └── PrereqPlanner.jsx      ← Add PNG export here
│   ├── package.json               ← Add html2canvas dependency
│   └── ...


=== TROUBLESHOOTING ===

Problem: "html2canvas is not defined"
Solution: Make sure you installed it: npm install html2canvas

Problem: "Cannot capture element"  
Solution: Check that className="planner-container" exists

Problem: "Poor image quality"
Solution: Increase scale: scale: 3 (warning: larger file size)

Problem: "Button appears in image"
Solution: Check that className="save-button" matches the CSS selector


=== CUSTOMIZATION ===

// Change filename format
const filename = `My_Custom_Name_${timestamp}.png`;

// Change image quality/size
const canvas = await html2canvas(element, {
  scale: 3, // Higher = better quality, larger file
  backgroundColor: '#f0f0f0' // Change background color
});

// Capture different element  
const element = document.querySelector('.different-class');

*/

export default PngExportIntegration;
