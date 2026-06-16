import SectionHeader from '@/components/common/SectionHeader';
import KPISection from '@/components/dashboard/KPISection';
import TrendCharts from '@/components/dashboard/TrendCharts';
import AlarmPanel from '@/components/dashboard/AlarmPanel';
import KilnVisualizer from '@/components/kiln/KilnVisualizer';
import { LayoutDashboard, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <SectionHeader
        title="生产数据总览"
        subtitle="实时监控全生产线运行状态"
        icon={<LayoutDashboard className="w-5 h-5" />}
        actions={['refresh', 'export']}
      />

      <KPISection />

      <TrendCharts />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-50 to-gold-50 border border-kiln-100 flex items-center justify-center text-kiln-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="section-title">窑炉运行监控</h2>
                <p className="text-sm text-industrial-500 mt-0.5">K1#辊道窑温区实时状态与烧成曲线</p>
              </div>
            </div>
          </div>
          <KilnVisualizer />
        </div>
        <div>
          <AlarmPanel />
        </div>
      </div>
    </div>
  );
}
