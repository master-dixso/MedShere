import { useEffect, useState, useRef, useCallback } from 'react';
import {
  CoreWebVitalsMetrics,
  MetricRating,
  PerformanceMonitorOptions,
  MedSphereVitalsGlobal,
} from '../types';

// Web Vitals Thresholds (Google Specifications)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // ms
  CLS: { good: 0.1, needsImprovement: 0.25 },  // unitless score
  FCP: { good: 1800, needsImprovement: 3000 }, // ms
  FID: { good: 100, needsImprovement: 300 },   // ms
  INP: { good: 200, needsImprovement: 500 },   // ms
  TTFB: { good: 800, needsImprovement: 1800 }, // ms
};

export function rateMetric(name: keyof typeof THRESHOLDS, value: number | null): MetricRating {
  if (value === null || value === undefined) return 'measuring';
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'measuring';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function getRatingBadge(rating: MetricRating): { text: string; bg: string; color: string; icon: string } {
  switch (rating) {
    case 'good':
      return { text: 'Good (Fast)', bg: '#059669', color: '#ffffff', icon: '🟢' };
    case 'needs-improvement':
      return { text: 'Needs Improvement', bg: '#d97706', color: '#ffffff', icon: '🟡' };
    case 'poor':
      return { text: 'Poor (Slow)', bg: '#dc2626', color: '#ffffff', icon: '🔴' };
    default:
      return { text: 'Measuring...', bg: '#475569', color: '#ffffff', icon: '⏳' };
  }
}

// Format metric value for console display
export function formatMetricValue(name: string, value: number | null): string {
  if (value === null) return 'N/A';
  if (name === 'CLS') {
    return value.toFixed(4);
  }
  return `${Math.round(value)} ms`;
}

// Global subscribers set
const listeners = new Set<(metrics: CoreWebVitalsMetrics) => void>();

// Initial Metrics State
const initialMetrics: CoreWebVitalsMetrics = {
  lcp: null,
  cls: 0,
  fcp: null,
  fid: null,
  inp: null,
  ttfb: null,
  ratings: {
    lcp: 'measuring',
    cls: 'good',
    fcp: 'measuring',
    fid: 'measuring',
    inp: 'measuring',
    ttfb: 'measuring',
  },
  lastUpdated: Date.now(),
  shiftEntriesCount: 0,
};

// Singleton current metrics state for developer window access
let globalMetrics: CoreWebVitalsMetrics = { ...initialMetrics };

// Style formatting for DevTools console
function logMetricToConsole(name: string, value: number | null, rating: MetricRating, detail?: string) {
  const badge = getRatingBadge(rating);
  const formattedVal = formatMetricValue(name, value);
  
  const prefixStyle = 'background: #0f172a; color: #38bdf8; font-weight: 700; padding: 2px 6px; border-radius: 4px;';
  const nameStyle = 'background: #1e293b; color: #f8fafc; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 2px;';
  const badgeStyle = `background: ${badge.bg}; color: ${badge.color}; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 4px;`;
  const detailStyle = 'color: #94a3b8; font-style: italic; margin-left: 6px;';

  console.log(
    `%c[Alpha III MedSphere]%c ${name}: ${formattedVal} %c ${badge.icon} ${badge.text} %c${detail || ''}`,
    prefixStyle,
    nameStyle,
    badgeStyle,
    detailStyle
  );
}

// Print comprehensive performance report in console
function printConsoleReport() {
  const m = globalMetrics;
  console.group('%c🚀 Alpha III MedSphere — Core Web Vitals & Real-Time Performance Report', 'color: #0284c7; font-weight: bold; font-size: 13px;');
  
  const tableData = [
    {
      Metric: 'Largest Contentful Paint (LCP)',
      Value: formatMetricValue('LCP', m.lcp),
      Target: '≤ 2.5 s',
      Rating: getRatingBadge(m.ratings.lcp).text,
      Status: m.ratings.lcp === 'good' ? '✅ Pass' : m.ratings.lcp === 'needs-improvement' ? '⚠️ Needs Improvement' : '❌ Fail',
    },
    {
      Metric: 'Cumulative Layout Shift (CLS)',
      Value: formatMetricValue('CLS', m.cls),
      Target: '≤ 0.10',
      Rating: getRatingBadge(m.ratings.cls).text,
      Status: m.ratings.cls === 'good' ? '✅ Pass' : m.ratings.cls === 'needs-improvement' ? '⚠️ Needs Improvement' : '❌ Fail',
    },
    {
      Metric: 'First Contentful Paint (FCP)',
      Value: formatMetricValue('FCP', m.fcp),
      Target: '≤ 1.8 s',
      Rating: getRatingBadge(m.ratings.fcp).text,
      Status: m.ratings.fcp === 'good' ? '✅ Pass' : m.ratings.fcp === 'needs-improvement' ? '⚠️ Needs Improvement' : '❌ Fail',
    },
    {
      Metric: 'First Input Delay (FID)',
      Value: formatMetricValue('FID', m.fid),
      Target: '≤ 100 ms',
      Rating: getRatingBadge(m.ratings.fid).text,
      Status: m.ratings.fid === 'good' ? '✅ Pass' : '⏳ Ready',
    },
    {
      Metric: 'Time to First Byte (TTFB)',
      Value: formatMetricValue('TTFB', m.ttfb),
      Target: '≤ 800 ms',
      Rating: getRatingBadge(m.ratings.ttfb).text,
      Status: m.ratings.ttfb === 'good' ? '✅ Pass' : '⚠️ Needs Check',
    },
  ];

  console.table(tableData);
  console.log(
    '%c💡 Tip: Access window.__medSphereVitals.getMetrics() or window.__medSphereVitals.printReport() anytime in the DevTools console.',
    'color: #64748b; font-size: 11px;'
  );
  console.groupEnd();
}

/**
 * Lightweight React Hook for monitoring Core Web Vitals (LCP, CLS, FCP, TTFB, FID)
 * in real-time during development, QA testing, and live environments.
 */
export function usePerformanceMonitor(options: PerformanceMonitorOptions = {}) {
  const {
    enableConsoleLog = true,
    logOnMetricChange = true,
    onUpdate,
  } = options;

  const [metrics, setMetrics] = useState<CoreWebVitalsMetrics>(globalMetrics);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const isInitializedRef = useRef<boolean>(false);

  // Helper to update state and notify global listeners
  const updateMetrics = useCallback((updater: (prev: CoreWebVitalsMetrics) => CoreWebVitalsMetrics) => {
    const updated = updater(globalMetrics);
    globalMetrics = updated;
    setMetrics(updated);

    if (onUpdate) {
      onUpdate(updated);
    }

    listeners.forEach((listener) => {
      try {
        listener(updated);
      } catch (err) {
        console.error('Error in vitals listener:', err);
      }
    });
  }, [onUpdate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('PerformanceObserver' in window)) {
      setIsSupported(false);
      return;
    }

    // Attach global console developer utility
    const globalObject: MedSphereVitalsGlobal = {
      getMetrics: () => ({ ...globalMetrics }),
      getRatings: () => ({ ...globalMetrics.ratings }),
      printReport: () => printConsoleReport(),
      logSummary: () => printConsoleReport(),
      reset: () => {
        globalMetrics = { ...initialMetrics, lastUpdated: Date.now() };
        setMetrics({ ...globalMetrics });
        console.log('%c[Alpha III MedSphere] Vitals monitor reset.', 'color: #0284c7; font-weight: bold;');
      },
      onMetricChange: (cb) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
      version: '1.0.0-medsphere-perf',
    };

    window.__medSphereVitals = globalObject;

    // Log initialization announcement once
    if (!isInitializedRef.current && enableConsoleLog) {
      isInitializedRef.current = true;
      console.log(
        '%c🏥 [Alpha III MedSphere] Core Web Vitals Monitoring Active %c LCP & CLS Real-Time Logger initialized (accessible via window.__medSphereVitals) ',
        'background: #0284c7; color: #ffffff; font-weight: bold; padding: 3px 8px; border-radius: 4px;',
        'background: #0f172a; color: #38bdf8; padding: 3px 8px; border-radius: 4px;'
      );
    }

    // 1. Measure Navigation Timing (TTFB)
    try {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries && navEntries.length > 0) {
        const nav = navEntries[0];
        const ttfbVal = nav.responseStart > 0 ? nav.responseStart : nav.requestStart > 0 ? nav.responseStart - nav.requestStart : null;
        if (ttfbVal !== null && ttfbVal > 0) {
          const rating = rateMetric('TTFB', ttfbVal);
          updateMetrics((prev) => ({
            ...prev,
            ttfb: ttfbVal,
            ratings: { ...prev.ratings, ttfb: rating },
            lastUpdated: Date.now(),
          }));
          if (enableConsoleLog && logOnMetricChange) {
            logMetricToConsole('TTFB', ttfbVal, rating, `(Response start: ${Math.round(nav.responseStart)}ms)`);
          }
        }
      }
    } catch {
      // Ignored for safety
    }

    // 2. Measure First Contentful Paint (FCP)
    let fcpObserver: PerformanceObserver | null = null;
    try {
      fcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcpVal = entry.startTime;
            const rating = rateMetric('FCP', fcpVal);
            updateMetrics((prev) => ({
              ...prev,
              fcp: fcpVal,
              ratings: { ...prev.ratings, fcp: rating },
              lastUpdated: Date.now(),
            }));
            if (enableConsoleLog && logOnMetricChange) {
              logMetricToConsole('FCP', fcpVal, rating);
            }
            fcpObserver?.disconnect();
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch {
      // Observer type unsupported
    }

    // 3. Measure Largest Contentful Paint (LCP)
    let lcpObserver: PerformanceObserver | null = null;
    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          const lcpVal = lastEntry.startTime;
          const rating = rateMetric('LCP', lcpVal);
          
          updateMetrics((prev) => ({
            ...prev,
            lcp: lcpVal,
            ratings: { ...prev.ratings, lcp: rating },
            lastUpdated: Date.now(),
          }));

          if (enableConsoleLog && logOnMetricChange) {
            logMetricToConsole('LCP', lcpVal, rating, `(Candidate: ${lastEntry.name || 'DOM element'})`);
          }
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Observer type unsupported
    }

    // 4. Measure Cumulative Layout Shift (CLS) using Session Windows
    let clsObserver: PerformanceObserver | null = null;
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];
    let shiftCount = 0;

    try {
      clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // LayoutShift interface property
          const layoutShift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };

          // Only count layout shifts without recent user input (within 500ms)
          if (!layoutShift.hadRecentInput) {
            shiftCount += 1;
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            // If the entry occurred less than 1 second after the previous entry and
            // less than 5 seconds after the first entry in the session, include it.
            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += layoutShift.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = layoutShift.value;
              sessionEntries = [entry];
            }

            // If current session window is greater than largest CLS value, update
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              const rating = rateMetric('CLS', clsValue);

              updateMetrics((prev) => ({
                ...prev,
                cls: clsValue,
                shiftEntriesCount: shiftCount,
                ratings: { ...prev.ratings, cls: rating },
                lastUpdated: Date.now(),
              }));

              if (enableConsoleLog && logOnMetricChange) {
                logMetricToConsole('CLS', clsValue, rating, `(Shift event #${shiftCount})`);
              }
            }
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Observer type unsupported
    }

    // 5. Measure First Input Delay (FID)
    let fidObserver: PerformanceObserver | null = null;
    try {
      fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const firstInput = entry as PerformanceEntry & { processingStart: number };
          const fidVal = firstInput.processingStart - firstInput.startTime;
          const rating = rateMetric('FID', fidVal);

          updateMetrics((prev) => ({
            ...prev,
            fid: fidVal,
            ratings: { ...prev.ratings, fid: rating },
            lastUpdated: Date.now(),
          }));

          if (enableConsoleLog && logOnMetricChange) {
            logMetricToConsole('FID', fidVal, rating, `(Input event: ${firstInput.name})`);
          }
          fidObserver?.disconnect();
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch {
      // Observer type unsupported
    }

    // Cleanup observers on unmount
    return () => {
      fcpObserver?.disconnect();
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
      fidObserver?.disconnect();
    };
  }, [enableConsoleLog, logOnMetricChange, updateMetrics]);

  return {
    metrics,
    ratings: metrics.ratings,
    isSupported,
    printReport: printConsoleReport,
    getMetrics: () => ({ ...globalMetrics }),
  };
}
