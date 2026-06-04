import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Car,
  User,
  ShieldCheck,
  Calendar,
  Wrench,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

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

const COMPLETED_VEHICLES_DB: Record<string, CompletedVehicle> = {
  'SO-2026-001': {
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
  'SO-2026-002': {
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
  'SO-2026-003': {
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
  'SO-2026-005': {
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
};

export default function QualityControllerServiceOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<CompletedVehicle | null>(() => {
    if (id && COMPLETED_VEHICLES_DB[id]) {
      return COMPLETED_VEHICLES_DB[id];
    }
    return null;
  });

  const [toast, setToast] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [reworkReason, setReworkReason] = useState('');
  const [reworkError, setReworkError] = useState('');

  const [checklist, setChecklist] = useState<Array<{ text: string; checked: boolean }>>([
    { text: 'Kiểm tra hoạt động động cơ ổn định, không có tiếng gõ lạ', checked: false },
    { text: 'Hệ thống phanh hoạt động chuẩn xác, hành trình bàn đạp ga/phanh mượt mà', checked: false },
    { text: 'Các cảm biến điều khiển hoạt động chính xác, không còn mã lỗi phát sinh', checked: false },
    { text: 'Nội thất, khoang máy và thân xe đã được vệ sinh sạch sẽ', checked: false },
    { text: 'Phụ tùng cũ đã được thu hồi và bàn giao lại cho cố vấn dịch vụ', checked: false },
  ]);

  const showLocalToast = (text: string, type: 'success' | 'warning' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleCheck = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const isChecklistComplete = useMemo(() => {
    return checklist.every((item) => item.checked);
  }, [checklist]);

  const handleApprove = () => {
    if (!order) return;
    if (!isChecklistComplete) {
      showLocalToast('Vui lòng tích kiểm tra đầy đủ các hạng mục trước khi duyệt!', 'warning');
      return;
    }
    
    setOrder((prev) => prev ? { ...prev, status: 'APPROVED' } : null);
    setIsApproveOpen(false);
    showLocalToast('Đã xác nhận đạt chuẩn chất lượng thành công!');
    setTimeout(() => {
      navigate('/quality-control/service-orders');
    }, 1500);
  };

  const handleReject = () => {
    if (!order) return;
    if (reworkReason.trim().length < 10) {
      setReworkError('Lý do yêu cầu sửa lại phải dài tối thiểu 10 ký tự.');
      return;
    }

    setOrder((prev) =>
      prev ? { ...prev, status: 'REJECTED', reworkReason: reworkReason.trim() } : null
    );
    setIsRejectOpen(false);
    setReworkReason('');
    setReworkError('');
    showLocalToast('Đã từ chối chất lượng và yêu cầu kỹ thuật viên sửa lại!', 'warning');
    setTimeout(() => {
      navigate('/quality-control/service-orders');
    }, 1500);
  };

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
          <AlertCircle size={28} />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-bold text-slate-700 text-base">Không tìm thấy mã đơn dịch vụ</h3>
          <p className="text-xs text-slate-400">
            Dữ liệu xe hoàn thành không tồn tại hoặc đã được chuyển giao sang công đoạn khác.
          </p>
          <button
            onClick={() => navigate('/quality-control/service-orders')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E4D40] text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            <ArrowLeft size={14} />
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const totalPartsCost = order.partsUsed.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalServicesCost = order.services.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = totalPartsCost + totalServicesCost;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fadeIn text-left">
      {/* Toast feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 16, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-0 left-1/2 z-50 transform -translate-x-1/2 flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 text-sm font-semibold"
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="text-rose-400" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/quality-control/service-orders')}
            className="p-2 border border-slate-200 text-slate-500 hover:text-[#0E4D40] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-[#0E4D40]">
                Chi tiết sửa chữa: {order.id}
              </h1>
              {order.status === 'PENDING_QC' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700">
                  Chờ KCS duyệt
                </span>
              )}
              {order.status === 'APPROVED' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                  Đạt chất lượng
                </span>
              )}
              {order.status === 'REJECTED' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700">
                  Yêu cầu sửa lại
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 block mt-0.5">Xe đã bàn giao hoàn thành sửa chữa bởi kỹ thuật viên.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Order & Repair Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#0E4D40] font-bold">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5F0] flex items-center justify-center text-[#0E4D40] shrink-0">
                  <Car size={16} />
                </div>
                <h3 className="text-sm font-display text-slate-800">Thông tin phương tiện</h3>
              </div>
              <div className="text-xs space-y-3 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Biển số xe:</span>
                  <span className="font-bold text-slate-700">{order.vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hãng xe & Dòng xe:</span>
                  <span className="font-bold text-slate-700">{order.vehicleBrand} {order.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Đời xe (Năm sx):</span>
                  <span className="font-bold text-slate-700">{order.vehicleYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Màu sắc:</span>
                  <span className="font-bold text-slate-700">{order.vehicleColor}</span>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#0E4D40] font-bold">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5F0] flex items-center justify-center text-[#0E4D40] shrink-0">
                  <User size={16} />
                </div>
                <h3 className="text-sm font-display text-slate-800">Thông tin khách hàng</h3>
              </div>
              <div className="text-xs space-y-3 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tên khách hàng:</span>
                  <span className="font-bold text-slate-700">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-bold text-slate-700">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-slate-700">{order.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kỹ thuật viên phụ trách:</span>
                  <span className="font-bold text-slate-700">{order.technicianName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Services and Spare Parts Used */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 text-[#0E4D40] font-bold border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5F0] flex items-center justify-center text-[#0E4D40] shrink-0">
                <Wrench size={16} />
              </div>
              <h3 className="text-sm font-display text-slate-800">Hạng mục công việc & Vật tư đã thay thế</h3>
            </div>

            {/* List of completed services */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gói dịch vụ đã thực hiện</span>
              <div className="divide-y divide-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                {order.services.map((svc, idx) => (
                  <div key={idx} className="p-3.5 flex justify-between items-center text-xs bg-slate-50/50 hover:bg-slate-50">
                    <span className="font-bold text-slate-700">{svc.name}</span>
                    <span className="font-semibold text-slate-900">{svc.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spare Parts used list */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Phụ tùng & Vật tư thay thế</span>
              {order.partsUsed.length === 0 ? (
                <div className="p-4 text-center bg-slate-50/30 text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs">
                  Không sử dụng phụ tùng thay thế.
                </div>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="p-3 pl-4">Tên phụ tùng</th>
                        <th className="p-3 text-center">Số lượng</th>
                        <th className="p-3 text-right">Đơn giá</th>
                        <th className="p-3 pr-4 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                      {order.partsUsed.map((part, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/30">
                          <td className="p-3 pl-4 font-semibold text-slate-700">{part.name}</td>
                          <td className="p-3 text-center font-bold text-slate-800">{part.quantity}</td>
                          <td className="p-3 text-right">{part.price.toLocaleString('vi-VN')}đ</td>
                          <td className="p-3 pr-4 text-right font-semibold text-slate-900">{(part.price * part.quantity).toLocaleString('vi-VN')}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total Billing estimate */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Tổng chi phí sửa chữa ước tính (cả VAT):</span>
              <span className="text-base font-black text-[#F9A11B] font-display">{totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Section 3: Technician Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-[#0E4D40] font-bold">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5F0] flex items-center justify-center text-[#0E4D40] shrink-0">
                <FileText size={16} />
              </div>
              <h3 className="text-sm font-display text-slate-800">Ghi chú & Đánh giá của Kỹ thuật viên</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100 italic">
              "{order.notes}"
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium pl-1">
              <Calendar size={12} />
              <span>Thời điểm hoàn thành sửa chữa: {order.completionDate}</span>
            </div>
          </div>

          {/* Section 4: If Rejected, show previous reject reason */}
          {order.status === 'REJECTED' && order.reworkReason && (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-rose-800 font-bold">
                <XCircle size={18} />
                <h3 className="text-sm font-display">Lịch sử từ chối chất lượng & Yêu cầu khắc phục</h3>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed pl-7">
                {order.reworkReason}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: QC Checkbox List & Actions Panel */}
        <div className="space-y-8">
          {/* QC Inspection checklist */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-[#0E4D40] font-bold">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5F0] flex items-center justify-center text-[#0E4D40] shrink-0">
                <ShieldCheck size={16} />
              </div>
              <h3 className="text-sm font-display text-slate-800">Kiểm tra chất lượng (QC)</h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tích chọn từng hạng mục sau khi chạy thử xe thực tế và xác định công việc đạt tiêu chuẩn bàn giao:
            </p>

            <div className="space-y-3">
              {checklist.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    item.checked ? 'border-[#C4E8E0] bg-[#E8F5F0]/10' : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50'
                  }`}
                  onClick={() => handleToggleCheck(index)}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="mt-0.5 accent-[#0E4D40] rounded shrink-0 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700 leading-normal">
                    {item.text}
                  </span>
                </label>
              ))}
            </div>

            {/* Checklist progress tracker */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Tiến độ kiểm định:</span>
              <span className={`font-bold ${isChecklistComplete ? 'text-emerald-600' : 'text-slate-500'}`}>
                {checklist.filter((c) => c.checked).length} / {checklist.length} Hạng mục đạt
              </span>
            </div>
          </div>

          {/* Action buttons panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Thao tác phê duyệt</h4>
            
            {order.status === 'PENDING_QC' ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (!isChecklistComplete) {
                      showLocalToast('Vui lòng tích kiểm tra đầy đủ các hạng mục trước!', 'warning');
                      return;
                    }
                    setIsApproveOpen(true);
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    isChecklistComplete
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  <CheckCircle size={15} />
                  Xác nhận đạt chất lượng
                </button>
                <button
                  onClick={() => setIsRejectOpen(true)}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/10 transition-all cursor-pointer"
                >
                  <XCircle size={15} />
                  Từ chối chất lượng (Yêu cầu làm lại)
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 text-center rounded-xl text-xs text-slate-400 border border-slate-100">
                Đơn hàng đã được thẩm định chất lượng và đóng tiến trình.
              </div>
            )}
            
            <button
              onClick={() => navigate('/quality-control/service-orders')}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer block text-center"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM APPROVE MODAL */}
      <AnimatePresence>
        {isApproveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={() => setIsApproveOpen(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-sm w-full rounded-2xl shadow-xl border border-slate-100 p-6 z-10 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Xác nhận chất lượng sửa chữa</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bạn chắc chắn rằng phương tiện <span className="font-bold text-slate-700">{order.vehiclePlate}</span> đã đạt toàn bộ tiêu chuẩn của gara và có thể sẵn sàng bàn giao cho khách hàng?
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsApproveOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Duyệt hoàn thành
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM REJECT MODAL (Rework Reason) */}
      <AnimatePresence>
        {isRejectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={() => {
                setIsRejectOpen(false);
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
                  <h3 className="text-base font-bold text-slate-800">Từ chối chất lượng sửa chữa</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Yêu cầu kỹ thuật viên kiểm tra lỗi và khắc phục sửa chữa lại xe <span className="font-bold text-slate-700">{order.vehiclePlate}</span>.
                  </p>
                </div>
              </div>

              {/* Rework reason textarea */}
              <div className="mt-5 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                  Lý do từ chối & Yêu cầu khắc phục (bắt buộc)
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <textarea
                    rows={4}
                    placeholder="Nhập cụ thể các tiếng ồn, lỗi phanh, vết bẩn cabin, v.v. cần làm lại (tối thiểu 10 ký tự)..."
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
                    setIsRejectOpen(false);
                    setReworkReason('');
                    setReworkError('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Gửi yêu cầu làm lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
