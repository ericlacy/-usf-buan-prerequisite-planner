import { useState, useCallback, useMemo, useEffect } from "react";

// Course data and configuration — BUAN courses only
// Business Core courses (RHET 110, BUS 100/201/202/301/302/304/305/403, ECON 110) are
// tracked separately via your Degree Evaluation in Banner/myUSF.
const courses = [
  // Row 0 — Foundation
  {
    id: "BUS204",
    name: "BUS 204",
    label: "Foundations of Analytics",
    units: 4,
    cat: "minor-req",
    year: 0,
    col: 0,
    programs: ["major", "minor"],
    description: "Prerequisite: RHET 110 (university core requirement). Utilizes spreadsheets for data analysis and modeling to inform business decisions. Covers regression models, forecasting, decision analysis, and optimizing resource allocation for strategic decision-making."
  },
  // Row 1 — Sophomore Spring
  {
    id: "BUS205",
    name: "BUS 205",
    label: "Applied Business Tech",
    units: 2,
    cat: "minor-req",
    year: 1,
    col: 0,
    programs: ["major", "minor"],
    description: "Applied business technology course focusing on practical software and technology skills for business applications."
  },
  {
    id: "BUS370",
    name: "BUS 370",
    label: "Internet Business Apps",
    units: 4,
    cat: "minor-only",
    year: 1,
    col: 1,
    programs: ["minor"],
    note: "Minor elective only",
    description: "Prerequisite: RHET 110 (university core requirement). Development and implementation of internet-based business applications including e-commerce, digital marketing, and web-based business models."
  },
  // Row 2 — Junior Fall
  {
    id: "BUS312",
    name: "BUS 312",
    label: "Data Wrangling",
    units: 4,
    cat: "minor-req",
    year: 2,
    col: 0,
    programs: ["major", "minor"],
    sem: "Fall",
    minStanding: 2,
    description: "Apply analytical tools to collect and explore digital data from various digital platforms (databases, mobile apps, social media, etc.). Introduces digital analytics techniques to provide managerial insights and improve business decision-making."
  },
  {
    id: "BUS315",
    name: "BUS 315",
    label: "Data Mining for Business",
    units: 4,
    cat: "required",
    year: 2,
    col: 1,
    programs: ["major", "minor"],
    sem: "Fall",
    description: "Data mining is about investigating relationships in data. Introduces skills, techniques, and focus needed by today's managers to prepare and analyze data to identify patterns, anomalies, sentiments, insights, risks, and opportunities in a competitive business environment."
  },
  {
    id: "BUS340",
    name: "BUS 340",
    label: "Data Visualization",
    units: 2,
    cat: "elective",
    year: 2,
    col: 2,
    programs: ["major", "minor"],
    sem: "Fall",
    description: "Introduction to data visualization principles and techniques for improving comprehension, communication, and decision making. Learn how combining data sources with advanced analytics can power new business opportunities."
  },
  {
    id: "BUS41902",
    name: "BUS 419-02",
    label: "Societal Impact of Tech",
    units: 2,
    cat: "elective",
    year: 2,
    col: 3,
    programs: ["major", "minor"],
    sem: "Fall & Spring",
    enrollLimit: true,
    description: "Provides comprehensive understanding of technology-society relationships. Students critically assess ethical, economic, and cultural implications of technology adoption and develop strategic approaches to address societal challenges in the digital age."
  },
  // Row 3 — Junior Spring
  {
    id: "BUS316",
    name: "BUS 316",
    label: "ML for Business",
    units: 2,
    cat: "elective",
    year: 3,
    col: 0,
    programs: ["major", "minor"],
    sem: "Spring",
    description: "Comprehensive overview of machine learning techniques and their applications across business functions. Hands-on experience with supervised and unsupervised learning, forecasting, segmentation, and predictive analytics, and their impact on business strategy."
  },
  // Row 4 — Senior
  {
    id: "BUS317",
    name: "BUS 317",
    label: "AI for Business",
    units: 2,
    cat: "elective",
    year: 4,
    col: 0,
    programs: ["major", "minor"],
    sem: "Spring",
    description: "Equips students with advanced AI techniques reshaping industries today. Covers key AI concepts including machine learning, deep learning, and natural language processing, with practical applications in business through case studies and hands-on projects."
  },
  {
    id: "BUS410",
    name: "BUS 410",
    label: "Analytics for Good",
    units: 4,
    cat: "elective",
    year: 4,
    col: 1,
    programs: ["major", "minor"],
    sem: "Fall & Spring",
    description: "Hands-on exploration of advanced business analytics tools applied to real-world community projects. Uses data cleaning, visualization, exploratory analysis, machine learning, and AI to tackle community-based challenges, with ethical considerations throughout."
  },
  {
    id: "BUS411",
    name: "BUS 411",
    label: "BA Immersion",
    units: 2,
    cat: "elective",
    year: 4,
    col: 2,
    programs: ["major", "minor"],
    sem: "Spring",
    description: "Case studies, guest lectures, site visits, and projects with real-world data provide experiences in creating real business value. Analytical frameworks enable decision-making across industry domains. Students develop solutions for ambiguous and complex business problems."
  },
  {
    id: "BUS415",
    name: "BUS 415",
    label: "Supply Chain Mgmt",
    units: 2,
    cat: "elective",
    year: 4,
    col: 3,
    programs: ["major", "minor"],
    sem: "Fall & Spring",
    enrollLimit: true,
    description: "Explores supply chain management from sourcing raw materials to end customers. Real-world examples and latest challenges in the field, equipping students to understand current business landscapes and anticipate future trends."
  },
  {
    id: "BUS41901",
    name: "BUS 419-01",
    label: "Business Impact Studio",
    units: 2,
    cat: "elective",
    year: 4,
    col: 4,
    programs: ["major", "minor"],
    sem: "Fall & Spring",
    enrollLimit: true,
    description: "Work directly with real organizations on high-stakes business challenges. Meet with client executives, diagnose problems, and deliver usable solutions. Provides portfolio-ready work, references, and consulting experience."
  },
];

