import { useState, useMemo } from 'react';
import {
  ClipboardPlus,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ========== MOCK SERVICE ORDERS DATABASE ==========
export interface ServiceOrderModel {
  id: string;
  appointmentId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleMileage: number;
  services: { id: string; name: string; price: number; category: string }[];
  notes?: string;
  status: 'draft' | 'assigned' | 'in_progress' | 'waiting_parts' | 'waiting_approval' | 'qc_checking' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  incurredCost?: number;
}

const MOCK_SERVICE_ORDERS: ServiceOrderModel[] = [
  {
    id: 'SO-001',
    appointmentId: 'APT-001',
    customerId: 'C001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901 234 567',
    vehiclePlate: '51A-123.45',
    vehicleModel: 'Toyota Camry 2.5Q',
    vehicleMileage: 45000,
    services: [
      { id: 'SV001', name: 'Bảo dưỡng định kỳ cấp 1', price: 500000, category: 'Bảo dưỡng' },
      { id: 'SV003', name: 'Thay dầu động cơ Castrol', price: 650000, category: 'Dầu nhớt' },
    ],
    status: 'in_progress',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T09:30:00',
  },
  {
    id: 'SO-002',
    customerId: 'C002',
    customerName: 'Trần Thị Bình',
    customerPhone: '0912 345 678',
    vehiclePlate: '30H-456.78',
    vehicleModel: 'Honda City RS',
    vehicleMileage: 22000,
    services: [
      { id: 'SV003', name: 'Thay dầu động cơ Castrol', price: 650000, category: 'Dầu nhớt' },
      { id: 'SV005', name: 'Vệ sinh kim phun điện tử', price: 1200000, category: 'Động cơ' },
    ],
    status: 'completed',
    createdBy: 'Nguyễn Minh Quân (Lễ tân)',
    createdAt: '2026-06-02T10:15:00',
  },
  {
    id: 'SO-003',
    customerId: 'C009',
    customerName: 'Phạm Minh Hùng',
    customerPhone: '0909 888 777',
    vehiclePlate: '51G-888.88',
    vehicleModel: 'Mercedes-Benz C200',
    vehicleMileage: 15000,
    services: [
      { id: 'SV002', name: 'Bảo dưỡng định kỳ cấp 2', price: 1200000, category: 'Bảo dưỡng' },
      { id: 'SV004', name: 'Cân chỉnh thước lái 3D', price: 600000, category: 'Sửa chữa gầm' },
    ],
    status: 'waiting_approval',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T11:00:00',
  },
  {
    id: 'SO-004',
    customerId: 'C010',
    customerName: 'Lê Văn Nam',
    customerPhone: '0977 123 456',
    vehiclePlate: '30A-999.99',
    vehicleModel: 'Mazda 3 Premium',
    vehicleMileage: 32000,
    services: [
      { id: 'SV007', name: 'Thay má phanh trước', price: 800000, category: 'Phanh' },
    ],
    status: 'cancelled',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T08:00:00',
    cancelledAt: '2026-06-02T08:15:00',
    cancelledBy: 'Trần Thị Thuỷ (Lễ tân)',
    cancelReason: 'Khách hàng thay đổi quyết định, không sửa nữa trước khi tháo lắp.',
    incurredCost: 0,
  },
  {
    id: 'SO-005',
    customerId: 'C011',
    customerName: 'Đặng Hoàng Nam',
    customerPhone: '0988 555 444',
    vehiclePlate: '51K-555.55',
    vehicleModel: 'Hyundai SantaFe',
    vehicleMileage: 60000,
    services: [
      { id: 'SV002', name: 'Bảo dưỡng định kỳ cấp 2', price: 1200000, category: 'Bảo dưỡng' },
      { id: 'SV010', name: 'Sơn phục hồi vết xước', price: 1500000, category: 'Thân vỏ' },
    ],
    status: 'waiting_parts',
    createdBy: 'Nguyễn Minh Quân (Lễ tân)',
    createdAt: '2026-06-01T14:00:00',
  },
];

export const SO_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft: { label: 'Bản nháp', color: '#6B7280', bg: '#F3F4F6', icon: Clock },
  assigned: { label: 'Đã giao việc', color: '#6366F1', bg: '#EEF2FF', icon: Users },
  in_progress: { label: 'Đang sửa chữa', color: '#3B82F6', bg: '#EFF6FF', icon: Loader2 },
  waiting_parts: { label: 'Chờ phụ tùng', color: '#D97706', bg: '#FEF3C7', icon: AlertCircle },
  waiting_approval: { label: 'Chờ khách duyệt', color: '#EC4899', bg: '#FDF2F8', icon: HelpCircle },
  qc_checking: { label: 'Đang QC', color: '#8B5CF6', bg: '#F5F3FF', icon: Clock },
  completed: { label: 'Hoàn thành', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
  cancelled: { label: 'Đã huỷ lệnh', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

const ITEMS_PER_PAGE = 5;

export default function ReceptionServiceOrderList() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredOrders = useMemo(() => {
    return MOCK_SERVICE_ORDERS.filter((so) => {
      const matchSearch =
        searchTerm === '' ||
        so.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        so.customerPhone.includes(searchTerm) ||
        so.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        so.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || so.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // KPI counts
  const kpiCounts = useMemo(() => ({
    total: MOCK_SERVICE_ORDERS.length,
    inProgress: MOCK_SERVICE_ORDERS.filter((o) => o.status === 'in_progress' || o.status === 'waiting_parts').length,
    waitingApproval: MOCK_SERVICE_ORDERS.filter((o) => o.status === 'waiting_approval').length,
    completed: MOCK_SERVICE_ORDERS.filter((o) => o.status === 'completed').length,
  }), []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getOrderTotal = (services: { price: number }[]) => {
    return services.reduce((sum, s) => sum + s.price, 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-2 flex items-center gap-2">
            <Wrench className="text-amber-500" size={28} />
            Quản lý hóa đơn dịch vụ
          </h1>
          <p className="text-slate-500 text-sm">
            Theo dõi, cập nhật trạng thái và xử lý yêu cầu hủy hóa đơn dịch vụ của khách hàng.
          </p>
        </div>
        <button
          onClick={() => navigate('/reception/service-orders/create')}
          className="flex items-center gap-2 px-5 py-3 bg-[#00285E] hover:bg-[#001a3f] text-white rounded-xl text-sm font-bold shadow-md transition-all self-start md:self-auto"
        >
          <ClipboardPlus size={16} />
          Tạo hóa đơn dịch vụ mới
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng hóa đơn dịch vụ', value: kpiCounts.total, icon: <Wrench size={22} />, color: '#00285E', bg: '#EFF6FF' },
          { label: 'Đang sửa chữa / Chờ linh kiện', value: kpiCounts.inProgress, icon: <Loader2 size={22} className="animate-spin" />, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Chờ khách duyệt báo giá', value: kpiCounts.waitingApproval, icon: <HelpCircle size={22} />, color: '#EC4899', bg: '#FDF2F8' },
          { label: 'Đã hoàn thành', value: kpiCounts.completed, icon: <CheckCircle2 size={22} />, color: '#059669', bg: '#D1FAE5' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight block">{card.value}</span>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, biển số xe, mã lệnh..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Bản nháp</option>
              <option value="assigned">Đã phân công</option>
              <option value="in_progress">Đang sửa chữa</option>
              <option value="waiting_parts">Chờ phụ tùng</option>
              <option value="waiting_approval">Chờ khách duyệt</option>
              <option value="qc_checking">Chờ QC</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã huỷ</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertCircle size={48} className="mb-4 text-slate-300" />
            <p className="text-lg font-semibold mb-1">Không tìm thấy hóa đơn dịch vụ</p>
            <p className="text-sm">Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="py-3 px-4">Mã lệnh</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Xe</th>
                  <th className="py-3 px-4">Tổng chi phí</th>
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((so) => {
                  const statusCfg = SO_STATUS_CONFIG[so.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={so.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#00285E] text-xs">{so.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#EDF3FF] flex items-center justify-center">
                            <Users size={16} className="text-[#00285E]" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{so.customerName}</p>
                            <p className="text-slate-400 text-xs">{so.customerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-700 text-xs">{so.vehiclePlate}</p>
                          <p className="text-slate-400 text-xs">{so.vehicleModel}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800 text-xs">
                        {formatPrice(getOrderTotal(so.services))}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs text-slate-600 font-semibold">{formatDate(so.createdAt)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                        >
                          <StatusIcon size={12} className={so.status === 'in_progress' ? 'animate-spin' : ''} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/reception/service-orders/${so.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#00285E] bg-[#EDF3FF] hover:bg-[#D2E2FF] transition-colors"
                          >
                            <Eye size={13} />
                            Chi tiết / Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400">
              Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} / {filteredOrders.length} lệnh
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === currentPage
                      ? 'bg-[#00285E] text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
