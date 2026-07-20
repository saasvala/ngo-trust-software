import { useState } from "react";
import { Accessibility, X, AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const severityIcon = (s: Severity) =>
  s === "critical" ? <AlertCircle className="w-4 h-4 text-destructive" /> :
  s === "warning" ? <AlertTriangle className="w-4 h-4 text-warning" /> :
  <Info className="w-4 h-4 text-muted-foreground" />;

export const AccessibilityAudit = () => {
  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [highlight, setHighlight] = useState<Severity | "all">("all");

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setIssues(runAudit());
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
                <p className="text-xs text-muted-foreground mt-0.5">Scans the current page for WCAG issues.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close audit panel">
                <X className="w-4 h-4" />
              </Button>
            </div>

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
          </div>
        </div>
      )}
    </>
  );
};