const edges = [
  // BUS 204 → BUS 205, BUS 340, BUS 419-02
  { from: "BUS204", to: "BUS205", type: "concurrent" },
  { from: "BUS204", to: "BUS340", type: "required" },
  { from: "BUS204", to: "BUS41902", type: "required" },
  { from: "BUS204", to: "BUS415", type: "required" },
  // BUS 205 → BUS 312
  { from: "BUS205", to: "BUS312", type: "required" },
  // BUS 312 → BUS 315, BUS 316
  { from: "BUS312", to: "BUS315", type: "concurrent" },
  { from: "BUS312", to: "BUS316", type: "concurrent" },
  // BUS 316 → BUS 317
  { from: "BUS316", to: "BUS317", type: "concurrent" },
  // BUS 410 prereqs: BUS 204, 340, 312, 315, 316
  { from: "BUS204", to: "BUS410", type: "required" },
  { from: "BUS340", to: "BUS410", type: "required" },
  { from: "BUS312", to: "BUS410", type: "required" },
  { from: "BUS315", to: "BUS410", type: "required" },
  { from: "BUS316", to: "BUS410", type: "required" },
  // BUS 411 prereqs: BUS 204, 340, 312, 315, 316
  { from: "BUS204", to: "BUS411", type: "required" },
  { from: "BUS340", to: "BUS411", type: "required" },
  { from: "BUS312", to: "BUS411", type: "required" },
  { from: "BUS315", to: "BUS411", type: "required" },
  { from: "BUS316", to: "BUS411", type: "required" },
  // BUS 419-01 prereqs: BUS 204, 340, 312, 315, 316
  { from: "BUS204", to: "BUS41901", type: "required" },
  { from: "BUS340", to: "BUS41901", type: "required" },
  { from: "BUS312", to: "BUS41901", type: "required" },
  { from: "BUS315", to: "BUS41901", type: "required" },
  { from: "BUS316", to: "BUS41901", type: "required" },
];

const majorRequired = ["BUS312", "BUS315"];
const minorRequired = ["BUS204", "BUS205", "BUS312"];

// Semester colors - Fixed to be different
const semesterColors = {
  "Fall": "#c2410c",        // Orange
  "Spring": "#15803d",      // Green  
  "Fall & Spring": "#4338ca" // Blue
};

