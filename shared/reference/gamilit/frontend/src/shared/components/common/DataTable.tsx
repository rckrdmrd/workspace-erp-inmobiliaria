import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  searchPlaceholder?: string;
  searchable?: boolean;
  itemsPerPage?: number;
}

export function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  sortColumn,
  sortDirection,
  onSort,
  className = '',
  striped = true,
  hoverable = true,
}: DataTableProps<T>): React.ReactElement {
  const handleSort = (columnKey: string): void => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  const renderCell = (row: T, column: Column<T>): React.ReactNode => {
    if (column.render) {
      return column.render(row);
    }
    return String(row[column.key as keyof T] ?? '');
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  alignmentClasses[column.align || 'left']
                } ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && sortColumn === column.key && (
                    <span className="inline-flex">
                      {sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                ${hoverable ? 'hover:bg-gray-100' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
                transition-colors
              `}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${
                    alignmentClasses[column.align || 'left']
                  }`}
                >
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.displayName = 'DataTable';
