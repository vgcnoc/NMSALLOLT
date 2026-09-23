import React from 'react';
import { FolderSearch } from 'lucide-react';
export default function EmptyState({ title = 'No Data', description = 'There is nothing here yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border rounded-lg shadow-sm h-64">
      <FolderSearch className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
}