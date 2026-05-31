import { useState, useMemo, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Wrench, Users, Package, Download, RefreshCw, Calendar, Filter,
  ChevronDown, ChevronUp, Trophy, Medal, Star, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Layers, AlertCircle, Eye,
} from 'lucide-react';
import { useFetchClient } from '../../../hook/useFetchClient';

// ─── COLORS ────────────────────────────────────────────────────────────────
const C = {
  navy: '#00285E', orange: '#F9A11B', green: '#10B981',
  red: '#EF4444', purple: '#8B5CF6', blue: '#3B82F6',
  cyan: '#06B6D4', rose: '#F43F5E',
};

// ─── HELPERS ───────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  v >= 1_000_000_000
    ? `${(v / 1_000_000_000).toFixed(2)} tỷ`
    : v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v.toLocaleString('vi-VN');

const fmtFull = (v: number) => v.toLocaleString('vi-VN') + ' ₫';

function initials(name: string) {
  return name.split(' ').slice(-2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

// ─── MOCK FINANCIAL DATA ───────────────────────────────────────────────────
const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

interface MonthData { label: string; revenue: number; expense: number; }
interface Transaction { id: number; date: string; description: string; category: string; type: 'revenue' | 'expense'; amount: number; icon: string; }

const RAW_MONTHLY: MonthData[] = [
  { label: 'T1', revenue: 285_000_000, expense: 198_000_000 },
  { label: 'T2', revenue: 312_000_000, expense: 210_500_000 },
  { label: 'T3', revenue: 395_000_000, expense: 245_000_000 },
  { label: 'T4', revenue: 428_000_000, expense: 278_000_000 },
  { label: 'T5', revenue: 501_000_000, expense: 310_000_000 },
  { label: 'T6', revenue: 467_000_000, expense: 295_000_000 },
  { label: 'T7', revenue: 543_000_000, expense: 325_000_000 },
  { label: 'T8', revenue: 498_000_000, expense: 305_000_000 },
  { label: 'T9', revenue: 576_000_000, expense: 340_000_000 },
  { label: 'T10', revenue: 612_000_000, expense: 362_000_000 },
  { label: 'T11', revenue: 589_000_000, expense: 348_000_000 },
  { label: 'T12', revenue: 678_000_000, expense: 398_000_000 },
];

const TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2026-05-30', description: 'Dịch vụ bảo dưỡng tổng hợp #1048', category: 'Dịch vụ sửa chữa', type: 'revenue', amount: 2_800_000, icon: '🔧' },
  { id: 2, date: '2026-05-30', description: 'Bán lốp xe Michelin Pilot Sport 4', category: 'Bán linh kiện', type: 'revenue', amount: 4_500_000, icon: '🛞' },
  { id: 3, date: '2026-05-29', description: 'Nhập dầu nhớt Castrol Edge 5W-40 × 24 lít', category: 'Nhập linh kiện', type: 'expense', amount: -1_440_000, icon: '🛢️' },
  { id: 4, date: '2026-05-29', description: 'Dịch vụ thay lọc gió & bugi #1047', category: 'Dịch vụ sửa chữa', type: 'revenue', amount: 1_200_000, icon: '🔧' },
  { id: 5, date: '2026-05-28', description: 'Lương tháng 5 – Nguyễn Văn Hùng (KTV)', category: 'Lương nhân viên', type: 'expense', amount: -12_000_000, icon: '👤' },
  { id: 6, date: '2026-05-28', description: 'Bán má phanh Brembo OEM × 2 bộ', category: 'Bán linh kiện', type: 'revenue', amount: 3_200_000, icon: '🛞' },
  { id: 7, date: '2026-05-27', description: 'Lương tháng 5 – Trần Thị Mai (Lễ tân)', category: 'Lương nhân viên', type: 'expense', amount: -10_000_000, icon: '👤' },
  { id: 8, date: '2026-05-27', description: 'Bảo trì máy cân bằng bánh xe', category: 'Bảo trì thiết bị', type: 'expense', amount: -3_500_000, icon: '⚙️' },
  { id: 9, date: '2026-05-26', description: 'Dịch vụ sửa hộp số tự động #1045', category: 'Dịch vụ sửa chữa', type: 'revenue', amount: 8_500_000, icon: '🔧' },
  { id: 10, date: '2026-05-26', description: 'Nhập phụ tùng piston Honda × 6 cái', category: 'Nhập linh kiện', type: 'expense', amount: -2_160_000, icon: '📦' },
  { id: 11, date: '2026-05-25', description: 'Bán dầu hộp số Mobil 1 × 8 lít', category: 'Bán linh kiện', type: 'revenue', amount: 1_600_000, icon: '🛢️' },
  { id: 12, date: '2026-05-25', description: 'Lương tháng 5 – Lê Văn Nam (KTV)', category: 'Lương nhân viên', type: 'expense', amount: -12_000_000, icon: '👤' },
  { id: 13, date: '2026-05-24', description: 'Dịch vụ thay dầu & kiểm tra tổng thể #1043', category: 'Dịch vụ sửa chữa', type: 'revenue', amount: 1_800_000, icon: '🔧' },
  { id: 14, date: '2026-05-24', description: 'Nhập lốp xe Michelin × 12 cái', category: 'Nhập linh kiện', type: 'expense', amount: -36_000_000, icon: '🛞' },
  { id: 15, date: '2026-05-23', description: 'Sửa chữa máy nâng cầu nâng #2', category: 'Bảo trì thiết bị', type: 'expense', amount: -8_000_000, icon: '⚙️' },
  { id: 16, date: '2026-05-22', description: 'Dịch vụ vệ sinh kim phun nhiên liệu #1041', category: 'Dịch vụ sửa chữa', type: 'revenue', amount: 3_500_000, icon: '🔧' },
  { id: 17, date: '2026-05-22', description: 'Bán bộ lọc nhớt Bosch × 4 cái', category: 'Bán linh kiện', type: 'revenue', amount: 800_000, icon: '📦' },
  { id: 18, date: '2026-05-21', description: 'Nhập bugi NGK Iridium × 48 cái', category: 'Nhập linh kiện', type: 'expense', amount: -2_880_000, icon: '📦' },
  { id: 19, date: '2026-05-20', description: 'Lương tháng 5 – Phạm Quốc Bảo (QL)', category: 'Lương nhân viên', type: 'expense', amount: -15_000_000, icon: '👤' },
  { id: 20, date: '2026-05-19', description: 'Dịch vụ đại tu động cơ #1038', category: 'Dịch vụ sửa chữa', type: 'revenue', amount: 22_000_000, icon: '🔧' },
];

const PRESETS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Quý này', value: 'quarter' },
  { label: 'Năm nay', value: 'year' },
  { label: 'Tùy chỉnh', value: 'custom' },
];

