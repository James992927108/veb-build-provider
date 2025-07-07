import argparse
import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum


class EventType(Enum):
    LIB_INIT = "lib_init"
    CALL_PUSH = "call_push"
    CALL_POP = "call_pop"
    ENTRY = "entry"
    EXIT = "exit"


class Phase(Enum):
    PEI = "PEI"
    DXE = "DXE"
    UNKNOWN = "UNKNOWN"


@dataclass
class LogEvent:
    timestamp: int
    event_type: EventType
    phase: Phase
    function: str = ""
    module: str = ""
    file_path: str = ""
    line: int = 0
    depth: int = 0
    duration: Optional[int] = None
    status: str = ""
    tpl: int = 0
    raw_data: Dict[str, Any] = None


class CallStack:
    def __init__(self):
        self.stack: List[LogEvent] = []
        self.call_pairs: List[Tuple[LogEvent, LogEvent]] = []

    def push(self, event: LogEvent):
        self.stack.append(event)

    def pop(self, exit_event: LogEvent) -> Optional[LogEvent]:
        if not self.stack:
            return None

        # 找到匹配的函數
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i].function == exit_event.function:
                entry_event = self.stack.pop(i)
                self.call_pairs.append((entry_event, exit_event))
                return entry_event
        return None


class EnhancedLogAnalyzer:
    def __init__(self):
        # 正則表達式模式
        self.patterns = {
            "lib_init": re.compile(
                r"\[(PEI|DXE)_ENHANCED_DEBUG\]\s+Library Initialized"
            ),
            "entry": re.compile(r"\[ENTRY\]\s+(.+?):(\d+)\s+(\w+)\(\)\s+Time=(\d+)"),
            "exit": re.compile(
                r"\[EXIT\]\s+(.+?):(\d+)\s+(\w+)\(\)\s+Status=(\w+)\s+Time=(\d+)"
            ),
            "call_push": re.compile(
                r"\[CALL_PUSH\]\s+(\w+):(\d+)\s+TPL=\w+\s+Depth=(\d+)\s+Time=(\d+)"
            ),
            "call_pop": re.compile(
                r"\[CALL_POP\]\s+(\w+)\s+Duration=(\d+)\s+Depth=(\d+)\s+TPL=\w+"
            ),
        }

        self.events: List[LogEvent] = []
        self.call_stack = CallStack()
        self.timeline: List[LogEvent] = []
        self.current_phase = Phase.UNKNOWN

    def parse_line(self, line: str) -> Optional[LogEvent]:
        line = line.strip()

        # 解析 JSON 事件
        if line.startswith("{") and line.endswith("}"):
            return self._parse_json_event(line)

        # 解析各種標記行
        for event_type, pattern in self.patterns.items():
            match = pattern.match(line)
            if match:
                return self._parse_pattern_event(event_type, match, line)

        return None

    def _parse_json_event(self, line: str) -> Optional[LogEvent]:
        try:
            data = json.loads(line)
            event_type = EventType(data.get("event", "unknown"))

            if event_type == EventType.LIB_INIT:
                # 從模組名稱推斷階段
                module = data.get("module", "")
                if "Pei" in module:
                    self.current_phase = Phase.PEI
                elif "Dxe" in module:
                    self.current_phase = Phase.DXE

                return LogEvent(
                    timestamp=data.get("timestamp", 0),
                    event_type=event_type,
                    phase=self.current_phase,
                    module=module,
                    raw_data=data,
                )

            elif event_type in [EventType.CALL_PUSH, EventType.CALL_POP]:
                return LogEvent(
                    timestamp=data.get("timestamp", 0),
                    event_type=event_type,
                    phase=self.current_phase,
                    function=data.get("function", ""),
                    line=data.get("line", 0),
                    depth=data.get("depth", 0),
                    duration=data.get("duration"),
                    tpl=data.get("tpl", 0),
                    raw_data=data,
                )
        except (json.JSONDecodeError, ValueError):
            pass

        return None

    def _parse_pattern_event(
        self, event_type: str, match, line: str
    ) -> Optional[LogEvent]:
        if event_type == "lib_init":
            phase_str = match.group(1)
            self.current_phase = Phase.PEI if phase_str == "PEI" else Phase.DXE

            return LogEvent(
                timestamp=0,  # Library init 通常沒有時間戳
                event_type=EventType.LIB_INIT,
                phase=self.current_phase,
                raw_data={"original_line": line},
            )

        elif event_type == "entry":
            file_path, line_num, function, timestamp = match.groups()
            return LogEvent(
                timestamp=int(timestamp),
                event_type=EventType.ENTRY,
                phase=self.current_phase,
                function=function,
                file_path=file_path,
                line=int(line_num),
                raw_data={"original_line": line},
            )

        elif event_type == "exit":
            file_path, line_num, function, status, timestamp = match.groups()
            return LogEvent(
                timestamp=int(timestamp),
                event_type=EventType.EXIT,
                phase=self.current_phase,
                function=function,
                file_path=file_path,
                line=int(line_num),
                status=status,
                raw_data={"original_line": line},
            )

        elif event_type == "call_push":
            function, line_num, depth, timestamp = match.groups()
            return LogEvent(
                timestamp=int(timestamp),
                event_type=EventType.CALL_PUSH,
                phase=self.current_phase,
                function=function,
                line=int(line_num),
                depth=int(depth),
                raw_data={"original_line": line},
            )

        elif event_type == "call_pop":
            function, duration, depth = match.groups()
            return LogEvent(
                timestamp=0,  # CALL_POP 通常沒有時間戳
                event_type=EventType.CALL_POP,
                phase=self.current_phase,
                function=function,
                depth=int(depth),
                duration=int(duration),
                raw_data={"original_line": line},
            )

        return None

    def analyze_log_file(self, input_path: str) -> Dict[str, Any]:
        with open(input_path, encoding="utf-8", errors="replace") as f:
            for line_num, line in enumerate(f, 1):
                event = self.parse_line(line)
                if event:
                    self.events.append(event)
                    self.timeline.append(event)

                    # 處理呼叫堆疊
                    if event.event_type == EventType.CALL_PUSH:
                        self.call_stack.push(event)
                    elif event.event_type == EventType.CALL_POP:
                        self.call_stack.pop(event)

        return self._generate_analysis_result()

    def _generate_analysis_result(self) -> Dict[str, Any]:
        # 統計資訊
        stats = {
            "total_events": len(self.events),
            "pei_events": len([e for e in self.events if e.phase == Phase.PEI]),
            "dxe_events": len([e for e in self.events if e.phase == Phase.DXE]),
            "call_pairs": len(self.call_stack.call_pairs),
            "event_types": {},
        }

        for event_type in EventType:
            count = len([e for e in self.events if e.event_type == event_type])
            stats["event_types"][event_type.value] = count

        # 時間軸（按時間戳排序）
        timeline = sorted(
            [e for e in self.timeline if e.timestamp > 0], key=lambda x: x.timestamp
        )

        # 轉換為可序列化的格式
        timeline_data = []
        for event in timeline:
            timeline_data.append(
                {
                    "timestamp": event.timestamp,
                    "event_type": event.event_type.value,
                    "phase": event.phase.value,
                    "function": event.function,
                    "module": event.module,
                    "duration": event.duration,
                    "depth": event.depth,
                    "status": event.status,
                }
            )

        # 呼叫鏈分析
        call_chains = []
        for entry_event, exit_event in self.call_stack.call_pairs:
            duration = (
                exit_event.timestamp - entry_event.timestamp
                if exit_event.timestamp > 0
                else None
            )
            call_chains.append(
                {
                    "function": entry_event.function,
                    "phase": entry_event.phase.value,
                    "entry_time": entry_event.timestamp,
                    "exit_time": exit_event.timestamp,
                    "duration": duration,
                    "status": exit_event.status,
                    "depth": entry_event.depth,
                }
            )

        # 效能分析
        performance = self._analyze_performance()

        return {
            "summary": stats,
            "timeline": timeline_data,
            "call_chains": call_chains,
            "performance": performance,
            "phases": {
                "pei_start": min(
                    [
                        e.timestamp
                        for e in self.events
                        if e.phase == Phase.PEI and e.timestamp > 0
                    ],
                    default=0,
                ),
                "dxe_start": min(
                    [
                        e.timestamp
                        for e in self.events
                        if e.phase == Phase.DXE and e.timestamp > 0
                    ],
                    default=0,
                ),
            },
        }

    def _analyze_performance(self) -> Dict[str, Any]:
        function_metrics = {}

        for entry_event, exit_event in self.call_stack.call_pairs:
            if exit_event.timestamp > 0 and entry_event.timestamp > 0:
                duration = exit_event.timestamp - entry_event.timestamp
                func_key = f"{entry_event.phase.value}.{entry_event.function}"

                if func_key not in function_metrics:
                    function_metrics[func_key] = {
                        "call_count": 0,
                        "total_duration": 0,
                        "min_duration": float("inf"),
                        "max_duration": 0,
                        "avg_duration": 0,
                    }

                metrics = function_metrics[func_key]
                metrics["call_count"] += 1
                metrics["total_duration"] += duration
                metrics["min_duration"] = min(metrics["min_duration"], duration)
                metrics["max_duration"] = max(metrics["max_duration"], duration)
                metrics["avg_duration"] = (
                    metrics["total_duration"] / metrics["call_count"]
                )

        return {
            "function_metrics": function_metrics,
            "total_functions": len(function_metrics),
            "total_call_pairs": len(self.call_stack.call_pairs),
        }


def parse_args():
    parser = argparse.ArgumentParser(description="Enhanced Debug Log Analyzer")
    parser.add_argument("--input", required=True, help="Path to input log file")
    parser.add_argument("--output", required=True, help="Path to output JSON file")
    parser.add_argument(
        "--format",
        default="json",
        help="Output format (currently only json is supported)",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    analyzer = EnhancedLogAnalyzer()
    result = analyzer.analyze_log_file(args.input)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
