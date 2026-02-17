import { useState, useCallback, useMemo } from "react";

const courses = [
  { id: "RHET", name: "RHET 110", label: "Rhetoric & Comp", units: 4, cat: "foundation", year: 0, col: 0, programs: ["major", "minor"] },
  { id: "ECON110", name: "ECON 110", label: "Intro Economics", units: 4, cat: "foundation", year: 0, col: 1, programs: ["major"] },
  { id: "BUS100", name: "BUS 100", label: "Launch into Business", units: 2, cat: "core", year: 0, col: 2, programs: ["major"] },
  { id: "BUS201", name: "BUS 201", label: "Financial Accounting", units: 4, cat: "core", year: 1, col: 0, programs: ["major"] },
  { id: "BUS204", name: "BUS 204", label: "Foundations of Analytics", units: 4, cat: "minor-req", year: 1, col: 1, programs: ["major", "minor"] },
  { id: "BUS202", name: "BUS 202", label: "Managerial Accounting", units: 2, cat: "core", year: 2, col: 0, programs: ["major"] },
  { id: "BUS205", name: "BUS 205", label: "Applied Business Tech", units: 2, cat: "minor-req", year: 2, col: 1, programs: ["major", "minor"] },
  { id: "BUS302", name: "BUS 302", label: "Marketing Principles", units: 4, cat: "core", year: 2, col: 2, programs: ["major"] },
  { id: "BUS304", name: "BUS 304", label: "Org Behavior", units: 4, cat: "core", year: 2, col: 3, programs: ["major"] },
  { id: "BUS305", name: "BUS 305", label: "Principles of Finance", units: 4, cat: "core", year: 2, col: 4, programs: ["major"] },
  { id: "BUS370", name: "BUS 370", label: "Internet Business Apps", units: 4, cat: "minor-only", year: 2, col: 5, programs: ["minor"], note: "Minor elective only" },
  { id: "BUS308", name: "BUS 308", label: "Processes & Projects", units: 2, cat: "elective", year: 3, col: 0, programs: ["major", "minor"] },
  { id: "BUS312", name: "BUS 312", label: "Data Wrangling", units: 4, cat: "minor-req", year: 3, col: 1, programs: ["major", "minor"] , sem: "Fall" },
  { id: "BUS340", name: "BUS 340", label: "Data Visualization", units: 2, cat: "elective", year: 3, col: 3, programs: ["major", "minor"] , sem: "Fall" },
  { id: "BUS41902", name: "BUS 419-02", label: "Societal Impact of Tech", units: 2, cat: "elective", year: 3, col: 4, programs: ["major", "minor"] , sem: "Fall & Spring", enrollLimit: true },
  { id: "BUS301", name: "BUS 301", label: "Business Law", units: 4, cat: "core", year: 4, col: 0, programs: ["major"] },
  { id: "BUS315", name: "BUS 315", label: "Data Mining", units: 4, cat: "elective", year: 4, col: 1, programs: ["major", "minor"] , sem: "Fall" },
  { id: "BUS316", name: "BUS 316", label: "ML for Business", units: 2, cat: "elective", year: 4, col: 2, programs: ["major", "minor"] , sem: "Spring" },
  { id: "BUS415", name: "BUS 415", label: "Supply Chain Mgmt", units: 2, cat: "elective", year: 4, col: 4, programs: ["major", "minor"] , sem: "Fall & Spring", enrollLimit: true },
  { id: "BUS317", name: "BUS 317", label: "AI for Business", units: 2, cat: "elective", year: 5, col: 2, programs: ["major", "minor"] , sem: "Spring" },
  { id: "BUS410", name: "BUS 410", label: "Analytics for Good", units: 4, cat: "elective", year: 5, col: 1, programs: ["major", "minor"] , sem: "Fall & Spring" },
  { id: "BUS411", name: "BUS 411", label: "Analytics Immersion", units: 2, cat: "elective", year: 5, col: 3, programs: ["major", "minor"] , sem: "Spring" },
  { id: "BUS41901", name: "BUS 419-01", label: "Business Impact Studio", units: 2, cat: "elective", year: 5, col: 4, programs: ["major", "minor"] , sem: "Fall & Spring", enrollLimit: true },
  { id: "BUS403", name: "BUS 403", label: "Entrepreneurial Strategy", units: 4, cat: "core", year: 6, col: 1, programs: ["major"] },
];

