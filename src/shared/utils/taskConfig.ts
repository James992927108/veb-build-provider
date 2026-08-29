// src/shared/utils/taskConfig.ts
// Reads the VEB project name out of a .vscode/tasks.json payload for a given
// task label. Pure logic (no I/O) so it can be unit-tested headless.
// Shared by the build-time tracking (buildCommands) and the status bar so the
// Windows/Linux extraction rules cannot drift apart.

import { logDebug, logWarn, logError } from './logger';

/**
 * Extract the VEB project file name from a tasks.json string for the given task
 * label. Supports Windows (`SET VEB=`), Linux env (`options.env.VEB`) and Linux
 * command (`export VEB=`) formats.
 * Returns 'Unknown.veb' when the task or a VEB value cannot be determined.
 */
export function extractVebNameFromJson(tasksJson: string, taskLabel: string): string {
  let vebName = 'Unknown.veb';
  try {
    const tasksData = JSON.parse(tasksJson);
    const task = tasksData.tasks?.find((t: any) => t.label === taskLabel);
    logDebug(`Found task: ${task ? 'yes' : 'no'}, task: ${taskLabel}`);

    if (task) {
      let currentProject: string | undefined;

      if (task.command && task.command.includes('SET VEB=')) {
        // Windows: extract VEB from the shell command
        const vebMatch = task.command.match(/SET VEB=(\w+)/);
        currentProject = vebMatch ? vebMatch[1] : undefined;
        logDebug(`Windows VEB format detected: ${currentProject}`);
      } else if (task.options && task.options.env && task.options.env.VEB) {
        // Linux: get VEB from the environment variable
        currentProject = task.options.env.VEB;
        logDebug(`Linux VEB format detected from env: ${currentProject}`);
      } else if (task.command && task.command.includes('export VEB=')) {
        // Linux: extract VEB from the shell command
        const vebMatch = task.command.match(/export VEB=(\w+)/);
        currentProject = vebMatch ? vebMatch[1] : undefined;
        logDebug(`Linux VEB format detected from command: ${currentProject}`);
      }

      if (currentProject) {
        vebName = `${currentProject}.veb`;
        logDebug(`VEB name extracted: ${vebName}`);
      } else {
        logDebug(`Task command: ${task.command}`);
        logDebug(`Task options: ${JSON.stringify(task.options)}`);
        logWarn(`Unable to extract VEB name from task configuration`);
      }
    } else {
      logWarn(`Task ${taskLabel} not found in tasks.json`);
    }
  } catch (error) {
    logError(`Failed to parse VEB name from tasks.json: ${error}`);
  }
  return vebName;
}
