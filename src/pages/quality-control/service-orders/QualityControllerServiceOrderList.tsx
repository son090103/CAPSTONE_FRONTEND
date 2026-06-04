import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Car,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface PartItem {
  name: string;
  quantity: number;
  price: number;
}

interface ServiceItem {
  name: string;
  price: number;
}

interface CompletedVehicle {
  id: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  technicianName: string;
  completionDate: string;
  status: 'PENDING_QC' | 'APPROVED' | 'REJECTED';
  reworkReason?: string;
  partsUsed: PartItem[];
  services: ServiceItem[];
  notes: string;
}

const INITIAL_COMPLETED_VEHICLES: CompletedVehicle[] = [
  {
    id: 'SO-2026-001',
    vehiclePlate: '30A-987.65',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Camry 2.5Q',
    vehicleYear: '2022',
    vehicleColor: 'Đen',
    customerName: 'Nguyễn Văn Hùng',
    customerPhone: '0912345678',
    customerEmail: 'hung.nguyen@gmail.com',
    technicianName: 'Trần Minh Quốc',
    completionDate: '2026-06-04',
    status: 'PENDING_QC',
    partsUsed: [
      { name: 'Lọc nhớt Toyota', quantity: 1, price: 150000 },
      { name: 'Dầu động cơ Mobil 1 5W-30 (Lít)', quantity: 4, price: 250000 },
      { name: 'Má phanh trước Camry', quantity: 2, price: 850000 },
    ],
    services: [
      { name: 'Bảo dưỡng định kỳ cấp 2', price: 1200000 },
      { name: 'Thay má phanh trước', price: 300000 },
    ],
    notes: 'Đã hoàn thành bảo dưỡng định kỳ và thay má phanh trước. Má phanh cũ đã mòn nhiều. Đã kiểm tra phanh và chạy thử ổn định.',
  },
  {
    id: 'SO-2026-002',
    vehiclePlate: '51F-123.45',
    vehicleBrand: 'BMW',
    vehicleModel: '320i LCI',
    vehicleYear: '2021',
    vehicleColor: 'Trắng',
    customerName: 'Phạm Minh Anh',
    customerPhone: '0987654321',
    customerEmail: 'minhanh.pham@yahoo.com',
    technicianName: 'Lê Hoàng Đức',
    completionDate: '2026-06-04',
    status: 'PENDING_QC',
    partsUsed: [
      { name: 'Bugi NGK Laser Platinum', quantity: 4, price: 350000 },
      { name: 'Lọc gió điều hòa carbon BMW', quantity: 1, price: 650000 },
    ],
    services: [
      { name: 'Chẩn đoán lỗi OBD & reset bảo dưỡng', price: 300000 },
      { name: 'Thay bugi đánh lửa', price: 200000 },
      { name: 'Dọn nội thất toàn diện', price: 1500000 },
    ],
    notes: 'Động cơ đã nổ êm sau khi thay bugi. Đã quét lỗi hệ thống không còn mã lỗi phát sinh. Đã dọn dẹp sạch cabin.',
  },
  {
    id: 'SO-2026-003',
    vehiclePlate: '30E-555.22',
    vehicleBrand: 'Mazda',
    vehicleModel: 'CX-5 2.0 Premium',
    vehicleYear: '2020',
    vehicleColor: 'Đỏ',
    customerName: 'Lê Thanh Bình',
    customerPhone: '0904445556',
    customerEmail: 'binh.lt@gmail.com',
    technicianName: 'Nguyễn Văn Hải',
    completionDate: '2026-06-03',
    status: 'APPROVED',
    partsUsed: [
      { name: 'Dầu hộp số tự động (Lít)', quantity: 4, price: 320000 },
      { name: 'Lọc dầu hộp số Mazda', quantity: 1, price: 450000 },
    ],
    services: [
      { name: 'Thay dầu và lọc dầu hộp số', price: 600000 },
      { name: 'Cân chỉnh thước lái 3D', price: 400000 },
    ],
    notes: 'Hộp số chuyển số mượt mà sau khi thay dầu. Góc đặt bánh xe đã được hiệu chỉnh chính xác theo thông số hãng.',
  },
  {
    id: 'SO-2026-004',
    vehiclePlate: '29C-888.99',
    vehicleBrand: 'Ford',
    vehicleModel: 'Ranger Wildtrak 2.0L',
    vehicleYear: '2019',
    vehicleColor: 'Xám',
    customerName: 'Trịnh Quốc Bảo',
    customerPhone: '0911223344',
    customerEmail: 'baotq@fordclub.vn',
    technicianName: 'Trần Minh Quốc',
    completionDate: '2026-06-02',
    status: 'REJECTED',
    reworkReason: 'Khách phàn nàn phanh vẫn còn tiếng rít nhẹ khi rà phanh ở tốc độ chậm. Cần tháo má phanh vệ sinh lại và tra mỡ giảm chấn.',
    partsUsed: [
      { name: 'Rơ le còi sên', quantity: 1, price: 120000 },
    ],
    services: [
      { name: 'Kiểm tra tiếng kêu hệ thống treo trước', price: 200000 },
      { name: 'Thay thế rơ le hệ thống còi xe', price: 100000 },
    ],
    notes: 'Còi đã hoạt động bình thường sau khi thay rơ le. Tiếng kêu hệ thống treo trước do rotuyn lái ngoài bị lỏng đã siết chặt lại.',
  },
  {
    id: 'SO-2026-005',
    vehiclePlate: '15A-678.90',
    vehicleBrand: 'Hyundai',
    vehicleModel: 'SantaFe 2.2 Diesel',
    vehicleYear: '2023',
    vehicleColor: 'Xanh',
    customerName: 'Vũ Thị Hồng',
    customerPhone: '0978998877',
    customerEmail: 'hongvu15@gmail.com',
    technicianName: 'Lê Hoàng Đức',
    completionDate: '2026-06-04',
    status: 'PENDING_QC',
    partsUsed: [
      { name: 'Dầu phanh Dot 4', quantity: 2, price: 180000 },
      { name: 'Nước làm mát Hyundai LLC', quantity: 3, price: 150000 },
    ],
    services: [
      { name: 'Xả e hệ thống phanh và thay dầu phanh', price: 400000 },
      { name: 'Súc rửa két nước và thay nước làm mát', price: 300000 },
    ],
    notes: 'Đã súc rửa két nước làm sạch cặn. Chân phanh sau khi xả e cho cảm giác sâu phanh tốt, lực phanh ăn đều.',
  }
];

