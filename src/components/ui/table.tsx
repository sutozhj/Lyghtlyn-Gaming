import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  )
}

export const TableHeader: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <thead className={`[&_tr]:border-b border-gray-700 ${className}`}>
      {children}
    </thead>
  )
}

export const TableBody: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
      {children}
    </tbody>
  )
}

export const TableRow: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <tr className={`border-b border-gray-700 transition-colors hover:bg-primary-700/30 data-[state=selected]:bg-primary-700 ${className}`}>
      {children}
    </tr>
  )
}

export const TableHead: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-300 [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </th>
  )
}

export const TableCell: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </td>
  )
}