const catColors = {
  foundation: { bg: "#f1f5f9", border: "#94a3b8", text: "#334155", tag: "#64748b", tagText: "#fff" },
  core: { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a5f", tag: "#3b82f6", tagText: "#fff" },
  "minor-req": { bg: "#fef3c7", border: "#f59e0b", text: "#78350f", tag: "#f59e0b", tagText: "#fff" },
  "minor-only": { bg: "#fce7f3", border: "#ec4899", text: "#831843", tag: "#ec4899", tagText: "#fff" },
  required: { bg: "#fef3c7", border: "#f59e0b", text: "#78350f", tag: "#f59e0b", tagText: "#fff" },
  elective: { bg: "#d1fae5", border: "#10b981", text: "#064e3b", tag: "#10b981", tagText: "#fff" },
  completed: { bg: "#dcfce7", border: "#16a34a", text: "#166534", tag: "#16a34a", tagText: "#fff" },
  available: { bg: "#fef3c7", border: "#eab308", text: "#a16207", tag: "#eab308", tagText: "#fff" },
  blocked: { bg: "#f1f5f9", border: "#94a3b8", text: "#64748b", tag: "#94a3b8", tagText: "#fff" }
};

// Planning Logic Functions
function checkPrerequisites(courseId, completedCourses, edges, view = "major") {
  const prereqs = edges.filter(e => e.to === courseId);
  return prereqs.every(prereq => completedCourses.has(prereq.from));
}

function findAvailableCourses(completedCourses, currentSemester, classStanding, program, courses, edges) {
  const standingMap = { 'Freshman': 0, 'Sophomore': 1, 'Junior': 2, 'Senior': 3 };
  const currentLevel = standingMap[classStanding] || 0;
  const isElectiveEligible = currentLevel >= 2; // BUAN electives not until Junior year (per catalog)

  return courses.filter(course => {
    // Must be part of selected program
    if (!course.programs.includes(program)) return false;

    // Must not be already completed
    if (completedCourses.has(course.id)) return false;

    // Check elective restriction (Junior+ only)
    if (course.cat === "elective" && !isElectiveEligible) return false;

    // Check explicit minimum class standing restriction
    if (course.minStanding !== undefined && currentLevel < course.minStanding) return false;

    // Check semester availability
    if (course.sem && !course.sem.includes(currentSemester)) return false;

    // Check prerequisites - pass the program/view
    return checkPrerequisites(course.id, completedCourses, edges, program);
  });
}

function getCourseStatus(course, completedCourses, availableCourses) {
  if (completedCourses.has(course.id)) return "completed";
  if (availableCourses.some(c => c.id === course.id)) return "available";
  return "blocked";
}

function getCourseCategory(course, view, minorRequired, majorRequired, completedCourses, availableCourses) {
  const status = getCourseStatus(course, completedCourses, availableCourses);
  if (status === "completed") return "completed";
  if (status === "available") return "available";
  
  // Default category logic
  if (view === "minor") {
    if (minorRequired.includes(course.id)) return "minor-req";
    if (course.id === "BUS370") return "minor-only";
    if (course.cat === "foundation") return "foundation";
    return course.cat;
  }
  if (view === "major") {
    if (majorRequired.includes(course.id)) return "required";
    if (course.cat === "minor-req" || course.id === "BUS308") return "core";
    return course.cat;
  }
  return course.cat;
}

// Unit tracking calculation function
function calculateUnits(completedCourses, courses, view) {
  const completedCourseObjects = Array.from(completedCourses)
    .map(id => courses.find(c => c.id === id))
    .filter(Boolean);
  
  if (view === "major") {
    // Major: BUS 312 + BUS 315 = 8 units required analytics
    const majorAnalyticsCourses = ["BUS312", "BUS315"];
    const analyticsCoreUnits = completedCourseObjects
      .filter(course => majorAnalyticsCourses.includes(course.id))
      .reduce((total, course) => total + course.units, 0);
    
    const totalUnits = completedCourseObjects
      .reduce((total, course) => total + course.units, 0);
    
    return {
      analyticsCore: analyticsCoreUnits,
      total: totalUnits
    };
  } else {
    // Minor calculations: 10 units BUAN + 10 units electives = 20 total
    
    // Minor BUAN Core: BUS 204 + BUS 205 + BUS 312 = 10 units
    const minorBuanCourses = ["BUS204", "BUS205", "BUS312"];
    const buanCoreUnits = completedCourseObjects
      .filter(course => minorBuanCourses.includes(course.id))
      .reduce((total, course) => total + course.units, 0);
    
    // Minor Electives: All other completed minor courses (exclude RHET and BUAN core)
    const electiveUnits = completedCourseObjects
      .filter(course => 
        course.id !== "RHET" && // Exclude university core
        !minorBuanCourses.includes(course.id) && // Exclude BUAN core
        course.programs && course.programs.includes("minor") // Must be in minor program
      )
      .reduce((total, course) => total + course.units, 0);
    
    const totalUnits = buanCoreUnits + electiveUnits;
    
    return {
      businessCore: 0, // No business core for minor
      analyticsCore: buanCoreUnits, // BUAN core for minor
      electives: electiveUnits, // Track electives separately for minor
      total: totalUnits
    };
  }
}

const yearLabels = [["Sophomore", "Fall"], ["Sophomore", "Spring"], ["Junior", "Fall"], ["Junior", "Spring"], ["Senior", ""]];
const NODE_W = 148, NODE_H = 72, COL_GAP = 166, ROW_GAP = 108, PAD_LEFT = 160, PAD_TOP = 60;

function getPos(c) { return { x: PAD_LEFT + c.col * COL_GAP, y: PAD_TOP + c.year * ROW_GAP }; }

function buildPath(f, t) {
  const fp = getPos(f), tp = getPos(t);
  const sx = fp.x + NODE_W / 2, sy = fp.y + NODE_H, ex = tp.x + NODE_W / 2, ey = tp.y;
  return "M" + sx + "," + sy + " C" + sx + "," + ((sy + ey) / 2) + " " + ex + "," + ((sy + ey) / 2) + " " + ex + "," + ey;
}

export default function PrereqPlanner() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("major");
  
  // Planning state
  const [completedCourses, setCompletedCourses] = useState(new Set());
  const [currentSemester, setCurrentSemester] = useState("Fall");
  const [classStanding, setClassStanding] = useState("Junior");
  const [showPlanner, setShowPlanner] = useState(true);
  
  // Warning system state
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
      
      const filename = `USF_BUAN_${view}_Planner_${timestamp}.png`;
      
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

  const courseMap = useMemo(() => {
    return courses.reduce((map, course) => {
      map[course.id] = course;
      return map;
    }, {});
  }, []);

  const visibleCourses = useMemo(() => {
    return courses.filter(c => c.programs.includes(view));
  }, [view]);

  const availableCourses = useMemo(() => {
    return findAvailableCourses(completedCourses, currentSemester, classStanding, view, courses, edges);
  }, [completedCourses, currentSemester, classStanding, view]);

  const unitProgress = useMemo(() => {
    return calculateUnits(completedCourses, courses, view);
  }, [completedCourses, view]);

  const toggleCourseComplete = (courseId) => {
    const newCompleted = new Set(completedCourses);
    const course = courseMap[courseId];
    
    if (newCompleted.has(courseId)) {
      // Removing a course - always allow
      newCompleted.delete(courseId);
      setWarningMessage(null); // Clear any existing warnings
    } else {
      // Adding a course - check prerequisites AND semester availability
      
      // Check semester availability first
      if (course?.sem && !course.sem.includes(currentSemester)) {
        const courseName = course?.name || courseId;
        setWarningMessage(`Cannot complete ${courseName}: Not offered in ${currentSemester} semester. Available: ${course.sem}`);
        
        // Auto-clear warning after 4 seconds
        setTimeout(() => setWarningMessage(null), 4000);
        return; // Block the action
      }
      
      // Check prerequisites - pass the current view
      const prereqsMet = checkPrerequisites(courseId, completedCourses, edges, view);
      
      if (!prereqsMet) {
        // Find missing prerequisites (filter by view for RHET special case)
        const prereqs = edges.filter(e => e.to === courseId);
        const missingPrereqs = prereqs
          .filter(prereq => !completedCourses.has(prereq.from))
          .map(prereq => courseMap[prereq.from]?.name || prereq.from);
        
        const courseName = courseMap[courseId]?.name || courseId;
        setWarningMessage(`Cannot complete ${courseName}: Missing prerequisites: ${missingPrereqs.join(", ")}`);
        
        // Auto-clear warning after 4 seconds
        setTimeout(() => setWarningMessage(null), 4000);
        return; // Block the action
      }
      
      // Both semester availability and prerequisites met - allow completion
      newCompleted.add(courseId);
      setWarningMessage(null); // Clear any existing warnings
    }
    
    setCompletedCourses(newCompleted);
  };

  let maxCol = 0, maxRow = 0;
  visibleCourses.forEach(c => { if (c.col > maxCol) maxCol = c.col; if (c.year > maxRow) maxRow = c.year; });
  const svgW = PAD_LEFT + (maxCol + 1) * COL_GAP + NODE_W / 2 + 20;
  const svgH = PAD_TOP + (maxRow + 1) * ROW_GAP + NODE_H + 20;

  return (
    <div className="planner-container" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif", background: "#fafbfc", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* USF Branded Header */}
        <div style={{ background: "#00543C", borderBottom: "3px solid #FDBB30", borderRadius: "12px 12px 0 0", padding: "24px 28px 20px", marginBottom: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#FDBB30", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
            Business Analytics Course Prerequisite Planner
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 400 }}>
            University of San Francisco · McLaren School of Management
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderTop: "none", padding: "10px 16px", marginBottom: 12 }}>
          <button 
            className="save-button"
            onClick={generateImage}
            style={{ 
              padding: "7px 14px", 
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
          <button 
            onClick={() => setShowPlanner(!showPlanner)}
            style={{ 
              padding: "7px 14px", 
              border: "1px solid #d1d5db", 
              borderRadius: 6, 
              background: showPlanner ? "#00543C" : "#fff",
              color: showPlanner ? "#fff" : "#374151",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500
            }}
          >
            {showPlanner ? "Hide Planner" : "Show Planner"}
          </button>
          <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
            {[{ k: "major", l: "Major (52u)" }, { k: "minor", l: "Minor (20u)" }].map(v => (
              <button 
                key={v.k} 
                onClick={() => { setView(v.k); setSelected(null); setHovered(null); }}
                style={{ 
                  padding: "6px 14px", 
                  border: "none", 
                  borderRadius: 6, 
                  cursor: "pointer", 
                  fontSize: 12, 
                  fontWeight: 600, 
                  transition: "all 0.15s", 
                  background: view === v.k ? "#fff" : "transparent", 
                  color: view === v.k ? "#0f172a" : "#64748b", 
                  boxShadow: view === v.k ? "0 1px 3px rgba(0,0,0,0.1)" : "none" 
                }}
              >
                {v.l}
              </button>
            ))}
          </div>
        </div>

        {/* Warning Display */}
        {warningMessage && (
          <div className="warning-banner" style={{ 
            background: "#fef2f2", 
            border: "1px solid #fecaca", 
            borderRadius: 8, 
            padding: "12px 16px", 
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
          }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              borderRadius: "50%", 
              background: "#dc2626", 
              color: "#fff", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: 12, 
              fontWeight: 600,
              flexShrink: 0
            }}>
              !
            </div>
            <div style={{ fontSize: 13, color: "#991b1b", fontWeight: 500 }}>
              {warningMessage}
            </div>
          </div>
        )}

        {/* Planning Controls */}
        {showPlanner && (
          <div className="planning-controls" style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: "16px", 
            marginBottom: 16, 
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>
                  Planning Controls
                </h3>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
                      Current Semester
                    </label>
                    <select 
                      value={currentSemester} 
                      onChange={(e) => setCurrentSemester(e.target.value)}
                      style={{ 
                        padding: "6px 12px", 
                        borderRadius: 6, 
                        border: "1px solid #d1d5db", 
                        fontSize: 12, 
                        background: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
                      Class Standing
                    </label>
                    <select 
                      value={classStanding} 
                      onChange={(e) => setClassStanding(e.target.value)}
                      style={{ 
                        padding: "6px 12px", 
                        borderRadius: 6, 
                        border: "1px solid #d1d5db", 
                        fontSize: 12, 
                        background: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  <strong>{completedCourses.size}</strong> courses completed • <strong>{availableCourses.length}</strong> available this semester
                </div>
              </div>
            </div>
            
            {/* Unit Progress Tracking */}
            <div className="unit-progress" style={{ 
              display: "grid", 
              gridTemplateColumns: view === "minor" ? "1fr 1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: 16, 
              padding: "16px", 
              background: "#f9fafb", 
              borderRadius: 8, 
              marginBottom: 8,
              marginTop: 16
            }}>
              {/* Business Core - Catalog year redirect */}
              {view === "major" && (
                <div style={{
                  borderLeft: "3px solid #FDBB30",
                  paddingLeft: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 3 }}>
                    Business Core
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
                    Requirements vary by catalog year. Check your{" "}
                    <a
                      href="https://dw-prod.ec.usfca.edu/responsiveDashboard/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#00543C", fontWeight: 600, textDecoration: "underline" }}
                    >
                      Degree Evaluation
                    </a>{" "}
                    to confirm what is required for your program.
                  </div>
                </div>
              )}
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                    {view === "major" ? "Analytics Core" : "BUAN Core"}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {unitProgress.analyticsCore}/{view === "major" ? "8" : "10"} units
                  </div>
                </div>
                <div style={{ width: "100%", background: "#e5e7eb", borderRadius: 4, height: 6 }}>
                  <div style={{ 
                    width: `${Math.min(100, (unitProgress.analyticsCore / (view === "major" ? 8 : 10)) * 100)}%`, 
                    background: "#f59e0b", 
                    height: "100%", 
                    borderRadius: 4,
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                  {Math.round((unitProgress.analyticsCore / (view === "major" ? 8 : 10)) * 100)}% complete
                </div>
              </div>

              {/* Electives - Only show for Minor */}
              {view === "minor" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                      Electives
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {unitProgress.electives || 0}/10 units
                    </div>
                  </div>
                  <div style={{ width: "100%", background: "#e5e7eb", borderRadius: 4, height: 6 }}>
                    <div style={{ 
                      width: `${Math.min(100, ((unitProgress.electives || 0) / 10) * 100)}%`, 
                      background: "#10b981", 
                      height: "100%", 
                      borderRadius: 4,
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                    {Math.round(((unitProgress.electives || 0) / 10) * 100)}% complete
                  </div>
                </div>
              )}
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                    {view === "major" ? "Total Progress" : "Minor Progress"}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {unitProgress.total}/{view === "major" ? "52" : "20"} units
                  </div>
                </div>
                <div style={{ width: "100%", background: "#e5e7eb", borderRadius: 4, height: 6 }}>
                  <div style={{ 
                    width: `${Math.min(100, (unitProgress.total / (view === "major" ? 52 : 20)) * 100)}%`, 
                    background: "#10b981", 
                    height: "100%", 
                    borderRadius: 4,
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                  {Math.round((unitProgress.total / (view === "major" ? 52 : 20)) * 100)}% complete
                </div>
              </div>
            </div>

            {availableCourses.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  Recommended Courses ({currentSemester} {classStanding})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {availableCourses.slice(0, 6).map(course => (
                    <div 
                      key={course.id}
                      style={{ 
                        padding: "6px 12px", 
                        background: "#fef3c7", 
                        border: "1px solid #eab308", 
                        borderRadius: 6, 
                        fontSize: 11, 
                        fontWeight: 500,
                        color: "#a16207",
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                      onClick={(e) => { e.stopPropagation(); setSelected(course.id); }}
                      onMouseEnter={() => setHovered(course.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {course.name}
                      {course.enrollLimit && <span style={{ color: "#dc2626", marginLeft: 4 }}>⚠</span>}
                    </div>
                  ))}
                  {availableCourses.length > 6 && (
                    <div style={{ padding: "6px 12px", fontSize: 11, color: "#64748b", alignSelf: "center" }}>
                      +{availableCourses.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Course Details Panel */}
            {(hovered || selected) && courseMap[hovered || selected] && (() => {
              const courseId = hovered || selected;
              const course = courseMap[courseId];
              return (
                <div style={{ marginTop: 16, background: "#f8fafc", borderRadius: 8, padding: "16px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                        {course.name} — {course.label}
                      </h3>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#3b82f6", color: "#fff" }}>
                          {course.units} units
                        </span>
                        {course.sem && (
                          <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: semesterColors[course.sem], color: "#fff" }}>
                            {course.sem}
                          </span>
                        )}
                        {course.enrollLimit && (
                          <span style={{ fontSize: 12, color: "#dc2626" }}>⚠ Enrollment Limited</span>
                        )}
                      </div>
                    </div>
                    {selected === courseId && (
                      <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "#6b7280", padding: 4 }}>
                        ✕
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "10px 0 12px" }}>
                    {course.description}
                  </p>
                  {edges.filter(e => e.to === courseId).length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>Prerequisites:</h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {edges.filter(e => e.to === courseId).map(prereq => {
                          const prereqCourse = courseMap[prereq.from];
                          if (!prereqCourse) return null;
                          const isCompleted = completedCourses.has(prereq.from);
                          return (
                            <span key={prereq.from} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: isCompleted ? "#dcfce7" : "#fee2e2", color: isCompleted ? "#166534" : "#991b1b" }}>
                              {prereqCourse.name} {prereq.type === "concurrent" ? "(concurrent)" : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {edges.filter(e => e.from === courseId).length > 0 && (
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>Enables:</h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {edges.filter(e => e.from === courseId).map(enables => {
                          const enabledCourse = courseMap[enables.to];
                          if (!enabledCourse || !enabledCourse.programs.includes(view)) return null;
                          return (
                            <span key={enables.to} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: "#e0f2fe", color: "#0c4a6e" }}>
                              {enabledCourse.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Course Map */}
        <div className="course-map" style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <svg width={svgW} height={svgH} style={{ display: "block" }}>
            <defs>
              <marker id="ar" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                <polygon points="0 0,7 2.5,0 5" fill="#3b82f6" />
              </marker>
              <filter id="sh" x="-4%" y="-4%" width="108%" height="116%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Unselect background - click to clear selection */}
            <rect 
              width={svgW} 
              height={svgH} 
              fill="transparent" 
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelected(null);
                setWarningMessage(null);
              }}
            />

            {/* Year labels */}
            {yearLabels.map((label, i) => (
              <g key={i}>
                <text x={74} y={PAD_TOP + i * ROW_GAP + NODE_H/2 + (label[1] ? -3 : 5)}
                  fontSize="11" fontWeight="600" fill="#64748b" textAnchor="middle">
                  {label[0]}
                </text>
                {label[1] && (
                  <text x={74} y={PAD_TOP + i * ROW_GAP + NODE_H/2 + 11}
                    fontSize="11" fontWeight="600" fill="#64748b" textAnchor="middle">
                    {label[1]}
                  </text>
                )}
              </g>
            ))}

            {/* Prerequisite arrows */}
            {edges.map(edge => {
              const fromCourse = courseMap[edge.from];
              const toCourse = courseMap[edge.to];
              if (!fromCourse || !toCourse) return null;
              if (!fromCourse.programs.includes(view) || !toCourse.programs.includes(view)) return null;
              
              const isActive = (selected === edge.from || selected === edge.to) || 
                              (hovered === edge.from || hovered === edge.to);
              const opacity = selected ? (isActive ? 1 : 0.15) : (hovered ? (isActive ? 1 : 0.3) : 0.6);
              
              return (
                <path key={edge.from + "-" + edge.to} 
                  d={buildPath(fromCourse, toCourse)} 
                  stroke="#3b82f6" strokeWidth="2" fill="none" 
                  markerEnd="url(#ar)" opacity={opacity}
                  style={{ transition: "opacity 0.2s" }} />
              );
            })}

            {/* Course nodes */}
            {visibleCourses.map(course => {
              const pos = getPos(course);
              const status = getCourseStatus(course, completedCourses, availableCourses);
              const category = getCourseCategory(course, view, minorRequired, majorRequired, completedCourses, availableCourses);
              const col = catColors[status] || catColors[category] || catColors.blocked;
              
              const isA = selected === course.id || hovered === course.id;
              const dim = selected && selected !== course.id && !edges.some(e => (e.from === selected && e.to === course.id) || (e.from === course.id && e.to === selected));

              return (
                <g key={course.id} style={{ cursor: "pointer", transition: "opacity 0.2s" }} opacity={dim ? 0.18 : 1}>
                  <rect 
                    x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} rx={8} 
                    fill={col.bg} stroke={col.border} strokeWidth={isA ? 2 : 1} 
                    filter={!dim ? "url(#sh)" : undefined}
                    onMouseEnter={() => setHovered(course.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent unselect
                      if (selected === course.id) {
                        setSelected(null);
                      } else {
                        setSelected(course.id);
                      }
                    }}
                  />
                  
                  {/* Course completion checkbox */}
                  <rect 
                    x={pos.x + NODE_W - 20} y={pos.y + 6} width={14} height={14} rx={2}
                    fill={completedCourses.has(course.id) ? "#16a34a" : "#fff"}
                    stroke={completedCourses.has(course.id) ? "#16a34a" : "#d1d5db"}
                    strokeWidth={1}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent unselect and course selection
                      toggleCourseComplete(course.id);
                    }}
                  />
                  
                  {completedCourses.has(course.id) && (
                    <path 
                      d={`M${pos.x + NODE_W - 17},${pos.y + 11} l3,3 l6,-6`}
                      stroke="#fff" strokeWidth="2" fill="none"
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  
                  <text x={pos.x + 10} y={pos.y + 17} fontSize="11.5" fontWeight="700" fill={col.text}>{course.name}</text>
                  <text x={pos.x + 10} y={pos.y + 32} fontSize="9.5" fill={col.text} opacity={0.7}>
                    {course.label.length > 20 ? course.label.substring(0, 19) + "…" : course.label}
                  </text>
                  <rect x={pos.x + 10} y={pos.y + 42} width={32} height={16} rx={4} fill={col.tag} opacity={0.85} />
                  <text x={pos.x + 26} y={pos.y + 53} fontSize="9" fontWeight="600" fill={col.tagText} textAnchor="middle">{course.units}u</text>
                  {course.sem && (
                    <g>
                      <rect x={pos.x + 46} y={pos.y + 42} width={course.sem === "Fall & Spring" ? 26 : 20} height={16} rx={4} 
                        fill={semesterColors[course.sem] || "#4338ca"} opacity={0.8} />
                      <text x={pos.x + 46 + (course.sem === "Fall & Spring" ? 13 : 10)} y={pos.y + 53} 
                        fontSize="7.5" fontWeight="600" fill="#fff" textAnchor="middle">
                        {course.sem === "Fall & Spring" ? "F/Sp" : course.sem === "Fall" ? "Fall" : "Spr"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend (Footer) */}
        <div className="legend" style={{ 
          display: "flex", 
          gap: 16, 
          marginTop: 16,
          padding: "16px", 
          background: "#f8f9fa", 
          borderRadius: 12, 
          flexWrap: "wrap", 
          alignItems: "center",
          borderTop: "1px solid #e2e8f0"
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginRight: 8 }}>
            Legend:
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: catColors.completed.bg, border: "2px solid " + catColors.completed.border }} />
            <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>Completed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: catColors.available.bg, border: "2px solid " + catColors.available.border }} />
            <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>Available Now</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: catColors.blocked.bg, border: "2px solid " + catColors.blocked.border }} />
            <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>Prerequisites Needed</span>
          </div>
          
          <span style={{ width: 1, height: 14, background: "#d1d5db", margin: "0 8px" }} />
          
          {/* Semester indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 10, borderRadius: 3, background: semesterColors.Fall }} />
            <span style={{ fontSize: 11, color: "#475569" }}>Fall</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 10, borderRadius: 3, background: semesterColors.Spring }} />
            <span style={{ fontSize: 11, color: "#475569" }}>Spring</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 10, borderRadius: 3, background: semesterColors["Fall & Spring"] }} />
            <span style={{ fontSize: 11, color: "#475569" }}>Fall & Spring</span>
          </div>
          
          <span style={{ width: 1, height: 14, background: "#d1d5db", margin: "0 8px" }} />
          
          {/* Warning triangle indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12, color: "#dc2626" }}>⚠</span>
            <span style={{ fontSize: 11, color: "#475569" }}>Enrollment Limited</span>
          </div>
        </div>
      </div>
    </div>
  );
}
