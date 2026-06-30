import { useState, useMemo, useEffect } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Car,
  Calendar,
  Eye,
  PlayCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchClient_v2 as useFetchClient } from '../../../hook/useFetchClient';
import { TASK_ASSIGNMENT_ENDPOINTS } from '../../../constants/technician/taskAssignmentEndpoint';

// ========== TYPES ==========
interface Assignment {
  id: string;
  serviceOrderId: string;
  technicianId: string;
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  services: string[];
  appointmentDate: string;
  appointmentTime: string;
  assignedAt: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'PAUSED' | 'PENDING_QC' | 'COMPLETED';
  rejectedAt?: string;
  taskAssignmentId?: string | number;
  bookingType: string;
}

const ASSIGNMENT_STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  ASSIGNED: { label: 'Đã phân công', className: 'bg-amber-50 text-amber-600 border border-amber-200', icon: Clock },
  IN_PROGRESS: { label: 'Đang thực hiện', className: 'bg-blue-50 text-blue-700 border border-blue-200', icon: CheckSquare },
  PAUSED: { label: 'Tạm dừng', className: 'bg-rose-50 text-rose-600 border border-rose-200', icon: XCircle },
  PENDING_QC: { label: 'Chờ QC', className: 'bg-violet-50 text-violet-700 border border-violet-200', icon: Eye },
  COMPLETED: { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-600 border border-emerald-200', icon: CheckCircle2 },
};

// Mock assignments removed to use API data

const ITEMS_PER_PAGE = 5;

