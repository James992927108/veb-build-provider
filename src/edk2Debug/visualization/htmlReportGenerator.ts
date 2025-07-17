// src/edk2Debug/visualization/htmlReportGenerator.ts

import * as fs from 'fs';
import * as path from 'path';
import { AnalysisResult, TimelineEvent } from '../types';

export class HTMLReportGenerator {
    private templatePath: string;

    constructor() {
        this.templatePath = path.join(__dirname, '..', '..', 'templates');
    }

    /**
     * Generate interactive timeline HTML report
     */
    async generateDebugReport(analysisResult: AnalysisResult, outputPath: string): Promise<void> {
        const htmlContent = this.generateInteractiveTimelineReport(analysisResult);
        await fs.promises.writeFile(outputPath, htmlContent, 'utf-8');
    }

    /**
     * Construct complete HTML string
     */
    private generateInteractiveTimelineReport(analysisResult: AnalysisResult): string {
        const timelineData = this.prepareTimelineData(analysisResult);
        const groupsData = this.prepareGroupsData(analysisResult);
        const tooltipHtml = this.generateEventTooltipTemplate();

        return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EDK2 Debug Timeline Analysis</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/vis-timeline/7.7.4/vis-timeline-graph2d.min.css" rel="stylesheet">
  <style>
    /* ...(omitted, keeping original styles)... */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EDK2 Enhanced Debug Timeline Analysis</h1>
      <div class="meta">
        Generated: ${new Date().toLocaleString('zh-TW')} |
        Total Functions: ${analysisResult.performance.totalFunctions} |
        Errors: ${analysisResult.errors.length}
      </div>
    </div>
    <div class="controls">
      <!-- controls markup -->
    </div>
    <div id="timeline" class="timeline-container"></div>
    <div class="stats">
      <!-- stats cards -->
    </div>
    <div class="legend">
      <!-- legend items -->
    </div>
  </div>
  <div id="tooltip" class="tooltip" style="display:none;"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vis-timeline/7.7.4/vis-timeline-graph2d.min.js"></script>
  <script>
    const items = new vis.DataSet(${JSON.stringify(timelineData)});
    const groups = new vis.DataSet(${JSON.stringify(groupsData)});
    const options = { /* ...options as before...*/ };

    const container = document.getElementById('timeline');
    const timeline = new vis.Timeline(container, items, groups, options);

    timeline.on('select', ({ items: sel }) => {
      if (sel.length) showTooltip(items.get(sel[0]));
    });
    timeline.on('click', ({ item }) => {
      if (item) showItemDetails(items.get(item));
    });

    // Control buttons
    document.getElementById('zoomIn').addEventListener('click', () => timeline.zoomIn(0.2));
    document.getElementById('zoomOut').addEventListener('click', () => timeline.zoomOut(0.2));
    document.getElementById('fit').addEventListener('click', () => timeline.fit());
    document.getElementById('toggleErrors').addEventListener('click', e => toggleItemsByClass('error', e.target));
    document.getElementById('toggleWarnings').addEventListener('click', e => toggleItemsByClass('warning', e.target));
    document.getElementById('zoomSlider').addEventListener('input', e => {
      const level = parseFloat(e.target.value);
      const wnd = timeline.getWindow();
      const center = (wnd.start.getTime() + wnd.end.getTime()) / 2;
      const span = (wnd.end.getTime() - wnd.start.getTime()) / level;
      timeline.setWindow(center - span/2, center + span/2);
    });

    // Tooltip functions
    function showTooltip(item) {
      const tt = document.getElementById('tooltip');
      tt.innerHTML = \`${tooltipHtml}\`
        .replace(/\${content}/g, item.content)
        .replace(/\${start}/g, new Date(item.start).toLocaleString())
        .replace(/\${end}/g, item.end ? new Date(item.end).toLocaleString() : 'N/A')
        .replace(/\${module}/g, item.group)
        .replace(/\${status}/g, item.className)
        .replace(/\${duration}/g, item.duration + 'ms');
      tt.style.display = 'block';
    }

    function showItemDetails(item) {
      alert(\`
Function: \${item.content}
Module: \${item.group}
Start: \${new Date(item.start).toLocaleString()}
End: \${item.end ? new Date(item.end).toLocaleString() : 'N/A'}
Status: \${item.className}
Duration: \${item.duration}ms
\`);
    }

    function toggleItemsByClass(cls, btn) {
      const all = items.get();
      const updated = all.map(i => {
        if (i.className === cls) {
          i.hidden = !btn.classList.toggle('active');
        }
        return i;
      });
      items.update(updated);
    }

    document.addEventListener('mousemove', e => {
      const tt = document.getElementById('tooltip');
      if (tt.style.display !== 'none') {
        tt.style.left = e.pageX + 10 + 'px';
        tt.style.top = e.pageY + 10 + 'px';
      }
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#timeline')) {
        document.getElementById('tooltip').style.display = 'none';
      }
    });

    timeline.fit();
  </script>
</body>
</html>`;
    }

    /**
     * Convert AnalysisResult.timeline to vis.js DataSet
     */
    private prepareTimelineData(analysisResult: AnalysisResult): Array<any> {
        const items: any[] = [];
        let id = 0;
        for (const ev of analysisResult.timeline) {
            const startTs = parseInt(ev.timestamp, 10) / 1000;
            let endTs: number | null = null;
            if (ev.type === 'entry') {
                const ex = this.findMatchingExit(analysisResult.timeline, ev);
                if (ex) { endTs = parseInt(ex.timestamp, 10) / 1000; }
            }
            items.push({
                id: id++,
                content: ev.function,
                start: new Date(startTs),
                end: endTs ? new Date(endTs) : undefined,
                group: ev.module || 'Unknown',
                className: this.getEventClassification(ev),
                duration: ev.duration || (endTs ? (endTs - startTs) : 0)
            });
        }
        return items;
    }

    /**
     * Create module group list
     */
    private prepareGroupsData(analysisResult: AnalysisResult): Array<any> {
        const modules = Array.from(new Set(analysisResult.timeline.map(ev => ev.module || 'Unknown')));
        return modules.map((mod, idx) => ({ id: mod, content: mod, order: idx }));
    }

    /**
     * Find matching exit event for specified entry event in a series of events
     */
    private findMatchingExit(timeline: TimelineEvent[], entry: TimelineEvent): TimelineEvent | undefined {
        return timeline.find(ev =>
            ev.type === 'exit' &&
            ev.function === entry.function &&
            ev.depth === entry.depth
        );
    }

    /**
     * Determine CSS class for the item based on event type and status
     */
    private getEventClassification(ev: TimelineEvent): string {
        if (ev.type === 'exit' && ev.status !== 'Success') { return 'error'; }
        if (ev.type === 'entry' && typeof ev.duration === 'number' && ev.duration > 1000) { return 'warning'; }
        if (ev.type === 'exit' && ev.status === 'Success') { return 'success'; }
        return 'normal';
    }

    /**
     * Generate Tooltip template
     */
    private generateEventTooltipTemplate(): string {
        return `
<div>
  <strong>\${content}</strong><br>
  Start: \${start}<br>
  End: \${end}<br>
  Module: \${module}<br>
  Status: \${status}<br>
  Duration: \${duration}
</div>`;
    }

    /**
     * Calculate total execution time
     */
    private calculateTotalDuration(timeline: TimelineEvent[]): number {
        const ts = timeline
            .map(ev => parseInt(ev.timestamp, 10))
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b);
        return ts.length > 1 ? ts[ts.length - 1] - ts[0] : 0;
    }
}
