import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Accessibility, X, AlertTriangle, AlertCircle, Info, CheckCircle2,
  FileDown, FileJson, History, Keyboard, ChevronLeft, ChevronRight, Trash2,
} from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Severity = "critical" | "warning" | "info";

interface Issue {
  severity: Severity;
  rule: string;
  message: string;
  selector: string;
  snippet: string;
}

const parseRgb = (s: string): [number, number, number, number] | null => {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((v) => parseFloat(v.trim()));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0, parts[3] ?? 1];
};

const relLum = (r: number, g: number, b: number) => {
  const conv = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * conv(r) + 0.7152 * conv(g) + 0.0722 * conv(b);
};

const contrastRatio = (fg: [number, number, number], bg: [number, number, number]) => {
  const l1 = relLum(...fg);
  const l2 = relLum(...bg);
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
};

const getEffectiveBg = (el: Element): [number, number, number] => {
  let node: Element | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    const rgb = parseRgb(bg);
    if (rgb && rgb[3] > 0) return [rgb[0], rgb[1], rgb[2]];
    node = node.parentElement;
  }
  return [255, 255, 255];
};

const shortSelector = (el: Element) => {
  const tag = el.tagName.toLowerCase();
  const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : "";
  const cls = (el as HTMLElement).className && typeof (el as HTMLElement).className === "string"
    ? "." + (el as HTMLElement).className.split(/\s+/).filter(Boolean).slice(0, 2).join(".")
    : "";
  return `${tag}${id}${cls}`.slice(0, 80);
};

const snippetOf = (el: Element) => {
  const s = el.outerHTML.replace(/\s+/g, " ").trim();
  return s.length > 140 ? s.slice(0, 140) + "…" : s;
};

const runAudit = (): Issue[] => {
  const issues: Issue[] = [];
  const root = document.querySelector("main") || document.body;

  // 1. Images missing alt
  root.querySelectorAll("img:not([alt])").forEach((el) => {
    issues.push({
      severity: "critical",
      rule: "image-alt",
      message: "Image missing alt attribute.",
      selector: shortSelector(el),
      snippet: snippetOf(el),
    });
  });

  // 2. Buttons / links without accessible name
  root.querySelectorAll("button, a[href]").forEach((el) => {
    const text = (el.textContent || "").trim();
    const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title");
    const hasImgAlt = Array.from(el.querySelectorAll("img")).some((i) => i.getAttribute("alt"));
    if (!text && !aria && !hasImgAlt) {
      issues.push({
        severity: "critical",
        rule: el.tagName === "A" ? "link-name" : "button-name",
        message: `${el.tagName === "A" ? "Link" : "Button"} has no accessible name (add aria-label or visible text).`,
        selector: shortSelector(el),
        snippet: snippetOf(el),
      });
    }
  });

  // 3. Inputs without labels
  root.querySelectorAll("input, select, textarea").forEach((el) => {
    const type = (el as HTMLInputElement).type;
    if (type === "hidden" || type === "submit" || type === "button") return;
    const id = (el as HTMLElement).id;
    const hasLabel = id && !!document.querySelector(`label[for="${CSS.escape(id)}"]`);
    const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
    const wrapped = !!el.closest("label");
    if (!hasLabel && !aria && !wrapped) {
      issues.push({
        severity: "critical",
        rule: "form-label",
        message: "Form control has no associated label.",
        selector: shortSelector(el),
        snippet: snippetOf(el),
      });
    }
  });

  // 4. Clickable non-interactive elements
  root.querySelectorAll("[onclick], div[role='button'], span[role='button']").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "button" || tag === "a") return;
    const tabindex = el.getAttribute("tabindex");
    if (tabindex === null || parseInt(tabindex) < 0) {
      issues.push({
        severity: "warning",
        rule: "keyboard-focus",
        message: "Clickable element is not keyboard focusable (missing tabindex=\"0\").",
        selector: shortSelector(el),
        snippet: snippetOf(el),
      });
    }
  });

  // 5. Positive tabindex
  root.querySelectorAll("[tabindex]").forEach((el) => {
    const t = parseInt(el.getAttribute("tabindex") || "0");
    if (t > 0) {
      issues.push({
        severity: "warning",
        rule: "tabindex",
        message: `Positive tabindex (${t}) disrupts natural tab order.`,
        selector: shortSelector(el),
        snippet: snippetOf(el),
      });
    }
  });

  // 6. Heading order
  const headings = Array.from(root.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  let prev = 0;
  headings.forEach((h) => {
    const level = parseInt(h.tagName[1]);
    if (prev && level > prev + 1) {
      issues.push({
        severity: "info",
        rule: "heading-order",
        message: `Heading level skipped (h${prev} → h${level}).`,
        selector: shortSelector(h),
        snippet: snippetOf(h),
      });
    }
    prev = level;
  });

  // 7. aria-hidden with focusable children
  root.querySelectorAll('[aria-hidden="true"]').forEach((el) => {
    if (el.querySelector("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])")) {
      issues.push({
        severity: "critical",
        rule: "aria-hidden-focus",
        message: "aria-hidden element contains focusable descendants.",
        selector: shortSelector(el),
        snippet: snippetOf(el),
      });
    }
  });

  // 8. Contrast (sampled: leaf elements with text)
  const textEls = Array.from(root.querySelectorAll("p, span, a, button, h1, h2, h3, h4, h5, h6, label, li, td, th, div"))
    .filter((el) => {
      const t = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0);
      if (!t) return false;
      const r = (el as HTMLElement).getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    })
    .slice(0, 400);
  const seen = new Set<string>();
  textEls.forEach((el) => {
    const style = getComputedStyle(el);
    const fg = parseRgb(style.color);
    if (!fg || fg[3] === 0) return;
    const bg = getEffectiveBg(el);
    const ratio = contrastRatio([fg[0], fg[1], fg[2]], bg);
    const size = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const min = large ? 3 : 4.5;
    if (ratio < min) {
      const key = shortSelector(el) + ratio.toFixed(2);
      if (seen.has(key)) return;
      seen.add(key);
      issues.push({
        severity: ratio < min - 1 ? "critical" : "warning",
        rule: "color-contrast",
        message: `Low contrast ${ratio.toFixed(2)}:1 (need ${min}:1).`,
        selector: shortSelector(el),
        snippet: snippetOf(el),
      });
    }
  });

  // 9. Duplicate IDs
  const idMap = new Map<string, number>();
  root.querySelectorAll("[id]").forEach((el) => {
    const id = (el as HTMLElement).id;
    idMap.set(id, (idMap.get(id) || 0) + 1);
  });
  idMap.forEach((count, id) => {
    if (count > 1) {
      issues.push({
        severity: "warning",
        rule: "duplicate-id",
        message: `Duplicate id="${id}" used ${count} times.`,
        selector: `#${id}`,
        snippet: `${count} elements share this id`,
      });
    }
  });

  return issues;
};