// ─── EMPLOYEE RANKING TYPES ────────────────────────────────────────────────
interface EmployeeRank {
  id: number; fullName: string; phoneNumber: string; avatar: string;
  role: string; roleCode: string; status: string; workDate: string;
  completedTasks: number; revenueContribution: number; rating: number;
  performanceScore: number;
}
type RankSortKey = 'performanceScore' | 'completedTasks' | 'revenueContribution' | 'rating';

function getRankMeta(rank: number) {
  if (rank === 1) return { badge: '🥇', color: '#F59E0B', bg: '#FEF3C7' };
  if (rank === 2) return { badge: '🥈', color: '#6B7280', bg: '#F3F4F6' };
  if (rank === 3) return { badge: '🥉', color: '#D97706', bg: '#FEF9C3' };
  return { badge: `${rank}`, color: C.navy, bg: '#EFF6FF' };
}
function scoreColor(s: number) {
  return s >= 70 ? C.green : s >= 40 ? C.orange : C.red;
}

// ─── MINI BAR CHART (no lib) ───────────────────────────────────────────────
function MiniBarChart({ data }: { data: MonthData[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.revenue, d.expense]));
  return (
    <div className="flex items-end gap-1 h-32 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="flex items-end gap-px w-full justify-center" style={{ height: 100 }}>
            <div
              className="rounded-t transition-all"
              style={{
                width: '42%', backgroundColor: C.navy,
                height: `${(d.revenue / maxVal) * 100}%`,
                opacity: 0.85,
              }}
              title={`Thu: ${fmtFull(d.revenue)}`}
            />
            <div
              className="rounded-t transition-all"
              style={{
                width: '42%', backgroundColor: C.orange,
                height: `${(d.expense / maxVal) * 100}%`,
                opacity: 0.85,
              }}
              title={`Chi: ${fmtFull(d.expense)}`}
            />
          </div>
          <span className="text-[8px] text-slate-400 font-semibold">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DONUT CHART (SVG) ────────────────────────────────────────────────────
function DonutChart({ slices }: { slices: { value: number; color: string; label: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  let cumAngle = 0;
  const r = 40, cx = 60, cy = 60, stroke = 16;

  const parts = slices.map((s) => {
    const angle = (s.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((start + angle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    return { ...s, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` };
  });

  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
      {parts.map((p, i) => (
        <path
          key={i} d={p.d} fill="none"
          stroke={p.color} strokeWidth={stroke}
          strokeLinecap="butt"
        />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2} fill="white" />
    </svg>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function AdminFinanceReport() {
  const ctx = useOutletContext<{ showToast: (m: string, t?: 'success' | 'info' | 'warning') => void }>();
  const showToast = ctx?.showToast ?? (() => {});
  const { fetchPrivate } = useFetchClient();

  const [activeTab, setActiveTab] = useState<'finance' | 'ranking'>('finance');

  // ── Date filter ──
  const [preset, setPreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ── Transaction filter ──
  const [txFilter, setTxFilter] = useState<'all' | 'revenue' | 'expense'>('all');
  const [txPage, setTxPage] = useState(1);
  const TX_PER_PAGE = 8;

  // ── Expand detail ──
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // ── Rankings ──
  const [rankings, setRankings] = useState<EmployeeRank[]>([]);
  const [rankLoading, setRankLoading] = useState(false);
  const [rankError, setRankError] = useState<string | null>(null);
  const [rankPreset, setRankPreset] = useState('all');
  const [rankStart, setRankStart] = useState('');
  const [rankEnd, setRankEnd] = useState('');
  const [rankSort, setRankSort] = useState<RankSortKey>('performanceScore');
  const [rankDir, setRankDir] = useState<'asc' | 'desc'>('desc');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRank | null>(null);

  // ── Filter monthly data by preset ──
  const filteredMonthly = useMemo(() => {
    if (preset === 'month') return RAW_MONTHLY.slice(4, 5);
    if (preset === 'quarter') return RAW_MONTHLY.slice(3, 6);
    return RAW_MONTHLY;
  }, [preset]);

  const totRevenue = useMemo(() => filteredMonthly.reduce((s, d) => s + d.revenue, 0), [filteredMonthly]);
  const totExpense = useMemo(() => filteredMonthly.reduce((s, d) => s + d.expense, 0), [filteredMonthly]);
  const netProfit = totRevenue - totExpense;
  const margin = totRevenue > 0 ? ((netProfit / totRevenue) * 100).toFixed(1) : '0.0';

  // Revenue breakdown %
  const serviceRevPct = 68; const partsRevPct = 32;
  const serviceRev = totRevenue * (serviceRevPct / 100);
  const partsRev = totRevenue * (partsRevPct / 100);

  // Expense breakdown %
  const payrollPct = 51; const partImportPct = 36; const toolPct = 13;
  const payrollExp = totExpense * (payrollPct / 100);
  const partImportExp = totExpense * (partImportPct / 100);
  const toolExp = totExpense * (toolPct / 100);

  // Filter transactions
  const filteredTx = useMemo(() => {
    return TRANSACTIONS.filter((t) => txFilter === 'all' || t.type === txFilter);
  }, [txFilter]);

  const totalTxPages = Math.ceil(filteredTx.length / TX_PER_PAGE);
  const pageTx = filteredTx.slice((txPage - 1) * TX_PER_PAGE, txPage * TX_PER_PAGE);

  const toggleCategory = (cat: string) =>
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  // ── Export CSV ──
  const handleExport = () => {
    const headers = ['Ngày', 'Mô tả', 'Danh mục', 'Loại', 'Số tiền (VND)'];
    const rows = TRANSACTIONS.map((t) => [
      t.date, t.description, t.category,
      t.type === 'revenue' ? 'Thu' : 'Chi',
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bao-cao-tai-chinh-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Xuất báo cáo tài chính thành công', 'success');
  };

  // ── Fetch rankings ──
  const fetchRankings = useCallback(async () => {
    setRankLoading(true);
    setRankError(null);
    try {
      const params = new URLSearchParams();
      if (rankStart) params.append('startDate', rankStart);
      if (rankEnd) params.append('endDate', rankEnd);
      const res = await fetchPrivate(`/api/admin/employee-ranking${params.toString() ? `?${params}` : ''}`);
      setRankings(res?.data ?? []);
    } catch (e: unknown) {
      setRankError(e instanceof Error ? e.message : 'Không thể tải dữ liệu xếp hạng');
    } finally {
      setRankLoading(false);
    }
  }, [fetchPrivate, rankStart, rankEnd]);

  useEffect(() => {
    if (activeTab === 'ranking') fetchRankings();
  }, [activeTab, fetchRankings]);

  const sortedRankings = [...rankings].sort((a, b) => {
    return rankDir === 'asc' ? a[rankSort] - b[rankSort] : b[rankSort] - a[rankSort];
  });

  const handleRankSort = (k: RankSortKey) => {
    if (rankSort === k) setRankDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setRankSort(k); setRankDir('desc'); }
  };

  const exportRankings = () => {
    if (!rankings.length) { showToast('Không có dữ liệu', 'warning'); return; }
    const headers = ['Hạng', 'Tên nhân viên', 'Điện thoại', 'Vai trò', 'Trạng thái', 'Nhiệm vụ HT', 'Doanh thu đóng góp', 'Đánh giá', 'Điểm HP'];
    const rows = sortedRankings.map((r, i) => [i + 1, r.fullName, r.phoneNumber, r.role, r.status, r.completedTasks, r.revenueContribution, r.rating, r.performanceScore]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `xep-hang-nhan-vien-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Xuất báo cáo xếp hạng nhân viên thành công', 'success');
  };

  // ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#00285E] flex items-center gap-2">
            <BarChart3 size={22} className="text-amber-500" />
            Báo cáo tài chính
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Tổng quan thu chi, lợi nhuận & xếp hạng nhân viên</p>
        </div>
        <button
          onClick={activeTab === 'finance' ? handleExport : exportRankings}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 shadow-sm transition-all"
          style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a8a)` }}
        >
          <Download size={13} /> Xuất báo cáo
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[
          { key: 'finance', label: 'Báo cáo tài chính', icon: <BarChart3 size={13} /> },
          { key: 'ranking', label: 'Xếp hạng nhân viên', icon: <Trophy size={13} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'finance' | 'ranking')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key ? 'bg-white text-[#00285E] shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB: TÀI CHÍNH
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'finance' && (
          <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

            {/* ── Date Filter ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">
                  <Filter size={12} /> Khoảng thời gian:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p) => (
                    <button key={p.value} onClick={() => setPreset(p.value)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${preset === p.value ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      style={preset === p.value ? { backgroundColor: C.navy } : {}}
                    >{p.label}</button>
                  ))}
                </div>
                {preset === 'custom' && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Calendar size={12} className="text-slate-400" />
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    <span className="text-slate-400 text-xs">→</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                      className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                )}
              </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Tổng thu', value: totRevenue, icon: <TrendingUp size={18} />, color: C.green, bg: '#D1FAE5', delta: '+12.4%', up: true },
                { label: 'Tổng chi', value: totExpense, icon: <TrendingDown size={18} />, color: C.red, bg: '#FEE2E2', delta: '+8.1%', up: false },
                { label: 'Lợi nhuận ròng', value: netProfit, icon: <DollarSign size={18} />, color: C.blue, bg: '#DBEAFE', delta: '+19.2%', up: true },
                { label: 'Biên lợi nhuận', value: parseFloat(margin), isPercent: true, icon: <BarChart3 size={18} />, color: C.purple, bg: '#EDE9FE', delta: '+2.1%', up: true },
              ].map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: card.bg, color: card.color }}>{card.icon}</div>
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {card.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{card.delta}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{card.label}</div>
                  <div className="text-lg md:text-xl font-black" style={{ color: card.color }}>
                    {card.isPercent ? `${card.value}%` : `${fmt(card.value)} ₫`}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 font-medium">
                    {card.isPercent ? '' : fmtFull(card.value)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Chart + Breakdown ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#00285E]">Biểu đồ Thu – Chi theo tháng</h3>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: C.navy }} />Thu</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: C.orange }} />Chi</span>
                  </div>
                </div>
                <MiniBarChart data={filteredMonthly} />
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                  {[
                    { label: 'Tháng cao nhất (Thu)', value: Math.max(...filteredMonthly.map((d) => d.revenue)) },
                    { label: 'Tháng thấp nhất (Chi)', value: Math.min(...filteredMonthly.map((d) => d.expense)) },
                    { label: 'TB lợi nhuận/tháng', value: netProfit / filteredMonthly.length },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs font-black text-[#00285E]">{fmt(s.value)} ₫</div>
                      <div className="text-[9px] text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut Breakdown */}
              <div className="space-y-4">
                {/* Revenue breakdown */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <h4 className="text-xs font-black text-[#00285E] mb-3">Cơ cấu Doanh thu</h4>
                  <div className="flex items-center gap-3">
                    <DonutChart slices={[
                      { value: serviceRevPct, color: C.navy, label: 'Dịch vụ' },
                      { value: partsRevPct, color: C.orange, label: 'Linh kiện' },
                    ]} />
                    <div className="space-y-2 flex-1 min-w-0">
                      {[
                        { icon: <Wrench size={11} />, label: 'Dịch vụ sửa chữa', pct: serviceRevPct, val: serviceRev, color: C.navy },
                        { icon: <Package size={11} />, label: 'Bán linh kiện', pct: partsRevPct, val: partsRev, color: C.orange },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-[10px] mb-0.5">
                            <span className="flex items-center gap-1 font-semibold text-slate-600"
                              style={{ color: item.color }}>{item.icon}{item.label}</span>
                            <span className="font-black" style={{ color: item.color }}>{item.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{fmt(item.val)} ₫</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expense breakdown */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <h4 className="text-xs font-black text-[#00285E] mb-3">Cơ cấu Chi phí</h4>
                  <div className="flex items-center gap-3">
                    <DonutChart slices={[
                      { value: payrollPct, color: C.purple, label: 'Lương' },
                      { value: partImportPct, color: C.cyan, label: 'Nhập hàng' },
                      { value: toolPct, color: C.rose, label: 'Thiết bị' },
                    ]} />
                    <div className="space-y-2 flex-1 min-w-0">
                      {[
                        { icon: <Users size={11} />, label: 'Lương NV', pct: payrollPct, val: payrollExp, color: C.purple },
                        { icon: <ShoppingCart size={11} />, label: 'Nhập linh kiện', pct: partImportPct, val: partImportExp, color: C.cyan },
                        { icon: <Wrench size={11} />, label: 'Bảo trì TB', pct: toolPct, val: toolExp, color: C.rose },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-[10px] mb-0.5">
                            <span className="flex items-center gap-1 font-semibold" style={{ color: item.color }}>{item.icon}{item.label}</span>
                            <span className="font-black" style={{ color: item.color }}>{item.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{fmt(item.val)} ₫</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Category Summary Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { key: 'service', icon: '🔧', label: 'Dịch vụ sửa chữa', value: serviceRev, type: 'revenue', color: C.navy, bg: '#EFF6FF' },
                { key: 'parts_sale', icon: '📦', label: 'Bán linh kiện', value: partsRev, type: 'revenue', color: C.green, bg: '#D1FAE5' },
                { key: 'parts_import', icon: '🛒', label: 'Nhập linh kiện', value: partImportExp, type: 'expense', color: C.cyan, bg: '#CFFAFE' },
                { key: 'payroll', icon: '👥', label: 'Lương nhân viên', value: payrollExp, type: 'expense', color: C.purple, bg: '#EDE9FE' },
                { key: 'tool', icon: '⚙️', label: 'Bảo trì thiết bị', value: toolExp, type: 'expense', color: C.rose, bg: '#FEE2E2' },
              ].map((cat) => (
                <div key={cat.key} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg uppercase ${cat.type === 'revenue' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {cat.type === 'revenue' ? 'Thu' : 'Chi'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-1 leading-tight">{cat.label}</div>
                  <div className="text-sm font-black" style={{ color: cat.color }}>{fmt(cat.value)} ₫</div>
                </div>
              ))}
            </div>

            {/* ── Transaction List ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-[#00285E]" />
                  <h3 className="text-sm font-black text-[#00285E]">Chi tiết giao dịch</h3>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{filteredTx.length} giao dịch</span>
                </div>
                <div className="flex gap-1">
                  {[['all', 'Tất cả'], ['revenue', 'Thu'], ['expense', 'Chi']].map(([v, l]) => (
                    <button key={v} onClick={() => { setTxFilter(v as 'all' | 'revenue' | 'expense'); setTxPage(1); }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${txFilter === v ? 'text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      style={txFilter === v ? { backgroundColor: v === 'revenue' ? C.green : v === 'expense' ? C.red : C.navy } : {}}
                    >{l}</button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {pageTx.map((tx, i) => (
                  <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                    <div className="text-xl shrink-0">{tx.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-700 truncate">{tx.description}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">{tx.category}</span>
                        <span className="text-[9px] text-slate-400">{new Date(tx.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className={`text-sm font-black shrink-0 ${tx.type === 'revenue' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.type === 'revenue' ? '+' : ''}{fmtFull(tx.amount)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalTxPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 px-5 py-4 border-t border-slate-100">
                  <button onClick={() => setTxPage((p) => Math.max(p - 1, 1))} disabled={txPage === 1}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-white border border-slate-200 text-[#00285E] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">Trước</button>
                  {Array.from({ length: totalTxPages }, (_, i) => (
                    <button key={i} onClick={() => setTxPage(i + 1)}
                      className={`w-7 h-7 rounded-xl text-[10px] font-bold transition-all ${txPage === i + 1 ? 'text-white' : 'bg-white border border-slate-200 text-[#00285E] hover:bg-slate-50'}`}
                      style={txPage === i + 1 ? { backgroundColor: C.navy } : {}}>{i + 1}</button>
                  ))}
                  <button onClick={() => setTxPage((p) => Math.min(p + 1, totalTxPages))} disabled={txPage === totalTxPages}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-white border border-slate-200 text-[#00285E] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">Sau</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB: XẾP HẠNG NHÂN VIÊN
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'ranking' && (
          <motion.div key="ranking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

            {/* Filter bar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">
                  <Filter size={12} /> Thời gian:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p) => (
                    <button key={p.value} onClick={() => {
                      setRankPreset(p.value);
                      if (p.value !== 'custom') { setRankStart(''); setRankEnd(''); }
                    }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${rankPreset === p.value ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      style={rankPreset === p.value ? { backgroundColor: C.navy } : {}}>{p.label}</button>
                  ))}
                </div>
                {rankPreset === 'custom' && (
                  <div className="flex items-center gap-2 ml-auto">
                    <input type="date" value={rankStart} onChange={(e) => setRankStart(e.target.value)}
                      className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    <span className="text-slate-400 text-xs">→</span>
                    <input type="date" value={rankEnd} onChange={(e) => setRankEnd(e.target.value)}
                      className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                )}
                <button onClick={fetchRankings} disabled={rankLoading}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50">
                  <RefreshCw size={11} className={rankLoading ? 'animate-spin' : ''} />Làm mới
                </button>
              </div>
            </div>

            {rankLoading && (
              <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                <RefreshCw size={18} className="animate-spin" />
                <span className="text-sm font-medium">Đang tải xếp hạng...</span>
              </div>
            )}

            {!rankLoading && rankError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl text-sm font-semibold">
                <AlertCircle size={18} className="shrink-0" />{rankError}
              </div>
            )}

            {!rankLoading && !rankError && rankings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <Trophy size={40} className="text-slate-200" />
                <p className="text-sm font-semibold">Không có dữ liệu xếp hạng</p>
              </div>
            )}

            {!rankLoading && !rankError && rankings.length > 0 && (
              <>
                {/* Top 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {sortedRankings.slice(0, 3).map((emp, idx) => {
                    const meta = getRankMeta(idx + 1);
                    return (
                      <motion.div key={emp.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }}
                        onClick={() => setSelectedEmployee(selectedEmployee?.id === emp.id ? null : emp)}
                        className="bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all text-center"
                        style={{ borderColor: idx === 0 ? '#F59E0B' : '#E2E8F0', boxShadow: idx === 0 ? '0 4px 20px rgba(245,158,11,0.15)' : undefined }}>
                        <div className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                          style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.badge}</div>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mx-auto mb-2 border-2"
                          style={{ backgroundColor: meta.bg, color: meta.color, borderColor: meta.color }}>
                          {emp.avatar ? <img src={emp.avatar} alt={emp.fullName} className="w-14 h-14 rounded-full object-cover" /> : initials(emp.fullName)}
                        </div>
                        <h3 className="font-bold text-sm text-[#00285E]">{emp.fullName}</h3>
                        <p className="text-[10px] text-slate-400 mb-2">{emp.role}</p>
                        <div className="text-2xl font-black mb-0.5" style={{ color: scoreColor(emp.performanceScore) }}>{emp.performanceScore.toFixed(0)}</div>
                        <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-3">Điểm hiệu suất</div>
                        <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-3 text-center">
                          <div><div className="text-[10px] font-black text-[#00285E]">{emp.completedTasks}</div><div className="text-[8px] text-slate-400">NV hoàn</div></div>
                          <div><div className="text-[10px] font-black text-emerald-600">{fmt(emp.revenueContribution)}</div><div className="text-[8px] text-slate-400">DT (₫)</div></div>
                          <div><div className="text-[10px] font-black text-amber-500">⭐{emp.rating}</div><div className="text-[8px] text-slate-400">Đánh giá</div></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Detail panel */}
                <AnimatePresence>
                  {selectedEmployee && (
                    <motion.div key={selectedEmployee.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                          style={{ backgroundColor: '#EFF6FF', color: C.navy }}>
                          {selectedEmployee.avatar ? <img src={selectedEmployee.avatar} className="w-12 h-12 rounded-xl object-cover" /> : initials(selectedEmployee.fullName)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-[#00285E] text-sm">{selectedEmployee.fullName}</h4>
                          <p className="text-xs text-slate-400">{selectedEmployee.role} · {selectedEmployee.phoneNumber}</p>
                          <p className="text-[10px] text-slate-400">Từ: {new Date(selectedEmployee.workDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <button onClick={() => setSelectedEmployee(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all shrink-0">Đóng</button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {[
                          { icon: <CheckCircle2 size={14} />, label: 'Nhiệm vụ hoàn thành', value: selectedEmployee.completedTasks, color: C.green },
                          { icon: <DollarSign size={14} />, label: 'Doanh thu đóng góp', value: fmt(selectedEmployee.revenueContribution) + ' ₫', color: C.navy },
                          { icon: <Star size={14} />, label: 'Đánh giá', value: `${selectedEmployee.rating} ⭐`, color: C.orange },
                          { icon: <TrendingUp size={14} />, label: 'Điểm hiệu suất', value: selectedEmployee.performanceScore.toFixed(1), color: scoreColor(selectedEmployee.performanceScore) },
                        ].map((item, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-center gap-1 mb-1" style={{ color: item.color }}>{item.icon}<span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span></div>
                            <div className="text-base font-black" style={{ color: item.color }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Full table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                    <Medal size={15} className="text-[#00285E]" />
                    <h3 className="text-sm font-black text-[#00285E]">Bảng xếp hạng đầy đủ</h3>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{rankings.length} nhân viên</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-12">Hạng</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nhân viên</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">TT</th>
                          {(['completedTasks', 'revenueContribution', 'rating', 'performanceScore'] as RankSortKey[]).map((k) => (
                            <th key={k} onClick={() => handleRankSort(k)}
                              className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#00285E] select-none">
                              {k === 'completedTasks' ? 'NV hoàn' : k === 'revenueContribution' ? 'Doanh thu' : k === 'rating' ? 'ĐG' : 'Điểm HP'}
                              {rankSort === k ? (rankDir === 'desc' ? <ChevronDown size={10} className="inline ml-0.5" /> : <ChevronUp size={10} className="inline ml-0.5" />) : null}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vào làm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRankings.map((emp, idx) => {
                          const meta = getRankMeta(idx + 1);
                          const isSelected = selectedEmployee?.id === emp.id;
                          return (
                            <tr key={emp.id} onClick={() => setSelectedEmployee(isSelected ? null : emp)}
                              className={`border-b border-slate-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50/60'}`}>
                              <td className="px-4 py-3">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                                  style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.badge}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 border"
                                    style={{ backgroundColor: '#EFF6FF', color: C.navy, borderColor: '#DBEAFE' }}>
                                    {emp.avatar ? <img src={emp.avatar} className="w-7 h-7 rounded-full object-cover" /> : initials(emp.fullName)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#00285E] leading-tight text-[11px]">{emp.fullName}</div>
                                    <div className="text-[9px] text-slate-400">{emp.phoneNumber}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 text-[11px]">{emp.role}</td>
                              <td className="px-4 py-3">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                  style={{ color: emp.status === 'ACTIVE' ? C.green : C.red, backgroundColor: emp.status === 'ACTIVE' ? '#D1FAE5' : '#FEE2E2' }}>
                                  {emp.status === 'ACTIVE' ? 'Đang làm' : emp.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-[#00285E] text-[11px]">{emp.completedTasks}</td>
                              <td className="px-4 py-3 text-right font-bold text-emerald-600 text-[11px]">{fmt(emp.revenueContribution)} ₫</td>
                              <td className="px-4 py-3 text-right font-bold text-amber-500 text-[11px]">⭐ {emp.rating}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-black text-sm" style={{ color: scoreColor(emp.performanceScore) }}>{emp.performanceScore.toFixed(1)}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-500 text-[10px]">{new Date(emp.workDate).toLocaleDateString('vi-VN')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Tổng nhân viên', value: rankings.length, icon: <Users size={16} />, color: C.navy, bg: '#EFF6FF' },
                    { label: 'Nhiệm vụ hoàn thành', value: rankings.reduce((s, r) => s + r.completedTasks, 0), icon: <CheckCircle2 size={16} />, color: C.green, bg: '#D1FAE5' },
                    { label: 'Tổng doanh thu', value: fmt(rankings.reduce((s, r) => s + r.revenueContribution, 0)) + ' ₫', icon: <DollarSign size={16} />, color: C.navy, bg: '#EFF6FF' },
                    { label: 'Đánh giá TB', value: `${(rankings.reduce((s, r) => s + r.rating, 0) / rankings.length).toFixed(1)} ⭐`, icon: <Star size={16} />, color: C.orange, bg: '#FEF3C7' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg, color: item.color }}>{item.icon}</div>
                      <div>
                        <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-black" style={{ color: item.color }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