const edges = [
  { from: "RHET", to: "BUS100", type: "concurrent" },
  { from: "RHET", to: "BUS201", type: "concurrent" },
  { from: "RHET", to: "BUS204", type: "concurrent" },
  { from: "BUS201", to: "BUS202", type: "required" },
  { from: "BUS204", to: "BUS202", type: "concurrent" },
  { from: "BUS204", to: "BUS205", type: "concurrent" },
  { from: "BUS201", to: "BUS305", type: "required" },
  { from: "ECON110", to: "BUS305", type: "required" },
  { from: "BUS205", to: "BUS308", type: "required" },
  { from: "BUS205", to: "BUS312", type: "required" },
  { from: "BUS204", to: "BUS340", type: "required" },
  { from: "BUS204", to: "BUS41902", type: "required" },
  { from: "BUS312", to: "BUS315", type: "concurrent" },
  { from: "BUS312", to: "BUS316", type: "concurrent" },
  { from: "BUS316", to: "BUS317", type: "concurrent" },
  { from: "BUS340", to: "BUS410", type: "required" },
  { from: "BUS315", to: "BUS410", type: "required" },
  { from: "BUS316", to: "BUS410", type: "required" },
  { from: "BUS340", to: "BUS411", type: "required" },
  { from: "BUS315", to: "BUS411", type: "required" },
  { from: "BUS316", to: "BUS411", type: "required" },
  { from: "BUS340", to: "BUS41901", type: "required" },
  { from: "BUS315", to: "BUS41901", type: "required" },
  { from: "BUS316", to: "BUS41901", type: "required" },
  { from: "BUS301", to: "BUS403", type: "required" },
  { from: "BUS302", to: "BUS403", type: "required" },
  { from: "BUS304", to: "BUS403", type: "required" },
  { from: "BUS305", to: "BUS403", type: "required" },
  { from: "BUS308", to: "BUS403", type: "concurrent" },
  { from: "BUS204", to: "BUS415", type: "required" },
  { from: "RHET", to: "BUS370", type: "required" },
];

const majorRequired = ["BUS312", "BUS315"];
const minorRequired = ["BUS204", "BUS205", "BUS312"];

