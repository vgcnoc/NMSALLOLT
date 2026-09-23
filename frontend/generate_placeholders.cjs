const fs = require('fs');
const path = require('path');

const files = {
  "src/components/common/EmptyState.tsx": `import React from 'react';\nimport { FolderSearch } from 'lucide-react';\nexport default function EmptyState({ title = 'No Data', description = 'There is nothing here yet.' }) {\n  return (\n    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border rounded-lg shadow-sm h-64">\n      <FolderSearch className="h-12 w-12 text-muted-foreground mb-4" />\n      <h3 className="text-lg font-semibold">{title}</h3>\n      <p className="text-sm text-muted-foreground mt-2">{description}</p>\n    </div>\n  );\n}`,
  
  "src/components/common/PageHeader.tsx": `import React from 'react';\nexport default function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {\n  return (\n    <div className="flex items-center justify-between mb-6">\n      <div>\n        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>\n        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}\n      </div>\n      {children && <div className="flex items-center gap-2">{children}</div>}\n    </div>\n  );\n}`,

  "src/pages/olts/OltsPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function OltsPage() {\n  return <div className="p-6"><PageHeader title="OLTs" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/olts/OltDetailPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function OltDetailPage() {\n  return <div className="p-6"><PageHeader title="OLT Detail" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/onus/OnusPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function OnusPage() {\n  return <div className="p-6"><PageHeader title="ONUs" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/mikrotik/MikrotikPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function MikrotikPage() {\n  return <div className="p-6"><PageHeader title="MikroTik" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/alarms/AlarmsPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function AlarmsPage() {\n  return <div className="p-6"><PageHeader title="Alarms" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/map/NetworkMapPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function NetworkMapPage() {\n  return <div className="p-6"><PageHeader title="Network Map" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/network/PopsPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function PopsPage() {\n  return <div className="p-6"><PageHeader title="POPs" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/genieacs/GenieDevicesPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function GenieDevicesPage() {\n  return <div className="p-6"><PageHeader title="GenieACS" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/system/RolesPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function RolesPage() {\n  return <div className="p-6"><PageHeader title="Roles" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/system/AuditLogsPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function AuditLogsPage() {\n  return <div className="p-6"><PageHeader title="Audit Logs" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  "src/pages/system/SettingsPage.tsx": `import PageHeader from '@/components/common/PageHeader';\nimport EmptyState from '@/components/common/EmptyState';\nexport default function SettingsPage() {\n  return <div className="p-6"><PageHeader title="Settings" /><EmptyState title="Coming in Phase X" /></div>;\n}`,
  
  "src/api/client.ts": `import axios from 'axios';\nimport { API_BASE_URL } from '@/lib/constants';\nexport const apiClient = axios.create({ baseURL: API_BASE_URL });`,
  "src/api/devices.api.ts": `import { apiClient } from './client';\nexport const getDevices = () => apiClient.get('/devices');`,
  "src/api/dashboard.api.ts": `import { apiClient } from './client';\nexport const getOverview = () => apiClient.get('/dashboard');`,
  "src/api/auth.api.ts": `import { apiClient } from './client';\nexport const login = () => apiClient.post('/auth/login');`
};

for (const [p, content] of Object.entries(files)) {
  const fullPath = path.join('c:/Users/v/Documents/XAMPP/htdocs/NMSALLOLT/frontend', p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Generated placeholder pages and extra components');
