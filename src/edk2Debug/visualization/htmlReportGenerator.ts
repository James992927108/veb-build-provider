// src/edk2Debug/visualization/htmlReportGenerator.ts
import * as fs from 'fs';
import * as path from 'path';
import { AnalysisResult} from '../types';

export class HTMLReportGenerator {
    private templatePath: string;

    constructor() {
        this.templatePath = path.join(__dirname, '..', '..', 'templates');
    }

    async generateDebugReport(analysisResult: AnalysisResult, outputPath: string): Promise<void> {
        const template = await this.loadTemplate('debug_report.html');
        
        const reportData = {
            title: 'EDK2 Enhanced Debug 分析報告',
            generatedAt: new Date().toLocaleString('zh-TW'),
            summary: analysisResult.summary,
            callChains: JSON.stringify(analysisResult.callChains),
            performance: analysisResult.performance,
            errors: analysisResult.errors,
            timeline: JSON.stringify(analysisResult.timeline)
        };

        const htmlContent = this.renderTemplate(template, reportData);
        await fs.promises.writeFile(outputPath, htmlContent, 'utf-8');
    }

    private async loadTemplate(templateName: string): Promise<string> {
        const templatePath = path.join(this.templatePath, templateName);
        return await fs.promises.readFile(templatePath, 'utf-8');
    }

    private renderTemplate(template: string, data: any): string {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || match;
        });
    }
}
