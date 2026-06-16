import type { ReactNode } from "react";
import { Database } from "lucide-react";

interface DataTableColumn<T = any> {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: string;
  emptyText?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  emptyText = "暂无数据",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-2xl bg-industrial-50 flex items-center justify-center mb-4">
          <Database className="w-10 h-10 text-industrial-300" />
        </div>
        <p className="text-sm text-industrial-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-th">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row[rowKey] ?? index}
              className={`
                border-b border-industrial-50 transition-colors duration-150
                ${index % 2 === 1 ? "bg-industrial-50/30" : "bg-white"}
                hover:bg-kiln-50/50
              `}
            >
              {columns.map((col) => (
                <td key={col.key} className="table-td">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