export default function QualityControllerServiceOrderList() {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  // State management
  const [vehicles, setVehicles] = useState<CompletedVehicle[]>(INITIAL_COMPLETED_VEHICLES);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_QC' | 'APPROVED' | 'REJECTED'>('ALL');
  const [techFilter, setTechFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Modals state
  const [activeApproveVehicle, setActiveApproveVehicle] = useState<CompletedVehicle | null>(null);
  const [activeRejectVehicle, setActiveRejectVehicle] = useState<CompletedVehicle | null>(null);
  const [reworkReason, setReworkReason] = useState<string>('');
  const [reworkError, setReworkError] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract unique technicians for filtering
  const techniciansList = useMemo(() => {
    const techs = new Set(vehicles.map((v) => v.technicianName));
    return Array.from(techs);
  }, [vehicles]);

  // KPI Calculations
  const stats = useMemo(() => {
    return {
      pendingQc: vehicles.filter((v) => v.status === 'PENDING_QC').length,
      approvedToday: vehicles.filter((v) => v.status === 'APPROVED').length,
      rejectedRework: vehicles.filter((v) => v.status === 'REJECTED').length,
    };
  }, [vehicles]);

  // Filtered List
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        v.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vehicleBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.technicianName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchesTech = techFilter === 'ALL' || v.technicianName === techFilter;
      const matchesDate = dateFilter === '' || v.completionDate === dateFilter;

      return matchesSearch && matchesStatus && matchesTech && matchesDate;
    });
  }, [vehicles, searchQuery, statusFilter, techFilter, dateFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApproveConfirm = () => {
    if (!activeApproveVehicle) return;
    
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === activeApproveVehicle.id ? { ...v, status: 'APPROVED' } : v
      )
    );
    setActiveApproveVehicle(null);
  };

  const handleRejectConfirm = () => {
    if (!activeRejectVehicle) return;
    if (reworkReason.trim().length < 10) {
      setReworkError('Lý do yêu cầu làm lại phải dài ít nhất 10 ký tự.');
      return;
    }

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === activeRejectVehicle.id
          ? { ...v, status: 'REJECTED', reworkReason: reworkReason.trim() }
          : v
      )
    );
    setReworkReason('');
    setReworkError('');
    setActiveRejectVehicle(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fadeIn text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-[#0E4D40]">
            Kiểm tra chất lượng xe
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Quản lý và thẩm định chất lượng các phương tiện đã hoàn thành công việc sửa chữa.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 bg-[#E8F5F0] border border-[#C4E8E0] rounded-xl text-xs font-bold text-[#0E4D40]">
          <ShieldCheck size={16} />
          <span>Role: Trưởng nhóm kỹ thuật / KCS</span>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chờ kiểm tra (QC)</span>
            <span className="text-3xl font-black text-amber-600 font-display block">{stats.pendingQc}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={22} className="animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Đã duyệt kiểm tra</span>
            <span className="text-3xl font-black text-emerald-600 font-display block">{stats.approvedToday}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Yêu cầu làm lại</span>
            <span className="text-3xl font-black text-rose-600 font-display block">{stats.rejectedRework}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter and search controllers */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#0E4D40] border-b border-slate-100 pb-3">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Bộ lọc tìm kiếm</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Status selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
              Trạng thái chất lượng
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e: any) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold appearance-none outline-none focus:border-[#0E4D40] focus:bg-white text-slate-700 cursor-pointer"
              >
                <option value="ALL">Tất cả xe đã hoàn thành</option>
                <option value="PENDING_QC">Chờ kiểm tra chất lượng</option>
                <option value="APPROVED">Đã đạt chuẩn (Đã duyệt)</option>
                <option value="REJECTED">Không đạt chuẩn (Yêu cầu làm lại)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Technician selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
              Kỹ thuật viên phụ trách
            </label>
            <div className="relative">
              <select
                value={techFilter}
                onChange={(e) => {
                  setTechFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold appearance-none outline-none focus:border-[#0E4D40] focus:bg-white text-slate-700 cursor-pointer"
              >
                <option value="ALL">Tất cả kỹ thuật viên</option>
                {techniciansList.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
              Ngày hoàn thành sửa chữa
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#0E4D40] focus:bg-white text-slate-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main List displaying Completed Vehicles */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {filteredVehicles.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <AlertCircle size={28} />
            </div>
            <div className="max-w-xs mx-auto space-y-1">
              <h3 className="font-bold text-slate-700 text-sm">Không tìm thấy bản ghi</h3>
              <p className="text-xs text-slate-400">
                Không có xe nào chờ kiểm tra chất lượng hoặc không khớp với bộ lọc của bạn.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 pl-6">Mã đơn / Ngày hoàn thành</th>
                  <th className="p-4">Phương tiện</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Kỹ thuật viên</th>
                  <th className="p-4">Trạng thái QC</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 space-y-1">
                      <span className="font-bold text-[#0E4D40]">{item.id}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar size={11} />
                        <span>{item.completionDate}</span>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Car size={13} className="text-slate-400" />
                        <span>{item.vehiclePlate}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{item.vehicleBrand} {item.vehicleModel}</span>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-slate-700">{item.customerName}</span>
                      <span className="text-[10px] text-slate-400 block">{item.customerPhone}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-slate-400" />
                        <span className="font-medium">{item.technicianName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.status === 'PENDING_QC' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700">
                          <Clock size={10} />
                          Chờ KCS duyệt
                        </span>
                      )}
                      {item.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                          <CheckCircle size={10} />
                          Đạt chất lượng
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700">
                          <XCircle size={10} />
                          Yêu cầu sửa lại
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/quality-control/service-orders/${item.id}`)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-[#0E4D40] rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye size={15} />
                        </button>
                        
                        {item.status === 'PENDING_QC' && (
                          <>
                            <button
                              onClick={() => setActiveApproveVehicle(item)}
                              className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                              title="Xác nhận đạt"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => setActiveRejectVehicle(item)}
                              className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Yêu cầu sửa lại"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer controls for list pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Hiển thị {currentItems.length} trên tổng số {filteredVehicles.length} bản ghi</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg border border-slate-200 transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'bg-white hover:bg-slate-50'}`}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-8 h-8 rounded-lg border transition-all ${currentPage === idx + 1 ? 'bg-[#0E4D40] border-[#0E4D40] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg border border-slate-200 transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'bg-white hover:bg-slate-50'}`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Confirm Approve Quality */}
      <AnimatePresence>
        {activeApproveVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={() => setActiveApproveVehicle(null)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-6 z-10 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">
                    Xác nhận đạt chất lượng
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Xác nhận xe biển số <span className="font-bold text-slate-700">{activeApproveVehicle.vehiclePlate}</span> đã hoàn thành công việc đạt tiêu chuẩn chất lượng kỹ thuật của gara.
                  </p>
                </div>
              </div>

              <div className="mt-5 bg-slate-50 p-4 rounded-xl text-[11px] space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phương tiện:</span>
                  <span className="font-bold text-slate-700">{activeApproveVehicle.vehicleBrand} {activeApproveVehicle.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kỹ thuật viên phụ trách:</span>
                  <span className="font-bold text-slate-700">{activeApproveVehicle.technicianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày sửa xong:</span>
                  <span className="font-bold text-slate-700">{activeApproveVehicle.completionDate}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => setActiveApproveVehicle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApproveConfirm}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Xác nhận đạt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Reject / Send back for Rework */}
      <AnimatePresence>
        {activeRejectVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={() => {
                setActiveRejectVehicle(null);
                setReworkReason('');
                setReworkError('');
              }}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-6 z-10 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <XCircle size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">
                    Từ chối hoàn thành - Yêu cầu làm lại
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Yêu cầu kỹ thuật viên kiểm tra và sửa chữa lại xe biển số <span className="font-bold text-slate-700">{activeRejectVehicle.vehiclePlate}</span>.
                  </p>
                </div>
              </div>

              {/* Rework Reason Input Fields */}
              <div className="mt-5 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                  Lý do từ chối chất lượng (bắt buộc)
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <textarea
                    rows={4}
                    placeholder="Nhập chi tiết các hạng mục chưa đạt chất lượng và yêu cầu khắc phục (tối thiểu 10 ký tự)..."
                    value={reworkReason}
                    onChange={(e) => {
                      setReworkReason(e.target.value);
                      if (e.target.value.trim().length >= 10) setReworkError('');
                    }}
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-4 py-3 text-xs outline-none transition-all ${
                      reworkError ? 'border-rose-400 focus:border-rose-500 focus:bg-rose-50/10' : 'border-slate-200 focus:border-[#0E4D40] focus:bg-white'
                    } text-slate-700 resize-none`}
                  />
                </div>
                {reworkError && (
                  <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 px-1">
                    <AlertCircle size={11} />
                    {reworkError}
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setActiveRejectVehicle(null);
                    setReworkReason('');
                    setReworkError('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRejectConfirm}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Yêu cầu làm lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
