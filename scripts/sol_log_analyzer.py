#!/usr/bin/env python3
# scripts/sol_log_analyzer.py

import re
import json
import argparse

class SOLLogAnalyzer:
    def __init__(self, input_path: str, output_path: str):
        self.input_path = input_path
        self.output_path = output_path
        self.timeline_events = []
        self.errors = []
        self.performance = {
            "totalFunctions": 0,
            "bootTime": None
        }

    def run(self):
        # 1. 讀檔並解析
        with open(self.input_path, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                line = line.strip()
                self.parse_entry_exit(line)
                self.parse_json_event(line)
                self.parse_call_stack(line)

        # 2. 統一格式
        unified = self.convert_to_unified_format()

        # 3. 計算 summary
        summary = {
            "total_events": len(unified),
            "error_count": len(self.errors)
        }

        # 4. 計算 performance
        self.performance["totalFunctions"] = sum(1 for e in unified if e["type"] == "entry")
        if unified:
            ts_list = [int(e["timestamp"]) for e in unified if e["timestamp"].isdigit()]
            if ts_list:
                self.performance["bootTime"] = max(ts_list) - min(ts_list)

        # 5. 輸出 JSON
        result = {
            "summary": summary,
            "timeline": unified,
            "errors": self.errors,
            "performance": self.performance
        }
        with open(self.output_path, 'w', encoding='utf-8') as out:
            json.dump(result, out, indent=2, ensure_ascii=False)

    def parse_entry_exit(self, line: str):
        m_ent = re.match(r'\[ENTRY\].*?([\w_]+)\(\).*?Time=(\d+)', line)
        if m_ent:
            self.timeline_events.append({
                "timestamp": m_ent.group(2),
                "function": m_ent.group(1),
                "type": "entry",
                "duration": 0,
                "status": None,
                "depth": None,
                "file_path": None
            })
            return
        m_exit = re.match(r'\[EXIT\].*?([\w_]+)\(\).*?Status=(\w+).*?Time=(\d+)', line)
        if m_exit:
            self.timeline_events.append({
                "timestamp": m_exit.group(3),
                "function": m_exit.group(1),
                "type": "exit",
                "duration": 0,
                "status": m_exit.group(2),
                "depth": None,
                "file_path": None
            })

    def parse_json_event(self, line: str):
        if line.startswith('{') and '"event"' in line:
            try:
                evt = json.loads(line)
                ts = str(evt.get("timestamp", "0"))
                item = {
                    "timestamp": ts,
                    "function": evt.get("function", ""),
                    "type": evt.get("event") if evt.get("event") in ("call_push","call_pop","stack_overflow") else "event",
                    "duration": evt.get("duration", 0),
                    "status": None,
                    "depth": evt.get("depth"),
                    "file_path": None
                }
                if evt.get("event") == "stack_overflow":
                    self.errors.append(evt)
                self.timeline_events.append(item)
            except json.JSONDecodeError:
                pass

    def parse_call_stack(self, line: str):
        m_push = re.match(r'\[CALL_PUSH\].*?([\w_]+):(\d+).*?Depth=(\d+).*?Time=(\d+)', line)
        if m_push:
            self.timeline_events.append({
                "timestamp": m_push.group(4),
                "function": m_push.group(1),
                "type": "entry",
                "duration": 0,
                "status": None,
                "depth": int(m_push.group(3)),
                "file_path": None
            })
            return
        m_pop = re.match(r'\[CALL_POP\].*?([\w_]+).*?Duration=(\d+).*?Depth=(\d+)', line)
        if m_pop:
            self.timeline_events.append({
                "timestamp": None,
                "function": m_pop.group(1),
                "type": "exit",
                "duration": int(m_pop.group(2)),
                "status": None,
                "depth": int(m_pop.group(3)),
                "file_path": None
            })

    def extract_module_from_path(self, file_path: str) -> str:
        if not file_path:
            return "Unknown"
        parts = file_path.replace("\\", "/").split("/")
        if len(parts) >= 2:
            return parts[-3]
        return "Unknown"

    def convert_to_unified_format(self):
        unified = []
        for ev in self.timeline_events:
            unified.append({
                "timestamp": ev["timestamp"] or "0",
                "function": ev["function"],
                "module": self.extract_module_from_path(ev.get("file_path")),
                "type": ev["type"],
                "duration": ev.get("duration", 0),
                "status": ev.get("status", "unknown"),
                "depth": ev.get("depth", 0)
            })
        return unified

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SOL Log Analyzer")
    parser.add_argument("--input", "-i", required=True, help="SOL log input file")
    parser.add_argument("--output", "-o", required=True, help="analysis_result.json output path")
    args = parser.parse_args()

    analyzer = SOLLogAnalyzer(args.input, args.output)
    analyzer.run()