export default function TechnicianAssignments() {
  const navigate = useNavigate();
  const { fetchPrivate } = useFetchClient();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPrivate(TASK_ASSIGNMENT_ENDPOINTS.GET_MY_ASSIGNMENTS);
        if (Array.isArray(response)) {
          const mappedData: Assignment[] = response.map((so: any) => {
            const services = so.tasks?.map((t: any) => t.catalog?.service_name) || [];
            const firstAssignment = so.tasks?.[0]?.assignments?.[0];

            let status: Assignment['status'] = 'ASSIGNED';
            if (firstAssignment && ['ASSIGNED', 'IN_PROGRESS', 'PAUSED', 'PENDING_QC', 'COMPLETED'].includes(firstAssignment.status)) {
              status = firstAssignment.status as Assignment['status'];
            }

            const aptDate = so.appointment?.scheduled_time ? new Date(so.appointment.scheduled_time) : new Date(so.createdAt);

            return {
              id: `SO-${so.id}`,
              serviceOrderId: so.id.toString(),
              technicianId: firstAssignment?.technician_id?.toString() || '',
              customerName: so.vehicle?.customer?.name || so.vehicle?.customer?.user?.fullName || 'Khách vãng lai',
              customerPhone: so.vehicle?.customer?.phone || so.vehicle?.customer?.user?.phoneNumber || '',
              vehiclePlate: so.vehicle?.license_plate || '',
              vehicleModel: `${so.vehicle?.model?.make?.make_name || ''} ${so.vehicle?.model?.model_name || ''}`.trim(),
              services: services.filter(Boolean),
              appointmentDate: aptDate.toISOString(),
              appointmentTime: aptDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              assignedAt: firstAssignment?.createdAt || so.createdAt,
              status: status,
              taskAssignmentId: firstAssignment?.id,
              bookingType: so.appointment?.booking_type || 'WALK_IN',
            };
          });
          setAssignments(mappedData);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách phân công:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [fetchPrivate, refreshKey]);

  const handleStartTask = async (taskAssignmentId: string | number | undefined) => {
    if (!taskAssignmentId) {
      alert("Không tìm thấy thông tin phân công.");
      return;
    }
    try {
      await fetchPrivate(TASK_ASSIGNMENT_ENDPOINTS.START_TASK, 'PUT', { taskAssignmentId });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error('Lỗi khi bắt đầu công việc:', error);
      alert(error.message || 'Đã xảy ra lỗi khi bắt đầu công việc.');
    }
  };

  const handleCompleteTask = async (taskAssignmentId: string | number | undefined) => {
    if (!taskAssignmentId) {
      alert("Không tìm thấy thông tin phân công.");
      return;
    }
    if (!confirm("Bạn có chắc chắn muốn HOÀN THÀNH công việc này?")) return;

    try {
      await fetchPrivate(TASK_ASSIGNMENT_ENDPOINTS.COMPLETE_TASK, 'PUT', { taskAssignmentId });
      setRefreshKey(prev => prev + 1);
      alert("Đã hoàn thành công việc thành công!");
    } catch (error: any) {
      console.error('Lỗi khi hoàn thành công việc:', error);
      alert(error.message || 'Đã xảy ra lỗi khi hoàn thành công việc.');
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      const matchSearch =
        searchTerm === '' ||
        asg.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asg.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asg.serviceOrderId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || asg.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter, assignments]);

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssignments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssignments, currentPage]);

  const kpiCounts = useMemo(() => ({
    total: assignments.length,
    assigned: assignments.filter(a => a.status === 'ASSIGNED').length,
    inProgress: assignments.filter(a => a.status === 'IN_PROGRESS').length,
    completed: assignments.filter(a => a.status === 'COMPLETED').length,
  }), [assignments]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-2 flex items-center gap-2">
          <CheckSquare className="text-[#F9A11B]" size={28} />
          Quản lý phân công
        </h1>
        <p className="text-slate-500 text-sm">
          Xem và quản lý trạng thái phân công công việc sửa chữa.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng phân công', value: kpiCounts.total, icon: <CheckSquare size={22} />, color: '#00285E', bg: '#EDF3FF' },
          { label: 'Mới phân công', value: kpiCounts.assigned, icon: <Clock size={22} />, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Đang thực hiện', value: kpiCounts.inProgress, icon: <CheckSquare size={22} />, color: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Hoàn thành', value: kpiCounts.completed, icon: <CheckCircle2 size={22} />, color: '#10B981', bg: '#ECFDF5' },
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
              placeholder="Tìm theo tên khách, biển số xe, mã phân công..."
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
              <option value="ASSIGNED">Mới phân công</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="PAUSED">Tạm dừng</option>
              <option value="PENDING_QC">Chờ QC</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={48} className="mb-4 text-[#00285E] animate-spin" />
            <p className="text-lg font-semibold mb-1 text-slate-700">Đang tải phân công...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertCircle size={48} className="mb-4 text-slate-300" />
            <p className="text-lg font-semibold mb-1">Không tìm thấy phân công</p>
            <p className="text-sm">Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Mã</th>
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Khách hàng</th>
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Xe</th>
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Dịch vụ</th>
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Lịch hẹn</th>
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Ngày phân công</th>
                  <th className="py-3 px-4 align-middle whitespace-nowrap">Trạng thái</th>
                  <th className="py-3 px-4 align-middle text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((asg) => {
                  const statusCfg = ASSIGNMENT_STATUS_CONFIG[asg.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={asg.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <span className="font-bold text-[#00285E] text-xs">{asg.id}</span>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-2 min-w-[160px]">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-[#EDF3FF] flex items-center justify-center">
                            <Users size={14} className="text-[#00285E]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-700 text-xs truncate">{asg.customerName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{asg.customerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-1.5 min-w-[140px]">
                          <Car size={13} className="text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-700 text-xs truncate">{asg.vehiclePlate}</p>
                            <p className="text-[10px] text-slate-400 truncate">{asg.vehicleModel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="flex flex-wrap gap-1 min-w-[160px] max-w-[220px]">
                          {asg.services.length > 0 ? (
                            asg.services.map((svc, i) => (
                              <span
                                key={i}
                                className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium"
                              >
                                {svc}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-slate-400 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-700 font-semibold">{formatDate(asg.appointmentDate)}</p>
                            <p className="text-[10px] text-slate-400">{asg.appointmentTime}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <span className="text-xs text-slate-600 font-medium">{formatDateTime(asg.assignedAt)}</span>
                      </td>
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.className}`}
                        >
                          <StatusIcon size={12} className="shrink-0" />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                          {asg.status === 'ASSIGNED' ? (
                            (asg.bookingType === 'RECEPTIONIST_REPAIR' || asg.bookingType === 'CUSTOMER_REPAIR') ? (
                              <button
                                onClick={() => {
                                  // TODO: Handle quote creation navigation
                                  alert('Chức năng tạo báo giá đang được cập nhật...');
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <CheckSquare size={13} />
                                Tạo báo giá
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartTask(asg.taskAssignmentId)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#00285E] bg-[#EDF3FF] hover:bg-[#DCE8FF] transition-colors"
                              >
                                <PlayCircle size={13} />
                                Bắt đầu làm
                              </button>
                            )
                          ) : asg.status === 'IN_PROGRESS' ? (
                            <button
                              onClick={() => handleCompleteTask(asg.taskAssignmentId)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#00285E] bg-[#EDF3FF] hover:bg-[#DCE8FF] transition-colors"
                            >
                              <CheckCircle2 size={13} />
                              Hoàn thành
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/technician/assignments/${asg.serviceOrderId}`)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                              <Eye size={13} />
                              Chi tiết
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
              Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredAssignments.length)} / {filteredAssignments.length} phân công
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === currentPage
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
