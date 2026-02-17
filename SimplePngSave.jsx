// SimplePngSave.jsx
// Minimal example of adding PNG export to any React component

import React, { useState } from 'react';

const SimplePngSave = () => {
  const [message, setMessage] = useState(null);

  // Core PNG save function - can be added to any component
  const savePng = async () => {
    try {
      setMessage('Generating image...');

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Get element to capture (could be any CSS selector)
      const element = document.querySelector('.capture-area');
      if (!element) {
        setMessage('Nothing to capture');
        return;
      }

      // Hide save button during capture
      const saveBtn = document.querySelector('.save-btn');
      if (saveBtn) saveBtn.style.visibility = 'hidden';

      // Create high-quality PNG
      const canvas = await html2canvas(element, {
        scale: 2,                    // 2x resolution  
        backgroundColor: '#ffffff',  // Clean white background
        useCORS: true               // Handle external images
      });

      // Show button again
      if (saveBtn) saveBtn.style.visibility = 'visible';

      // Create download
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `course-planner-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        setMessage('Image saved!');
        setTimeout(() => setMessage(null), 3000);
      });

    } catch (error) {
      setMessage('Save failed - try screenshot instead');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header with save button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Course Planner</h2>
        <button 
          className="save-btn"
          onClick={savePng}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FDBB30', 
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          💾 Save PNG
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div style={{ 
          padding: 10, 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3',
          borderRadius: 4,
          marginBottom: 20,
          fontSize: 14
        }}>
          {message}
        </div>
      )}

      {/* Content area to capture */}
      <div className="capture-area" style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: 400
      }}>
        <h3>Business Analytics Major Requirements</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
          {/* Sample course cards */}
          {[
            { code: 'BUS 204', name: 'Foundations of Analytics', completed: true },
            { code: 'BUS 312', name: 'Data Wrangling', completed: false },
            { code: 'BUS 315', name: 'Statistical Modeling', completed: false }
          ].map((course) => (
            <div key={course.code} style={{
              padding: 16,
              border: course.completed ? '2px solid #4caf50' : '2px solid #e0e0e0',
              borderRadius: 8,
              backgroundColor: course.completed ? '#e8f5e8' : '#f9f9f9',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{course.code}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{course.name}</div>
              <div style={{ 
                fontSize: 11, 
                marginTop: 8,
                color: course.completed ? '#4caf50' : '#999',
                fontWeight: 'bold'
              }}>
                {course.completed ? '✓ Completed' : 'Available'}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: '#f5f5f5',
          borderRadius: 6
        }}>
          <strong>Progress: 1/3 courses completed</strong>
          <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
            Generated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Installation note */}
      <div style={{ 
        marginTop: 20, 
        padding: 16, 
        backgroundColor: '#fff3e0',
        border: '1px solid #ff9800',
        borderRadius: 6,
        fontSize: 13
      }}>
        <strong>Installation:</strong> Add html2canvas to your project:
        <pre style={{ marginTop: 8, padding: 8, backgroundColor: '#333', color: '#fff', borderRadius: 4 }}>
          npm install html2canvas
        </pre>
      </div>
    </div>
  );
};

export default SimplePngSave;

/* 
INTEGRATION GUIDE:

1. Install html2canvas:
   npm install html2canvas

2. Add this function to any React component:
   
   const savePng = async () => {
     try {
       const html2canvas = (await import('html2canvas')).default;
       const element = document.querySelector('.your-content-area');
       const canvas = await html2canvas(element, { scale: 2 });
       
       canvas.toBlob((blob) => {
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = 'my-image.png';
         link.click();
       });
     } catch (error) {
       console.error('Save failed:', error);
     }
   };

3. Add save button:
   <button onClick={savePng}>Save PNG</button>

4. Add class to content area:
   <div className="your-content-area">Content to capture</div>

That's it! The function will capture whatever element you specify and download it as a high-quality PNG.
*/