// ---- History storage (per pathname) ----
interface AuditRun {
  id: string;
  timestamp: number;
  path: string;
  counts: { critical: number; warning: number; info: number };
  issues: Issue[];
}
const HISTORY_KEY = "a11y_audit_history_v1";
const loadHistory = (): AuditRun[] => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
};
const saveHistory = (runs: AuditRun[]) => {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(runs.slice(0, 100))); } catch { /* ignore */ }
};

// ---- Exports ----
const downloadBlob = (data: string, filename: string, mime: string) => {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const exportJSON = (run: AuditRun) => {
  downloadBlob(JSON.stringify(run, null, 2), `a11y-audit-${new Date(run.timestamp).toISOString().slice(0, 19)}.json`, "application/json");
};

const exportPDF = (run: AuditRun) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  doc.setFontSize(18); doc.text("Accessibility Audit Report", margin, y); y += 22;
  doc.setFontSize(10); doc.setTextColor(100);
  doc.text(`Page: ${run.path}`, margin, y); y += 14;
  doc.text(`Generated: ${new Date(run.timestamp).toLocaleString()}`, margin, y); y += 20;
  doc.setTextColor(0); doc.setFontSize(12);
  doc.text(`Critical: ${run.counts.critical}   Warnings: ${run.counts.warning}   Info: ${run.counts.info}`, margin, y);
  y += 24;

  const writeLine = (text: string, size = 10, color: [number, number, number] = [30, 30, 30]) => {
    doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    lines.forEach((ln: string) => {
      if (y > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(ln, margin, y); y += size + 3;
    });
  };

  if (run.issues.length === 0) {
    writeLine("No issues detected. This page passes automated checks.", 11, [30, 120, 60]);
  }

  run.issues.forEach((issue, idx) => {
    if (y > pageHeight - margin - 60) { doc.addPage(); y = margin; }
    const color: [number, number, number] =
      issue.severity === "critical" ? [200, 30, 40] :
      issue.severity === "warning" ? [200, 130, 20] : [80, 80, 80];
    writeLine(`${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.rule}`, 11, color);
    writeLine(issue.message, 10);
    writeLine(`Selector: ${issue.selector}`, 9, [90, 90, 90]);
    writeLine(`Snippet:  ${issue.snippet}`, 9, [90, 90, 90]);
    y += 6;
  });

  doc.save(`a11y-audit-${new Date(run.timestamp).toISOString().slice(0, 19)}.pdf`);
};

// ---- Focus walkthrough ----
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FocusStep { el: HTMLElement; rect: DOMRect; trap: boolean; note?: string; }

const collectFocusOrder = (): FocusStep[] => {
  const root = document.querySelector("main") || document.body;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((el) => {
      if (el.getAttribute("aria-hidden") === "true") return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const style = getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  // Sort by tabindex (positive first, in ascending order), then DOM order
  const withIdx = nodes.map((el, i) => ({ el, i, t: parseInt(el.getAttribute("tabindex") || "0") }));
  withIdx.sort((a, b) => {
    if (a.t > 0 && b.t > 0) return a.t - b.t;
    if (a.t > 0) return -1;
    if (b.t > 0) return 1;
    return a.i - b.i;
  });
  return withIdx.map(({ el, t }) => {
    const rect = el.getBoundingClientRect();
    const trap = t > 0; // positive tabindex disrupts order — flag as potential trap risk
    return { el, rect, trap, note: t > 0 ? `Positive tabindex=${t}` : undefined };
  });
};

const FocusWalkthrough = ({ onClose }: { onClose: () => void }) => {
  const [steps, setSteps] = useState<FocusStep[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setSteps(collectFocusOrder());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(c + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  useEffect(() => {
    const step = steps[current];
    if (!step) return;
    step.el.scrollIntoView({ behavior: "smooth", block: "center" });
    try { step.el.focus({ preventScroll: true }); } catch { /* ignore */ }
  }, [current, steps]);

  const active = steps[current];
  const activeRect = active?.el.getBoundingClientRect();

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none" aria-hidden>
      {steps.map((s, idx) => {
        const r = s.el.getBoundingClientRect();
        return (
          <div
            key={idx}
            className="absolute pointer-events-none"
            style={{ top: r.top + window.scrollY - 10, left: r.left + window.scrollX - 10 }}
          >
            <div className={`text-[10px] font-bold text-white rounded-full h-6 min-w-6 px-1.5 flex items-center justify-center shadow-lg ${s.trap ? "bg-destructive" : idx === current ? "bg-primary ring-4 ring-primary/30" : "bg-foreground/70"}`}>
              {idx + 1}
            </div>
          </div>
        );
      })}
      {activeRect && (
        <div
          className="absolute border-2 border-primary rounded-md pointer-events-none animate-pulse"
          style={{
            top: activeRect.top + window.scrollY - 4,
            left: activeRect.left + window.scrollX - 4,
            width: activeRect.width + 8,
            height: activeRect.height + 8,
          }}
        />
      )}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto bg-card border border-border shadow-2xl rounded-full flex items-center gap-2 px-3 py-2 z-[70]">
        <Keyboard className="w-4 h-4 text-primary" />
        <Button variant="ghost" size="icon" onClick={() => setCurrent((c) => Math.max(c - 1, 0))} disabled={current === 0} aria-label="Previous focus stop">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-xs font-medium min-w-[100px] text-center">
          {steps.length === 0 ? "No focusable elements" : `${current + 1} / ${steps.length}`}
          {active?.trap && <div className="text-[10px] text-destructive">{active.note}</div>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setCurrent((c) => Math.min(c + 1, steps.length - 1))} disabled={current >= steps.length - 1} aria-label="Next focus stop">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Exit focus walkthrough">
          <X className="w-4 h-4 mr-1" /> Exit
        </Button>
      </div>
    </div>
  );
};

const severityIcon = (s: Severity) =>
  s === "critical" ? <AlertCircle className="w-4 h-4 text-destructive" /> :
  s === "warning" ? <AlertTriangle className="w-4 h-4 text-warning" /> :
  <Info className="w-4 h-4 text-muted-foreground" />;

export const AccessibilityAudit = () => {
  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [highlight, setHighlight] = useState<Severity | "all">("all");
  const [tab, setTab] = useState<"current" | "history">("current");
  const [history, setHistory] = useState<AuditRun[]>(() => loadHistory());
  const [walkthrough, setWalkthrough] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      const result = runAudit();
      setIssues(result);
      const run: AuditRun = {
        id: `${Date.now()}`,
        timestamp: Date.now(),
        path,
        counts: {
          critical: result.filter((i) => i.severity === "critical").length,
          warning: result.filter((i) => i.severity === "warning").length,
          info: result.filter((i) => i.severity === "info").length,
        },
        issues: result,
      };
      const next = [run, ...loadHistory()].slice(0, 100);
      saveHistory(next);
      setHistory(next);
      setScanning(false);
    }, 60);
  };

  const handleOpen = () => {
    setOpen(true);
    if (!issues) scan();
  };

  const counts = {
    critical: issues?.filter((i) => i.severity === "critical").length ?? 0,
    warning: issues?.filter((i) => i.severity === "warning").length ?? 0,
    info: issues?.filter((i) => i.severity === "info").length ?? 0,
  };

  const filtered = issues?.filter((i) => highlight === "all" || i.severity === highlight) ?? [];

  const currentRun: AuditRun | null = issues
    ? { id: "current", timestamp: Date.now(), path, counts, issues }
    : null;

  const pageHistory = history.filter((h) => h.path === path);

  const clearHistory = () => {
    const kept = history.filter((h) => h.path !== path);
    saveHistory(kept);
    setHistory(kept);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        aria-label="Run accessibility audit"
        size="icon"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg h-12 w-12"
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {walkthrough && <FocusWalkthrough onClose={() => setWalkthrough(false)} />}

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Accessibility audit">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-primary" />
                  Accessibility Audit
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[280px]">Page: {path}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close audit panel">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "current" | "history")} className="flex-1 flex flex-col min-h-0">
              <TabsList className="mx-4 mt-3 grid grid-cols-2">
                <TabsTrigger value="current">Current scan</TabsTrigger>
                <TabsTrigger value="history">
                  History {pageHistory.length > 0 && <span className="ml-1 text-[10px] opacity-70">({pageHistory.length})</span>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="flex-1 flex flex-col min-h-0 m-0">
                <div className="p-4 border-b border-border space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setHighlight(highlight === "critical" ? "all" : "critical")}
                  className={`p-2 rounded-lg border text-left transition ${highlight === "critical" ? "border-destructive bg-destructive/10" : "border-border"}`}
                >
                  <div className="text-xs text-muted-foreground">Critical</div>
                  <div className="text-lg font-bold text-destructive">{counts.critical}</div>
                </button>
                <button
                  onClick={() => setHighlight(highlight === "warning" ? "all" : "warning")}
                  className={`p-2 rounded-lg border text-left transition ${highlight === "warning" ? "border-warning bg-warning/10" : "border-border"}`}
                >
                  <div className="text-xs text-muted-foreground">Warning</div>
                  <div className="text-lg font-bold text-warning">{counts.warning}</div>
                </button>
                <button
                  onClick={() => setHighlight(highlight === "info" ? "all" : "info")}
                  className={`p-2 rounded-lg border text-left transition ${highlight === "info" ? "border-primary bg-primary/10" : "border-border"}`}
                >
                  <div className="text-xs text-muted-foreground">Info</div>
                  <div className="text-lg font-bold">{counts.info}</div>
                </button>
              </div>
              <Button onClick={scan} disabled={scanning} className="w-full" size="sm">
                {scanning ? "Scanning…" : "Re-scan page"}
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => currentRun && exportPDF(currentRun)} disabled={!currentRun}>
                  <FileDown className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => currentRun && exportJSON(currentRun)} disabled={!currentRun}>
                  <FileJson className="w-3.5 h-3.5 mr-1" /> JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); setWalkthrough(true); }}>
                  <Keyboard className="w-3.5 h-3.5 mr-1" /> Focus
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {scanning && <p className="text-sm text-muted-foreground">Analyzing DOM…</p>}
                {!scanning && issues && issues.length === 0 && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <CheckCircle2 className="w-10 h-10 text-success mb-2" />
                    <p className="font-medium">No issues detected</p>
                    <p className="text-xs text-muted-foreground">This page passes the automated checks.</p>
                  </div>
                )}
                {filtered.map((issue, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border bg-secondary/20 space-y-1.5">
                    <div className="flex items-start gap-2">
                      {severityIcon(issue.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] font-mono">{issue.rule}</Badge>
                        </div>
                        <p className="text-sm mt-1">{issue.message}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{issue.selector}</p>
                        <p className="text-[10px] text-muted-foreground/70 font-mono mt-1 line-clamp-2 break-all">{issue.snippet}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
              </TabsContent>

              <TabsContent value="history" className="flex-1 flex flex-col min-h-0 m-0">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <History className="w-4 h-4 text-primary" />
                    <span className="font-medium">Past runs on this page</span>
                  </div>
                  {pageHistory.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearHistory} aria-label="Clear history for this page">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-2">
                    {pageHistory.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No past audits for this page yet. Run a scan to record history.
                      </p>
                    )}
                    {pageHistory.map((run) => (
                      <div key={run.id} className="p-3 rounded-lg border border-border bg-secondary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-muted-foreground">
                            {new Date(run.timestamp).toLocaleString()}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportPDF(run)} aria-label="Export run as PDF">
                              <FileDown className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportJSON(run)} aria-label="Export run as JSON">
                              <FileJson className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <span className="text-destructive font-semibold">{run.counts.critical} critical</span>
                          <span className="text-warning font-semibold">{run.counts.warning} warn</span>
                          <span className="text-muted-foreground">{run.counts.info} info</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};