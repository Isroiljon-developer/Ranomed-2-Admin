import { useState } from 'react';
import { FileText, User, Clock, Filter } from 'lucide-react';
import SearchInput from '../components/filters/SearchInput.jsx';
import SelectFilter from '../components/filters/SelectFilter.jsx';

import api from '../api';
import { useEffect } from 'react';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/system/logs');
        setLogs(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const modules = [...new Set(logs.map(log => log.modul || log.module))];

  const filteredLogs = logs.filter(log => {
    const logUser = log.User?.name || log.user || 'Tizim';
    const logAction = log.harakat || log.action || '';
    const matchesSearch = logUser.toLowerCase().includes(search.toLowerCase()) ||
      logAction.toLowerCase().includes(search.toLowerCase());
    const logModul = log.modul || log.module || '';
    const matchesModule = !moduleFilter || logModul === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground">Tizimdagi barcha harakatlar tarixi</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Qidirish..."
          />
        </div>
        <SelectFilter
          value={moduleFilter}
          onChange={setModuleFilter}
          options={modules.map(m => ({ value: m, label: m }))}
          placeholder="Barcha modullar"
        />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Foydalanuvchi</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Harakat</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Modul</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Vaqt</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{log.User?.name || log.user || 'Tizim'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{log.harakat || log.action}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                      {log.modul || log.module}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(log.createdAt || log.time).toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
