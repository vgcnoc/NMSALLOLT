import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DataTable({ data, columns }: any) {
  const resolvePath = (object: any, path: string) => {
    if (!path) return undefined;
    return path.split('.').reduce((o, p) => o ? o[p] : undefined, object);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns?.map((c: any, i: number) => (
            <TableHead key={i}>{c.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!data || data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns?.length || 1} className="text-center h-24">No results found.</TableCell>
          </TableRow>
        ) : (
          data?.map((row: any, i: number) => (
            <TableRow key={i}>
              {columns?.map((c: any, j: number) => (
                <TableCell key={j}>
                  {c.cell ? c.cell({ row: { original: row } }) : resolvePath(row, c.accessorKey)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;
