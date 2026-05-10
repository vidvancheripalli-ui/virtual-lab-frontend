import { motion } from "framer-motion";
import { Circle } from "lucide-react";

const lines: { num: number; tokens: { t: string; c?: string }[] }[] = [
  { num: 1, tokens: [{ t: "// Live collaborative session", c: "text-editor-comment" }] },
  { num: 2, tokens: [
    { t: "function", c: "text-editor-keyword" },
    { t: " " },
    { t: "mergeSort", c: "text-editor-fn" },
    { t: "(arr) {" },
  ]},
  { num: 3, tokens: [
    { t: "  if", c: "text-editor-keyword" },
    { t: " (arr." },
    { t: "length", c: "text-editor-fn" },
    { t: " <= " },
    { t: "1", c: "text-editor-num" },
    { t: ") " },
    { t: "return", c: "text-editor-keyword" },
    { t: " arr;" },
  ]},
  { num: 4, tokens: [
    { t: "  const", c: "text-editor-keyword" },
    { t: " mid = " },
    { t: "Math", c: "text-editor-fn" },
    { t: "." },
    { t: "floor", c: "text-editor-fn" },
    { t: "(arr.length / " },
    { t: "2", c: "text-editor-num" },
    { t: ");" },
  ]},
  { num: 5, tokens: [
    { t: "  const", c: "text-editor-keyword" },
    { t: " left = " },
    { t: "mergeSort", c: "text-editor-fn" },
    { t: "(arr." },
    { t: "slice", c: "text-editor-fn" },
    { t: "(" },
    { t: "0", c: "text-editor-num" },
    { t: ", mid));" },
  ]},
  { num: 6, tokens: [
    { t: "  const", c: "text-editor-keyword" },
    { t: " right = " },
    { t: "mergeSort", c: "text-editor-fn" },
    { t: "(arr." },
    { t: "slice", c: "text-editor-fn" },
    { t: "(mid));" },
  ]},
  { num: 7, tokens: [
    { t: "  return", c: "text-editor-keyword" },
    { t: " " },
    { t: "merge", c: "text-editor-fn" },
    { t: "(left, right);" },
  ]},
  { num: 8, tokens: [{ t: "}" }] },
];

export const CodePreview = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-elevated bg-editor-bg">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/80 border-b border-border">
        <div className="flex items-center gap-2">
          <Circle className="h-3 w-3 fill-destructive text-destructive" />
          <Circle className="h-3 w-3 fill-warning text-warning" />
          <Circle className="h-3 w-3 fill-success text-success" />
        </div>
        <div className="text-xs font-mono text-muted-foreground">mergeSort.js — Virtual Coding Lab</div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            12 live
          </span>
        </div>
      </div>

      {/* Code body */}
      <div className="font-mono text-sm grid grid-cols-[auto_1fr]">
        <div className="bg-editor-line/50 px-3 py-4 text-right text-editor-comment select-none">
          {lines.map((l) => <div key={l.num}>{l.num}</div>)}
        </div>
        <div className="px-4 py-4 overflow-x-auto">
          {lines.map((l, idx) => (
            <motion.div
              key={l.num}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.4 }}
              className="whitespace-pre"
            >
              {l.tokens.map((tok, i) => (
                <span key={i} className={tok.c ?? "text-foreground/90"}>{tok.t}</span>
              ))}
              {idx === lines.length - 1 && <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse align-middle" />}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card/80 border-t border-border text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span className="text-primary">● JavaScript</span>
          <span>UTF-8</span>
          <span>Ln 8, Col 1</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-accent">↳ mentor: Aarav</span>
          <span>queue: 3</span>
        </div>
      </div>
    </div>
  );
};