const catColors = {
  foundation: { bg: "#f1f5f9", border: "#94a3b8", text: "#334155", tag: "#64748b", tagText: "#fff" },
  core: { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a5f", tag: "#3b82f6", tagText: "#fff" },
  "minor-req": { bg: "#fef3c7", border: "#f59e0b", text: "#78350f", tag: "#f59e0b", tagText: "#fff" },
  "minor-only": { bg: "#fce7f3", border: "#ec4899", text: "#831843", tag: "#ec4899", tagText: "#fff" },
  required: { bg: "#fef3c7", border: "#f59e0b", text: "#78350f", tag: "#f59e0b", tagText: "#fff" },
  elective: { bg: "#d1fae5", border: "#10b981", text: "#064e3b", tag: "#10b981", tagText: "#fff" },
};

function getCatForView(course, view) {
  if (view === "minor") {
    if (minorRequired.includes(course.id)) return "minor-req";
    if (course.id === "BUS370") return "minor-only";
    if (course.cat === "foundation") return "foundation";
    return "elective";
  }
  if (view === "major") {
    if (majorRequired.includes(course.id)) return "required";
    if (course.cat === "minor-req" || course.id === "BUS308") return "core";
    return course.cat;
  }
  if (course.id === "BUS370") return "minor-only";
  if (minorRequired.includes(course.id)) return "minor-req";
  if (majorRequired.includes(course.id) && !minorRequired.includes(course.id)) return "required";
  return course.cat;
}

const yearLabels = ["First Year\nFall", "First Year\nSpring", "Sophomore", "Junior\nFall", "Junior\nSpring", "Senior\nFall", "Senior\nSpring"];

const NODE_W = 148, NODE_H = 72, COL_GAP = 166, ROW_GAP = 108, PAD_LEFT = 130, PAD_TOP = 60;

function getPos(c) { return { x: PAD_LEFT + c.col * COL_GAP, y: PAD_TOP + c.year * ROW_GAP }; }

function buildPath(f, t) {
  const fp = getPos(f), tp = getPos(t);
  const sx = fp.x + NODE_W / 2, sy = fp.y + NODE_H, ex = tp.x + NODE_W / 2, ey = tp.y;
  return "M" + sx + "," + sy + " C" + sx + "," + ((sy + ey) / 2) + " " + ex + "," + ((sy + ey) / 2) + " " + ex + "," + ey;
}

function walkGraph(id, edgeList, field) {
  const r = new Set();
  const other = field === "to" ? "from" : "to";
  (function go(i) { for (const e of edgeList) if (e[field] === i && !r.has(e[other])) { r.add(e[other]); go(e[other]); } })(id);
  return r;
}

export default function PrereqChart() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("all");

  const courseMap = useMemo(function () { var m = {}; courses.forEach(function (c) { m[c.id] = c; }); return m; }, []);

  const visibleCourses = useMemo(function () {
    if (view === "all") return courses;
    return courses.filter(function (c) { return c.programs.indexOf(view) >= 0; });
  }, [view]);
  const visibleIds = useMemo(function () { return new Set(visibleCourses.map(function (c) { return c.id; })); }, [visibleCourses]);
  const visibleEdges = useMemo(function () { return edges.filter(function (e) { return visibleIds.has(e.from) && visibleIds.has(e.to); }); }, [visibleIds]);

  const active = selected || hovered;
  const highlighted = useMemo(function () {
    if (!active) return null;
    return { ancestors: walkGraph(active, visibleEdges, "to"), descendants: walkGraph(active, visibleEdges, "from") };
  }, [active, visibleEdges]);

  var isRelevant = useCallback(function (id) {
    if (!active || !highlighted) return true;
    return id === active || highlighted.ancestors.has(id) || highlighted.descendants.has(id);
  }, [active, highlighted]);
  var isEdgeRelevant = useCallback(function (e) {
    if (!active || !highlighted) return true;
    var s = new Set([active, ...highlighted.ancestors, ...highlighted.descendants]);
    return s.has(e.from) && s.has(e.to);
  }, [active, highlighted]);

  var maxCol = 0, maxRow = 0;
  visibleCourses.forEach(function (c) { if (c.col > maxCol) maxCol = c.col; if (c.year > maxRow) maxRow = c.year; });
  var svgW = PAD_LEFT + (maxCol + 1) * COL_GAP + NODE_W / 2 + 20;
  var svgH = PAD_TOP + (maxRow + 1) * ROW_GAP + NODE_H + 20;

  var legendItems = view === "minor"
    ? [{ k: "foundation", l: "Foundation" }, { k: "minor-req", l: "Minor Required" }, { k: "elective", l: "Minor Elective" }, { k: "minor-only", l: "Minor Only" }]
    : view === "major"
    ? [{ k: "foundation", l: "Foundation" }, { k: "core", l: "Business Core" }, { k: "required", l: "Required Analytics" }, { k: "elective", l: "Elective" }]
    : [{ k: "foundation", l: "Foundation" }, { k: "core", l: "Major Core" }, { k: "minor-req", l: "Minor Req / Major Core" }, { k: "required", l: "Major Req Analytics" }, { k: "elective", l: "Elective (Both)" }, { k: "minor-only", l: "Minor Only" }];

  var summaryData = view === "minor"
    ? { total: "20 units", req: "BUS 204 + 205 + 312 (10u)", elec: "10u from 10 options", who: "Non-business majors", note: "Electives after Soph Fall" }
    : view === "major"
    ? { total: "52 units", req: "32u core + 8u required analytics", elec: "12u from 7 options", who: "BSBA students", note: "Electives after Soph Fall" }
    : null;

  var catLabelsMap = { foundation: "Foundation", core: "Major Core", "minor-req": "Minor Required", "minor-only": "Minor Only", required: "Required Analytics", elective: "Elective" };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif", background: "#fafbfc", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Business Analytics Major/Minor Course Sequence and Prerequisite Map</h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Click a course to trace its dependency chain. Toggle views to compare programs.</p>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
            {[{ k: "all", l: "All" }, { k: "major", l: "Major (52u)" }, { k: "minor", l: "Minor (20u)" }].map(function (v) {
              return (
                <button key={v.k} onClick={function () { setView(v.k); setSelected(null); setHovered(null); }}
                  style={{ padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s", background: view === v.k ? "#fff" : "transparent", color: view === v.k ? "#0f172a" : "#64748b", boxShadow: view === v.k ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                  {v.l}
                </button>
              );
            })}
          </div>
        </div>

        {summaryData && (
          <div style={{ display: "flex", gap: 16, marginBottom: 12, padding: "10px 16px", background: view === "minor" ? "#fdf2f8" : "#eff6ff", border: "1px solid " + (view === "minor" ? "#fbcfe8" : "#bfdbfe"), borderRadius: 8, fontSize: 12, color: "#334155", flexWrap: "wrap" }}>
            <span><strong>Total:</strong> {summaryData.total}</span>
            <span><strong>Required:</strong> {summaryData.req}</span>
            <span><strong>Electives:</strong> {summaryData.elec}</span>
            <span><strong>Audience:</strong> {summaryData.who}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          {legendItems.map(function (item) {
            return (
              <div key={item.k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: catColors[item.k].bg, border: "2px solid " + catColors[item.k].border }} />
                <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>{item.l}</span>
              </div>
            );
          })}
          <span style={{ width: 1, height: 14, background: "#d1d5db" }} />
          {[{ c: "#3b82f6", d: "none", l: "Required" }, { c: "#f59e0b", d: "5,3", l: "Concurrent OK" }, { c: "#10b981", d: "3,3", l: "Either/Or" }].map(function (item) {
            return (
              <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke={item.c} strokeWidth="1.5" strokeDasharray={item.d} /></svg>
                <span style={{ fontSize: 11, color: "#475569" }}>{item.l}</span>
              </div>
            );
          })}
          {view === "all" && (
            <>
              <span style={{ width: 1, height: 14, background: "#d1d5db" }} />
              {[{ c: "#8b5cf6", l: "Both" }, { c: "#3b82f6", l: "Major only" }, { c: "#ec4899", l: "Minor only" }].map(function (item) {
                return (
                  <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.c }} />
                    <span style={{ fontSize: 11, color: "#475569" }}>{item.l}</span>
                  </div>
                );
              })}
            </>
          )}
          <span style={{ width: 1, height: 14, background: "#d1d5db" }} />
          {[{ c: "#c2410c", l: "Fall" }, { c: "#15803d", l: "Spring" }, { c: "#4338ca", l: "Fall & Spr" }].map(function (item) {
            return (
              <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 12, height: 10, borderRadius: 3, background: item.c }} />
                <span style={{ fontSize: 11, color: "#475569" }}>{item.l}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>â€ </span>
            <span style={{ fontSize: 11, color: "#475569" }}>Enrollment limited</span>
          </div>
        </div>

        <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <svg width={svgW} height={svgH} style={{ display: "block" }}>
            <defs>
              <marker id="ar" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#3b82f6" /></marker>
              <marker id="ac" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#f59e0b" /></marker>
              <marker id="ae" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#10b981" /></marker>
              <marker id="ad" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#cbd5e1" /></marker>
              <filter id="sh" x="-4%" y="-4%" width="108%" height="116%"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" /></filter>
              <filter id="gl"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.25" /></filter>
            </defs>

            {yearLabels.slice(0, maxRow + 1).map(function (label, i) {
              return (
                <text key={i} x={10} y={PAD_TOP + i * ROW_GAP + NODE_H / 2} fontSize="9" fill="#94a3b8" fontWeight="600" textAnchor="start" dominantBaseline="middle" style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {label.split("\n").map(function (part, j) { return <tspan key={j} x={10} dy={j === 0 ? -6 : 12}>{part}</tspan>; })}
                </text>
              );
            })}

            {Array.from({ length: maxRow + 1 }, function (_, i) {
              return <line key={i} x1={PAD_LEFT - 10} y1={PAD_TOP + i * ROW_GAP - 16} x2={svgW - 20} y2={PAD_TOP + i * ROW_GAP - 16} stroke="#f1f5f9" strokeWidth="1" />;
            })}

            {visibleEdges.map(function (e, i) {
              var fc = courseMap[e.from], tc = courseMap[e.to];
              if (!fc || !tc) return null;
              var p = buildPath(fc, tc);
              var dim = active && !isEdgeRelevant(e);
              var stroke = dim ? "#e2e8f0" : e.type === "concurrent" ? "#f59e0b" : e.type === "choice" ? "#10b981" : "#3b82f6";
              var dash = e.type === "concurrent" ? "5,3" : e.type === "choice" ? "3,3" : "none";
              var mk = dim ? "url(#ad)" : e.type === "concurrent" ? "url(#ac)" : e.type === "choice" ? "url(#ae)" : "url(#ar)";
              return <path key={i} d={p} fill="none" stroke={stroke} strokeWidth={dim ? 1 : 1.5} strokeDasharray={dash} markerEnd={mk} opacity={dim ? 0.2 : 0.75} style={{ transition: "all 0.2s" }} />;
            })}

            {visibleCourses.map(function (c) {
              var pos = getPos(c);
              var ec = getCatForView(c, view);
              var col = catColors[ec] || catColors.elective;
              var isA = active === c.id, isAnc = highlighted ? highlighted.ancestors.has(c.id) : false, isDsc = highlighted ? highlighted.descendants.has(c.id) : false;
              var rel = isRelevant(c.id), dim = active && !rel;
              var ring = isA ? "#1d4ed8" : isAnc ? "#7c3aed" : isDsc ? "#059669" : null;
              var progCol = c.programs.length === 2 ? "#8b5cf6" : c.programs[0] === "minor" ? "#ec4899" : "#3b82f6";

              return (
                <g key={c.id} style={{ cursor: "pointer", transition: "opacity 0.2s" }} opacity={dim ? 0.18 : 1}
                  onMouseEnter={function () { if (!selected) setHovered(c.id); }} onMouseLeave={function () { if (!selected) setHovered(null); }}
                  onClick={function () { if (selected === c.id) { setSelected(null); setHovered(null); } else { setSelected(c.id); setHovered(null); } }}>
                  {ring && <rect x={pos.x - 3} y={pos.y - 3} width={NODE_W + 6} height={NODE_H + 6} rx={10} fill="none" stroke={ring} strokeWidth={2} filter="url(#gl)" />}
                  <rect x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} rx={8} fill={col.bg} stroke={col.border} strokeWidth={isA ? 2 : 1} filter={!dim ? "url(#sh)" : undefined} />
                  <text x={pos.x + 10} y={pos.y + 17} fontSize="11.5" fontWeight="700" fill={col.text}>{c.name}</text>
                  <text x={pos.x + 10} y={pos.y + 32} fontSize="9.5" fill={col.text} opacity={0.7}>
                    {c.label.length > 20 ? c.label.substring(0, 19) + "\u2026" : c.label}
                  </text>
                  <rect x={pos.x + 10} y={pos.y + 42} width={32} height={16} rx={4} fill={col.tag} opacity={0.85} />
                  <text x={pos.x + 26} y={pos.y + 53} fontSize="9" fontWeight="600" fill={col.tagText} textAnchor="middle">{c.units}u</text>
                  {c.sem && (
                    <g>
                      <rect x={pos.x + 46} y={pos.y + 42} width={c.sem === "Fall & Spring" ? 26 : 20} height={16} rx={4} fill={c.sem.includes("Fall") && !c.sem.includes("Spring") ? "#c2410c" : c.sem.includes("Spring") && !c.sem.includes("Fall") ? "#15803d" : "#4338ca"} opacity={0.8} />
                      <text x={pos.x + 46 + (c.sem === "Fall & Spring" ? 13 : 10)} y={pos.y + 53} fontSize="7.5" fontWeight="600" fill="#fff" textAnchor="middle">{c.sem === "Fall & Spring" ? "F/Sp" : c.sem === "Fall" ? "Fall" : "Spr"}</text>
                    </g>
                  )}
                  {c.enrollLimit && (
                    <text x={pos.x + (c.sem === "Fall & Spring" ? 78 : c.sem ? 72 : 48)} y={pos.y + 53} fontSize="8" fill="#dc2626" fontWeight="600">â€ </text>
                  )}
                  {view === "all" && (
                    <g transform={"translate(" + (pos.x + NODE_W - 14) + ", " + (pos.y + 6) + ")"}>
                      <rect width={8} height={8} rx={2} fill={progCol} opacity={0.9}><title>{c.programs.join(" & ")}</title></rect>
                    </g>
                  )}
                  {c.note && (
                    <g>
                      <circle cx={pos.x + NODE_W - 10} cy={pos.y + NODE_H - 10} r={5} fill="#ef4444" opacity={0.8} />
                      <text x={pos.x + NODE_W - 10} y={pos.y + NODE_H - 6.5} fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle">!</text>
                      <title>{c.note}</title>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {active && courseMap[active] && (function () {
          var c = courseMap[active], ec = getCatForView(c, view), col = catColors[ec] || catColors.elective;
          var pre = edges.filter(function (e) { return e.to === active && visibleIds.has(e.from); }).map(function (e) { return courseMap[e.from] ? courseMap[e.from].name : null; }).filter(Boolean);
          var unl = edges.filter(function (e) { return e.from === active && visibleIds.has(e.to); }).map(function (e) { return courseMap[e.to] ? courseMap[e.to].name : null; }).filter(Boolean);
          var dual = c.programs.length === 2;
          var moOnly = c.programs.length === 1 && c.programs[0] === "minor";
          var maOnly = c.programs.length === 1 && c.programs[0] === "major";
          return (
            <div style={{ marginTop: 14, padding: "12px 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{c.name}</span>
                <span style={{ fontSize: 13, color: "#64748b" }}>{c.label}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: col.tag, color: "#fff", fontWeight: 600 }}>{catLabelsMap[ec]}</span>
                {dual && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#8b5cf6", color: "#fff", fontWeight: 600 }}>Major & Minor</span>}
                {moOnly && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#ec4899", color: "#fff", fontWeight: 600 }}>Minor Only</span>}
                {maOnly && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#3b82f6", color: "#fff", fontWeight: 600 }}>Major Only</span>}
                <span style={{ fontSize: 11, color: "#64748b" }}>{c.units} unit{c.units !== 1 ? "s" : ""}</span>
                {c.sem && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: c.sem.includes("Fall") && !c.sem.includes("Spring") ? "#c2410c" : c.sem.includes("Spring") && !c.sem.includes("Fall") ? "#15803d" : "#4338ca", color: "#fff", fontWeight: 600 }}>{c.sem}</span>}
                {c.enrollLimit && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#dc2626", color: "#fff", fontWeight: 600 }}>Enrollment Limited</span>}
              </div>
              <div style={{ display: "flex", gap: 24, fontSize: 12, color: "#475569", flexWrap: "wrap" }}>
                <div><strong style={{ color: "#7c3aed" }}>Prerequisites:</strong> {pre.length ? pre.join(", ") : "None"}</div>
                <div><strong style={{ color: "#059669" }}>Unlocks:</strong> {unl.length ? unl.join(", ") : "None (terminal)"}</div>
              </div>
              {c.note && <div style={{ marginTop: 5, fontSize: 11, color: "#ef4444", fontWeight: 500 }}>{"\u26A0"} {c.note}</div>}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
