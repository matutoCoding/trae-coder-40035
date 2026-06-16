import { useMemo, useState } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import { ballMillingRecords, formulas } from '@/utils/mockData';
import type { BallMillingRecord } from '@/types';
import { FlaskConical, Beaker, Scale, Clock, Eye, Edit2, Play, Search, Filter, Download } from 'lucide-react';

export default function BallMilling() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusConfig = {
    running: { label: '运行中', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    completed: { label: '已完成', className: 'bg-industrial-50 text-industrial-600 border-industrial-200' },
    paused: { label: '已暂停', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  const filteredRecords = useMemo(() => {
    return ballMillingRecords.filter((record) => {
      const matchSearch =
        searchText === '' ||
        record.batchNo.toLowerCase().includes(searchText.toLowerCase()) ||
        record.ballMillId.toLowerCase().includes(searchText.toLowerCase()) ||
        record.operator.toLowerCase().includes(searchText.toLowerCase()) ||
        record.formulaName.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'all' || record.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchText, statusFilter]);

  const handleExport = () => {
    const headers = ['批次号', '球磨机', '配方', '转速(rpm)', '球石比', '时长(h)', '细度(%)', '比重', '状态', '操作员'];
    const rows = filteredRecords.map((record) => [
      record.batchNo,
      record.ballMillId,
      record.formulaName,
      record.speed.toFixed(1),
      `${record.ballRatio.toFixed(2)}:1`,
      record.duration.toFixed(1),
      record.fineness.toFixed(2),
      record.slurryDensity.toFixed(3),
      statusConfig[record.status].label,
      record.operator,
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `球磨记录_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: 'batchNo',
      title: '批次号',
      render: (row: BallMillingRecord) => (
        <span className="font-mono text-xs text-kiln-600 font-semibold">{row.batchNo}</span>
      ),
    },
    {
      key: 'ballMillId',
      title: '球磨机',
      render: (row: BallMillingRecord) => (
        <span className="badge bg-industrial-100 text-industrial-700">{row.ballMillId}</span>
      ),
    },
    {
      key: 'formulaName',
      title: '配方',
      render: (row: BallMillingRecord) => (
        <span className="max-w-[200px] truncate" title={row.formulaName}>
          {row.formulaName}
        </span>
      ),
    },
    {
      key: 'speed',
      title: '转速(rpm)',
      render: (row: BallMillingRecord) => <span className="font-mono">{row.speed.toFixed(1)}</span>,
    },
    {
      key: 'ballRatio',
      title: '球石比',
      render: (row: BallMillingRecord) => (
        <span className="font-mono">{row.ballRatio.toFixed(2)}:1</span>
      ),
    },
    {
      key: 'duration',
      title: '时长(h)',
      render: (row: BallMillingRecord) => <span className="font-mono">{row.duration.toFixed(1)}</span>,
    },
    {
      key: 'fineness',
      title: '细度(%)',
      render: (row: BallMillingRecord) => (
        <span className={`font-mono font-semibold ${row.fineness > 1.8 ? 'text-kiln-600' : 'text-emerald-600'}`}>
          {row.fineness.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'slurryDensity',
      title: '泥浆比重',
      render: (row: BallMillingRecord) => (
        <span className="font-mono">{row.slurryDensity.toFixed(3)}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (row: BallMillingRecord) => {
        const status = statusConfig[row.status];
        return <span className={`badge border ${status.className}`}>{status.label}</span>;
      },
    },
  ];

  return (
    <div className="p-6">
      <SectionHeader
        title="原料球磨 · 泥浆配料"
        subtitle="球磨配方管理与泥浆细度监控"
        icon={<FlaskConical className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="球磨机运行中"
          value="3/4"
          unit="台"
          icon={<Beaker className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="今日处理量"
          value="128.5"
          unit="吨"
          icon={<Scale className="w-6 h-6" />}
          change={6.8}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="平均细度"
          value="1.2"
          unit="%"
          icon={<FlaskConical className="w-6 h-6" />}
          change={-0.3}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="平均球磨时间"
          value="12.4"
          unit="h"
          icon={<Clock className="w-6 h-6" />}
          change={-2.1}
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">配方管理</h3>
            <p className="text-xs text-industrial-500 mt-0.5">当前在产配方共 {formulas.length} 套</p>
          </div>
          <button className="btn-secondary !py-2 text-sm">管理配方</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {formulas.map((formula) => (
            <div
              key={formula.id}
              className="rounded-xl border border-industrial-200 bg-industrial-50/50 p-4 hover:border-kiln-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="badge bg-kiln-50 text-kiln-700 border border-kiln-200">
                    {formula.id}
                  </span>
                  <h4 className="font-display text-base font-semibold text-industrial-900 mt-2">
                    {formula.name}
                  </h4>
                </div>
                <span className="text-xs text-industrial-500">使用 {formula.usageCount} 次</span>
              </div>
              <p className="text-xs text-industrial-500 mb-3">{formula.description}</p>
              <div className="space-y-2 mb-4">
                {formula.recipe.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-industrial-600">{item.material}</span>
                      <span className="font-semibold text-industrial-800">{item.ratio}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-industrial-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-kiln-500 to-gold-500 transition-all duration-500"
                        style={{ width: `${item.ratio}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  详情
                </button>
                <button className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" />
                  编辑
                </button>
                <button className="btn-primary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1">
                  <Play className="w-3.5 h-3.5" />
                  启用
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">球磨记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">
              最近 {ballMillingRecords.length} 条球磨批次记录
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-industrial-400" />
              <input
                type="text"
                placeholder="搜索批次号、球磨机、操作员、配方..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input-field !w-72 !py-2 !pl-8 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-industrial-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field !w-36 !py-2 !pl-8 text-sm appearance-none pr-8"
              >
                <option value="all">全部状态</option>
                <option value="running">运行中</option>
                <option value="completed">已完成</option>
                <option value="paused">已暂停</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className="btn-primary !py-2 text-sm inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        <DataTable<BallMillingRecord>
          columns={columns}
          data={filteredRecords}
          rowKey="id"
        />

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>
            显示 {filteredRecords.length} / 共 {ballMillingRecords.length} 条记录
          </span>
          <div className="flex items-center gap-1">
            <button className="btn-secondary !py-1.5 !px-3 text-xs">上一页</button>
            <span className="px-3 py-1.5 text-kiln-600 font-semibold">1</span>
            <button className="btn-secondary !py-1.5 !px-3 text-xs">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
