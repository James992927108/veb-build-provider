// src/edk2Debug/visualization/htmlReportGenerator.ts

import * as fs from 'fs';
import * as path from 'path';
import { AnalysisResult } from '../types';

export class HTMLReportGenerator {
    private templatePath: string;

    constructor() {
        this.templatePath = path.join(__dirname, '..', '..', 'templates');
    }

    async generateDebugReport(analysisResult: AnalysisResult, outputPath: string): Promise<void> {
        // 生成互動式時間軸 HTML 報告
        const htmlContent = this.generateInteractiveTimelineReport(analysisResult);
        await fs.promises.writeFile(outputPath, htmlContent, 'utf-8');
    }

    private generateInteractiveTimelineReport(analysisResult: AnalysisResult): string {
        const timelineData = this.prepareTimelineData(analysisResult);
        const groupsData = this.prepareGroupsData(analysisResult);
        
        return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDK2 Debug Timeline Analysis</title>
    
    <!-- vis.js Timeline CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/vis-timeline/7.7.4/vis-timeline-graph2d.min.css" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        
        .header .meta {
            margin-top: 10px;
            opacity: 0.9;
        }
        
        .controls {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .controls button {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .controls button:hover {
            background: #f0f0f0;
        }
        
        .controls button.active {
            background: #3498db;
            color: white;
            border-color: #3498db;
        }
        
        .timeline-container {
            height: 600px;
            margin: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .stats {
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            background: #f8f9fa;
        }
        
        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #3498db;
        }
        
        .stat-card h3 {
            margin: 0 0 8px 0;
            color: #2c3e50;
            font-size: 14px;
            text-transform: uppercase;
        }
        
        .stat-card .value {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
        }
        
        /* Timeline自訂樣式 */
        .vis-timeline {
            border: none;
        }
        
        .vis-item {
            border-color: #3498db;
            background-color: rgba(52, 152, 219, 0.8);
            border-radius: 3px;
        }
        
        .vis-item.error {
            background-color: rgba(231, 76, 60, 0.8);
            border-color: #e74c3c;
        }
        
        .vis-item.warning {
            background-color: rgba(241, 196, 15, 0.8);
            border-color: #f1c40f;
        }
        
        .vis-item.success {
            background-color: rgba(46, 204, 113, 0.8);
            border-color: #2ecc71;
        }
        
        .vis-item.selected {
            background-color: rgba(155, 89, 182, 0.9);
            border-color: #9b59b6;
        }
        
        .vis-group-label {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .vis-time-axis {
            font-size: 12px;
        }
        
        .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            max-width: 300px;
        }
        
        .legend {
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
        }
        
        .legend h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        
        .legend-items {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EDK2 Enhanced Debug Timeline Analysis</h1>
            <div class="meta">
                <span>Generated: ${new Date().toLocaleString('zh-TW')}</span> | 
                <span>Total Functions: ${analysisResult.performance.totalFunctions}</span> | 
                <span>Errors: ${analysisResult.errors.length}</span>
            </div>
        </div>
        
        <div class="controls">
            <button id="zoomIn">放大</button>
            <button id="zoomOut">縮小</button>
            <button id="fit">適合視窗</button>
            <button id="toggleErrors" class="active">顯示錯誤</button>
            <button id="toggleWarnings" class="active">顯示警告</button>
            <label>
                <input type="range" id="zoomSlider" min="0.1" max="10" step="0.1" value="1">
                縮放
            </label>
        </div>
        
        <div id="timeline" class="timeline-container"></div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>總函數調用</h3>
                <div class="value">${analysisResult.performance.totalFunctions}</div>
            </div>
            <div class="stat-card">
                <h3>錯誤數量</h3>
                <div class="value">${analysisResult.errors.length}</div>
            </div>
            <div class="stat-card">
                <h3>啟動時間</h3>
                <div class="value">${analysisResult.performance.bootTime || 'N/A'}ms</div>
            </div>
            <div class="stat-card">
                <h3>總執行時間</h3>
                <div class="value">${this.calculateTotalDuration(analysisResult.timeline)}ms</div>
            </div>
        </div>
        
        <div class="legend">
            <h3>圖例</h3>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: rgba(52, 152, 219, 0.8);"></div>
                    <span>正常執行</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: rgba(46, 204, 113, 0.8);"></div>
                    <span>成功完成</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: rgba(241, 196, 15, 0.8);"></div>
                    <span>警告</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: rgba(231, 76, 60, 0.8);"></div>
                    <span>錯誤</span>
                </div>
            </div>
        </div>
    </div>
    
    <div id="tooltip" class="tooltip" style="display: none;"></div>
    
    <!-- vis.js Timeline JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vis-timeline/7.7.4/vis-timeline-graph2d.min.js"></script>
    
    <script>
        // Timeline 資料準備
        const timelineData = ${JSON.stringify(timelineData)};
        const groupsData = ${JSON.stringify(groupsData)};
        
        // 建立 DataSet
        const items = new vis.DataSet(timelineData);
        const groups = new vis.DataSet(groupsData);
        
        // Timeline 選項配置
        const options = {
            width: '100%',
            height: '100%',
            type: 'range',
            stack: true,
            showCurrentTime: false,
            editable: false,
            selectable: true,
            multiselect: true,
            zoomable: true,
            moveable: true,
            orientation: 'top',
            format: {
                minorLabels: {
                    millisecond: 'SSS',
                    second: 'HH:mm:ss',
                    minute: 'HH:mm',
                    hour: 'HH:mm',
                    weekday: 'ddd D',
                    day: 'D',
                    month: 'MMM',
                    year: 'YYYY'
                },
                majorLabels: {
                    millisecond: 'HH:mm:ss',
                    second: 'HH:mm:ss',
                    minute: 'HH:mm - ddd D',
                    hour: 'ddd D MMMM',
                    weekday: 'MMMM YYYY',
                    day: 'MMMM YYYY',
                    month: 'YYYY',
                    year: ''
                }
            },
            tooltip: {
                followMouse: true,
                overflowMethod: 'cap'
            },
            groupOrder: 'id'
        };
        
        // 建立 Timeline
        const container = document.getElementById('timeline');
        const timeline = new vis.Timeline(container, items, groups, options);
        
        // 事件監聽器
        timeline.on('select', function(event) {
            const selectedItems = timeline.getSelection();
            if (selectedItems.length > 0) {
                const itemId = selectedItems[0];
                const item = items.get(itemId);
                showTooltip(item);
            }
        });
        
        timeline.on('click', function(event) {
            if (event.item) {
                const item = items.get(event.item);
                showItemDetails(item);
            }
        });
        
        // 控制按鈕功能
        document.getElementById('zoomIn').addEventListener('click', () => {
            timeline.zoomIn(0.2);
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            timeline.zoomOut(0.2);
        });
        
        document.getElementById('fit').addEventListener('click', () => {
            timeline.fit();
        });
        
        document.getElementById('toggleErrors').addEventListener('click', (e) => {
            toggleItemsByClass('error', e.target);
        });
        
        document.getElementById('toggleWarnings').addEventListener('click', (e) => {
            toggleItemsByClass('warning', e.target);
        });
        
        document.getElementById('zoomSlider').addEventListener('input', (e) => {
            const zoomLevel = parseFloat(e.target.value);
            timeline.setWindow(
                timeline.getWindow().start,
                timeline.getWindow().end,
                { animation: false }
            );
        });
        
        // 工具提示功能
        function showTooltip(item) {
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = \`
                <strong>\${item.content}</strong><br>
                開始: \${new Date(item.start).toLocaleString()}<br>
                \${item.end ? '結束: ' + new Date(item.end).toLocaleString() + '<br>' : ''}
                模組: \${item.group}<br>
                狀態: \${item.className || 'normal'}<br>
                持續時間: \${item.end ? ((new Date(item.end) - new Date(item.start)) + 'ms') : 'N/A'}
            \`;
            tooltip.style.display = 'block';
        }
        
        function showItemDetails(item) {
            alert(\`
函數: \${item.content}
模組: \${item.group}
開始時間: \${new Date(item.start).toLocaleString()}
\${item.end ? '結束時間: ' + new Date(item.end).toLocaleString() : ''}
狀態: \${item.className || 'normal'}
持續時間: \${item.end ? ((new Date(item.end) - new Date(item.start)) + 'ms') : 'N/A'}
            \`);
        }
        
        function toggleItemsByClass(className, button) {
            const currentItems = items.get();
            const filteredItems = currentItems.filter(item => item.className === className);
            
            if (button.classList.contains('active')) {
                // 隱藏該類別項目
                filteredItems.forEach(item => {
                    item.style = 'display: none;';
                });
                button.classList.remove('active');
            } else {
                // 顯示該類別項目
                filteredItems.forEach(item => {
                    delete item.style;
                });
                button.classList.add('active');
            }
            
            items.update(filteredItems);
        }
        
        // 初始化時間軸
        timeline.fit();
        
        // 滑鼠移動事件 - 隱藏工具提示
        document.addEventListener('mousemove', (e) => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip.style.display !== 'none') {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY + 10 + 'px';
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#timeline')) {
                document.getElementById('tooltip').style.display = 'none';
            }
        });
        
        console.log('EDK2 Timeline Analysis loaded successfully');
    </script>
</body>
</html>`;
    }

    private prepareTimelineData(analysisResult: AnalysisResult): any[] {
        const timelineItems: any[] = [];
        let itemId = 0;

        // 處理時間軸資料
        analysisResult.timeline.forEach((event, index) => {
            const startTime = new Date(parseInt(event.timestamp));
            let endTime = null;

            // 尋找對應的結束事件
            if (event.type === 'entry') {
                const exitEvent = analysisResult.timeline.find((e, i) => 
                    i > index && 
                    e.function === event.function && 
                    e.module === event.module && 
                    e.type === 'exit'
                );
                if (exitEvent) {
                    endTime = new Date(parseInt(exitEvent.timestamp));
                }
            }

            // 確定狀態類別
            let className = 'normal';
            const hasError = analysisResult.errors.some(error => 
                error.function === event.function && error.module === event.module
            );
            if (hasError) {
                className = 'error';
            } else if (event.duration && event.duration > 1000) {
                className = 'warning'; // 超過1秒的執行時間標記為警告
            } else if (event.type === 'exit') {
                className = 'success';
            }

            const item = {
                id: itemId++,
                content: event.function,
                start: startTime,
                end: endTime,
                group: event.module,
                className: className,
                title: `${event.function} - ${event.module}${endTime ? ' (持續時間: ' + (endTime.getTime() - startTime.getTime()) + 'ms)' : ''}`
            };

            timelineItems.push(item);
        });

        return timelineItems;
    }

    private prepareGroupsData(analysisResult: AnalysisResult): any[] {
        const moduleSet = new Set<string>();
        
        // 收集所有模組名稱
        analysisResult.timeline.forEach(event => {
            if (event.module) {
                moduleSet.add(event.module);
            }
        });

        // 轉換為群組資料
        const groups = Array.from(moduleSet).map((module, index) => ({
            id: module,
            content: module,
            order: index
        }));

        return groups;
    }

    private calculateTotalDuration(timeline: any[]): number {
        if (!timeline || timeline.length === 0) {return 0;}
        
        const timestamps = timeline.map(event => parseInt(event.timestamp)).filter(ts => !isNaN(ts));
        if (timestamps.length === 0) {return 0;}
        
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        
        return maxTime - minTime;
    }
}
