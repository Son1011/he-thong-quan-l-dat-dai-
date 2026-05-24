import { Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Unit } from "../api/types";
import { normalizeViText } from "../utils/normalize";

type StatRow = {
  unit_id: number;
  name: string;
  total_dossiers: number;
  pending: number;
  approved: number;
  returned: number;
  total_attachments: number;
};

type Metric = "pending" | "approved" | "returned" | "total_dossiers" | "total_attachments";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function colorScale(v: number, min: number, max: number) {
  // Light -> darker blue. Keep readable on light background.
  if (!Number.isFinite(v)) return "#e5e7eb";
  if (max <= min) return "#93c5fd";
  const t = clamp01((v - min) / (max - min));
  const r = Math.round(lerp(219, 30, t));
  const g = Math.round(lerp(234, 64, t));
  const b = Math.round(lerp(254, 175, t));
  return `rgb(${r},${g},${b})`;
}

export default function VietnamInteractiveMap({
  provinces,
  rows,
  selectedProvinceId,
  metric,
  onSelectProvinceId,
  title = "Bản đồ Việt Nam (tương tác)",
}: {
  provinces: Unit[];
  rows: StatRow[];
  selectedProvinceId: number | "";
  metric: Metric;
  onSelectProvinceId: (provinceId: number) => void;
  title?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgHostRef = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [hover, setHover] = useState<null | { name: string; value: number; hasData: boolean; x: number; y: number }>(
    null,
  );

  const rowsByNormName = useMemo(() => {
    const m = new Map<string, StatRow>();
    for (const r of rows) m.set(normalizeViText(r.name), r);
    return m;
  }, [rows]);

  const provinceIdByNormName = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of provinces) m.set(normalizeViText(p.name), p.id);
    return m;
  }, [provinces]);

  const range = useMemo(() => {
    const vals = rows.map((r) => Number((r as any)[metric] ?? 0)).filter((n) => Number.isFinite(n));
    if (!vals.length) return { min: 0, max: 0 };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [rows, metric]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/maps/vn-provinces.svg");
        const text = await res.text();
        if (!cancelled) setSvg(text);
      } catch {
        if (!cancelled) setSvg(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = svgHostRef.current;
    if (!el) return;
    const svgEl = el.querySelector("svg");
    if (!svgEl) return;

    // The vendored SVG contains multiple circle layers:
    // - g#points: circles with class="lat|lon" (not province names) and often without radius
    // - g#label_points: circles with class="<Province name>" (what we want for interaction)
    // Prefer label_points; fallback to any circle[class] that looks like a name.
    const labelCircles = Array.from(svgEl.querySelectorAll<SVGCircleElement>("#label_points circle[class]"));
    const circles =
      labelCircles.length > 0
        ? labelCircles
        : Array.from(svgEl.querySelectorAll<SVGCircleElement>("circle[class]")).filter((c) => {
            const cls = c.getAttribute("class") ?? "";
            // ignore coordinate-like classes: "9.30|102.49"
            return cls && !cls.includes("|");
          });
    const listeners: Array<() => void> = [];

    for (const c of circles) {
      const rawName = c.getAttribute("class") ?? "";
      const norm = normalizeViText(rawName);
      const pid = provinceIdByNormName.get(norm);
      const row = rowsByNormName.get(norm);

      // If this circle can't be mapped to a province id in our dataset (e.g. SVG has 63 provinces
      // but the system currently uses 34 provinces), hide it to avoid "unclickable dots".
      if (!pid) {
        c.style.display = "none";
        continue;
      }

      const value = row ? Number((row as any)[metric] ?? 0) : 0;
      const fill = row ? colorScale(value, range.min, range.max) : "#e5e7eb";

      // Many SVGs store circles without radius; ensure visible marker.
      if (!c.getAttribute("r")) c.setAttribute("r", "7");
      // NOTE: circles in the SVG often have inline `style="fill:#999999"` which overrides the `fill` attribute.
      // So we must write via element.style to actually change color.
      c.style.fill = fill;
      c.style.stroke = "#111827";
      c.style.strokeWidth = "1";
      c.style.cursor = "pointer";

      // Highlight selected
      if (selectedProvinceId && pid === selectedProvinceId) {
        c.style.strokeWidth = "2";
        c.setAttribute("r", "9");
      }

      // Tooltip (native)
      c.setAttribute("data-tooltip", rawName);
      c.setAttribute(
        "title",
        `${rawName}${row ? ` — ${metric}: ${value}` : ""}${pid ? "" : " (không map được ID)"}`
      );

      const onClick = () => onSelectProvinceId(pid);
      c.addEventListener("click", onClick);
      listeners.push(() => c.removeEventListener("click", onClick));
    }

    return () => listeners.forEach((fn) => fn());
  }, [metric, onSelectProvinceId, provinceIdByNormName, range.max, range.min, rowsByNormName, selectedProvinceId, svg]);

  return (
    <Box>
      <Typography fontWeight={900} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Hover để xem số liệu, click để chọn tỉnh.
      </Typography>
      {!svg ? (
        <Typography variant="body2" color="text.secondary">
          Không tải được bản đồ SVG.
        </Typography>
      ) : (
        <Box
          ref={wrapperRef}
          sx={{
            width: "100%",
            maxWidth: 720,
            mx: "auto",
            position: "relative",
          }}
          onMouseMove={(e) => {
            const t = e.target as any;
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (!t || typeof t.getAttribute !== "function") {
              setHover(null);
              return;
            }
            if ((t as Element).tagName?.toLowerCase() !== "circle") {
              setHover(null);
              return;
            }
            const rawName = t.getAttribute("class") ?? "";
            if (!rawName) {
              setHover(null);
              return;
            }
            const norm = normalizeViText(rawName);
            const row = rowsByNormName.get(norm);
            const value = row ? Number((row as any)[metric] ?? 0) : 0;
            const x = rect ? e.clientX - rect.left : 0;
            const y = rect ? e.clientY - rect.top : 0;
            setHover({ name: rawName, value, hasData: Boolean(row), x, y });
          }}
          onMouseLeave={() => setHover(null)}
        >
          <Box
            ref={svgHostRef}
            sx={{
              "& svg": { width: "100%", height: "auto", display: "block" },
            }}
            // SVG is CC0 and is treated as static data. We only add click listeners & styling.
            dangerouslySetInnerHTML={{ __html: svg }}
          />

          {hover ? (
            <Box
              sx={{
                position: "absolute",
                left: hover.x,
                top: hover.y,
                transform: "translate(12px, 12px)",
                bgcolor: "rgba(17,24,39,0.92)",
                color: "#fff",
                px: 1,
                py: 0.75,
                borderRadius: 1,
                fontSize: 12,
                lineHeight: 1.25,
                pointerEvents: "none",
                maxWidth: 260,
                zIndex: 2,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ fontWeight: 700 }}>{hover.name}</div>
              <div>
                {metric}: <b>{hover.value}</b>
                {!hover.hasData ? " (chưa có dữ liệu)" : ""}
              </div>
            </Box>
          ) : null}
        </Box>
      )}
      <Typography variant="caption" color="text.secondary">
        Tip: click vào dấu tròn trên tỉnh để drill xuống thống kê xã/phường.
      </Typography>
    </Box>
  );
}


