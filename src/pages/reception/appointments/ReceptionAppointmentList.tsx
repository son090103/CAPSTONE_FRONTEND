import { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { AppointmentModel } from '../../../model/Appointment';

// ========== MOCK DATA ==========
const MOCK_APPOINTMENTS: AppointmentModel[] = [
  {
    id: 'APT-001',
    customerId: 'C001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901 234 567',
    customerEmail: 'an.nguyen@email.com',
    vehicleId: 'V001',
    vehiclePlate: '51A-123.45',
    vehicleModel: 'Toyota Camry 2.5Q',
    vehicleYear: 2020,
    vehicleMileage: 45000,
    services: ['Bảo dưỡng định kỳ cấp 1', 'Thay dầu động cơ'],
    appointmentDate: '2026-06-02',
    appointmentTime: '09:00',
    status: 'pending',
    notes: 'Xe có tiếng kêu lạ ở bánh trước bên trái',
    createdAt: '2026-06-01T10:30:00',
  },
  {
    id: 'APT-002',
    customerId: 'C002',
    customerName: 'Trần Thị Bình',
    customerPhone: '0912 345 678',
    vehicleId: 'V002',
    vehiclePlate: '30H-456.78',
    vehicleModel: 'Honda City RS',
    vehicleYear: 2022,
    vehicleMileage: 22000,
    services: ['Thay dầu động cơ Castrol'],
    appointmentDate: '2026-06-02',
    appointmentTime: '10:30',
    status: 'confirmed',
    createdAt: '2026-06-01T08:15:00',
  },
  {
    id: 'APT-003',
    customerId: 'C003',
    customerName: 'Lê Hoàng Minh',
    customerPhone: '0933 456 789',
    vehicleId: 'V003',
    vehiclePlate: '51G-789.01',
    vehicleModel: 'Mazda CX-5 2.0L',
    vehicleYear: 2021,
    vehicleMileage: 38000,
    services: ['Cân chỉnh thước lái 3D', 'Kiểm tra phanh'],
    appointmentDate: '2026-06-02',
    appointmentTime: '14:00',
    status: 'confirmed',
    createdAt: '2026-05-31T16:00:00',
  },
  {
    id: 'APT-004',
    customerId: 'C004',
    customerName: 'Phạm Quỳnh Anh',
    customerPhone: '0944 567 890',
    vehicleId: 'V004',
    vehiclePlate: '59C-234.56',
    vehicleModel: 'Hyundai Accent 1.4MT',
    vehicleYear: 2019,
    vehicleMileage: 62000,
    services: ['Vệ sinh kim phun điện tử'],
    appointmentDate: '2026-06-03',
    appointmentTime: '08:30',
    status: 'pending',
    createdAt: '2026-06-01T12:00:00',
  },
  {
    id: 'APT-005',
    customerId: 'C005',
    customerName: 'Đỗ Thanh Tùng',
    customerPhone: '0955 678 901',
    vehicleId: 'V005',
    vehiclePlate: '51F-567.89',
    vehicleModel: 'Kia Seltos 1.4 Turbo',
    vehicleYear: 2023,
    vehicleMileage: 12000,
    services: ['Bảo dưỡng định kỳ cấp 1'],
    appointmentDate: '2026-06-01',
    appointmentTime: '15:00',
    status: 'completed',
    createdAt: '2026-05-30T09:00:00',
  },
  {
    id: 'APT-006',
    customerId: 'C006',
    customerName: 'Vũ Minh Khoa',
    customerPhone: '0966 789 012',
    vehicleId: 'V006',
    vehiclePlate: '30A-890.12',
    vehicleModel: 'Ford Ranger Wildtrak',
    vehicleYear: 2021,
    vehicleMileage: 55000,
    services: ['Thay dầu động cơ', 'Thay lọc gió'],
    appointmentDate: '2026-06-03',
    appointmentTime: '09:30',
    status: 'in_progress',
    createdAt: '2026-06-01T14:30:00',
  },
  {
    id: 'APT-007',
    customerId: 'C007',
    customerName: 'Hoàng Thu Hà',
    customerPhone: '0977 890 123',
    vehicleId: 'V007',
    vehiclePlate: '51D-345.67',
    vehicleModel: 'VinFast VF 8',
    vehicleYear: 2024,
    vehicleMileage: 8000,
    services: ['Kiểm tra tổng quát'],
    appointmentDate: '2026-05-30',
    appointmentTime: '11:00',
    status: 'cancelled',
    createdAt: '2026-05-28T10:00:00',
  },
  {
    id: 'APT-008',
    customerId: 'C008',
    customerName: 'Bùi Đức Huy',
    customerPhone: '0988 901 234',
    vehicleId: 'V008',
    vehiclePlate: '51A-678.90',
    vehicleModel: 'Toyota Fortuner 2.7AT',
    vehicleYear: 2018,
    vehicleMileage: 95000,
    services: ['Bảo dưỡng định kỳ cấp 2', 'Thay má phanh'],
    appointmentDate: '2026-06-04',
    appointmentTime: '08:00',
    status: 'pending',
    createdAt: '2026-06-02T07:00:00',
  },
  {
    id: 'APT-009',
    customerId: 'C009',
    customerName: 'Nguyễn Đức Cường (Spam Check)',
    customerPhone: '0999 777 666',
    vehicleId: 'V009',
    vehiclePlate: '51G-999.99',
    vehicleModel: 'Ford Everest',
    vehicleYear: 2020,
    vehicleMileage: 70000,
    services: ['Thay dầu động cơ Castrol'],
    appointmentDate: '2026-06-01',
    appointmentTime: '09:00',
    status: 'no_show',
    createdAt: '2026-05-30T10:00:00',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ xác nhận', color: '#D97706', bg: '#FEF3C7', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: '#2563EB', bg: '#DBEAFE', icon: CheckCircle2 },
  in_progress: { label: 'Đã tiếp nhận (Đang sửa)', color: '#EA580C', bg: '#FED7AA', icon: Loader2 },
  completed: { label: 'Đã tiếp nhận (Hoàn thành)', color: '#059669', bg: '#D1FAE5', icon: CheckCircle2 },
  cancelled: { label: 'Đã hủy', color: '#DC2626', bg: '#FEE2E2', icon: XCircle },
  no_show: { label: 'Khách không đến (No Show)', color: '#6B7280', bg: '#F3F4F6', icon: XCircle },
};

const ITEMS_PER_PAGE = 6;

export default function AppointmentList() {
  const navigate = useNavigate();
  const { showToast } = useOutletContext<{
    showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredAppointments = useMemo(() => {
    return MOCK_APPOINTMENTS.filter((apt) => {
      const matchSearch =
        searchTerm === '' ||
        apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.customerPhone.includes(searchTerm) ||
        apt.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || apt.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  // KPI counts
  const kpiCounts = useMemo(() => ({
    total: MOCK_APPOINTMENTS.length,
    pending: MOCK_APPOINTMENTS.filter((a) => a.status === 'pending').length,
    confirmed: MOCK_APPOINTMENTS.filter((a) => a.status === 'confirmed').length,
    completed: MOCK_APPOINTMENTS.filter((a) => a.status === 'completed').length,
  }), []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-2 flex items-center gap-2">
            <CalendarCheck className="text-amber-500" size={28} />
            Danh sách Lịch hẹn
          </h1>
          <p className="text-slate-500 text-sm">
            Quản lý tất cả lịch hẹn dịch vụ — xem chi tiết và tiếp nhận xe.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng lịch hẹn', value: kpiCounts.total, icon: <CalendarCheck size={22} />, color: '#00285E', bg: '#EFF6FF' },
          { label: 'Chờ xác nhận', value: kpiCounts.pending, icon: <Clock size={22} />, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Đã xác nhận', value: kpiCounts.confirmed, icon: <CheckCircle2 size={22} />, color: '#2563EB', bg: '#DBEAFE' },
          { label: 'Hoàn thành', value: kpiCounts.completed, icon: <CheckCircle2 size={22} />, color: '#059669', bg: '#D1FAE5' },
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
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, biển số, mã lịch hẹn..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* APPOINTMENT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertCircle size={48} className="mb-4 text-slate-300" />
            <p className="text-lg font-semibold mb-1">Không tìm thấy lịch hẹn</p>
            <p className="text-sm">Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Xe</th>
                  <th className="py-3 px-4">Dịch vụ</th>
                  <th className="py-3 px-4">Ngày hẹn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((apt) => {
                  const statusCfg = STATUS_CONFIG[apt.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={apt.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#00285E] text-xs">{apt.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#EDF3FF] flex items-center justify-center">
                            <Users size={16} className="text-[#00285E]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-slate-800 text-sm">{apt.customerName}</p>
                              {apt.status === 'no_show' && (
                                <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-rose-50 text-rose-500 border border-rose-100 uppercase">
                                  Cảnh báo No-show
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs">{apt.customerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-700 text-xs">{apt.vehiclePlate}</p>
                          <p className="text-slate-400 text-xs">{apt.vehicleModel}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-[200px]">
                          {apt.services.slice(0, 2).map((s, i) => (
                            <span key={i} className="inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md mr-1 mb-1">
                              {s}
                            </span>
                          ))}
                          {apt.services.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-semibold">+{apt.services.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-700 text-xs">{formatDate(apt.appointmentDate)}</p>
                          <p className="text-slate-400 text-xs">{apt.appointmentTime}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                        >
                          <StatusIcon size={12} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/reception/appointments/${apt.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#00285E] bg-[#EDF3FF] hover:bg-[#D2E2FF] transition-colors"
                          >
                            <Eye size={13} />
                            Chi tiết
                          </button>
                          {(apt.status === 'confirmed' || apt.status === 'pending') && (
                            <button
                              onClick={() => {
                                navigate(`/reception/service-orders/create?appointmentId=${apt.id}`);
                                showToast(`Tiếp nhận xe cho lịch hẹn ${apt.id}`, 'info');
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#00285E] hover:bg-[#001a3f] transition-colors"
                            >
                              <CarFront size={13} />
                              Tiếp nhận
                            </button>
                          )}
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
              Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredAppointments.length)} / {filteredAppointments.length} lịch hẹn
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
