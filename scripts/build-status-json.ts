import fs from "fs";
import path from "path";

interface Task {
  title: string;
  description?: string;
  percent?: number;
  status: "pending" | "in-progress" | "done";
  tags?: string[];
  startDate?: string;
  endDate?: string;
  [key: string]: unknown; // 允许其他额外字段
}

interface TaskFile {
  tasks?: Task[];
  [key: string]: unknown;
}

/**
 * 构建合并后的 status.json 文件
 */
export default function buildStatusJson(): void {
  const dataDir = path.join(process.cwd(), "src/data");
  const outputFile = path.join(process.cwd(), "src/data/computed/status.json");

  const allTasks: Task[] = fs
    .readdirSync(dataDir)
    .filter((file) => /^status.*\.json$/.test(file))
    .flatMap((file) => {
      const rawData = fs.readFileSync(path.join(dataDir, file), "utf8");
      const data: TaskFile | Task[] = JSON.parse(rawData);
      return Array.isArray(data) ? data : data.tasks || [];
    });

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(allTasks, null, 2));

  console.log(`✅ 合并了 ${allTasks.length} 条任务到 ${outputFile}`);
}