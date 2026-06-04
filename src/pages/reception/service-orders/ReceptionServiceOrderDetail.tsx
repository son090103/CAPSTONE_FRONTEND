import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  Car,
  Gauge,
  Wrench,
  StickyNote,
  XCircle,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { SO_STATUS_CONFIG } from './ReceptionServiceOrderList';

// ========== MOCK DATABASE (sẽ thay bằng API call) ==========
const MOCK_SERVICE_ORDERS: Record<string, any> = {
  'SO-001': {
    id: 'SO-001',
    appointmentId: 'APT-001',
    customerId: 'C001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901 234 567',
    customerEmail: 'an.nguyen@email.com',
    vehiclePlate: '51A-123.45',
    vehicleModel: 'Toyota Camry 2.5Q',
    vehicleYear: 2020,
    vehicleMileage: 45000,
    services: [
      { id: 'SV001', name: 'Bảo dưỡng định kỳ cấp 1', price: 500000, category: 'Bảo dưỡng' },
      { id: 'SV003', name: 'Thay dầu động cơ Castrol', price: 650000, category: 'Dầu nhớt' },
    ],
    status: 'in_progress',
    notes: 'Khách yêu cầu kiểm tra kỹ giảm xóc trước bên trái do có tiếng kêu lọc cọc.',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T09:30:00',
  },
  'SO-002': {
    id: 'SO-002',
    customerId: 'C002',
    customerName: 'Trần Thị Bình',
    customerPhone: '0912 345 678',
    customerEmail: 'binh.tran@email.com',
    vehiclePlate: '30H-456.78',
    vehicleModel: 'Honda City RS',
    vehicleYear: 2022,
    vehicleMileage: 22000,
    services: [
      { id: 'SV003', name: 'Thay dầu động cơ Castrol', price: 650000, category: 'Dầu nhớt' },
      { id: 'SV005', name: 'Vệ sinh kim phun điện tử', price: 1200000, category: 'Động cơ' },
    ],
    status: 'completed',
    createdBy: 'Nguyễn Minh Quân (Lễ tân)',
    createdAt: '2026-06-02T10:15:00',
  },
  'SO-003': {
    id: 'SO-003',
    customerId: 'C009',
    customerName: 'Phạm Minh Hùng',
    customerPhone: '0909 888 777',
    customerEmail: 'hung.pham@email.com',
    vehiclePlate: '51G-888.88',
    vehicleModel: 'Mercedes-Benz C200',
    vehicleYear: 2019,
    vehicleMileage: 15000,
    services: [
      { id: 'SV002', name: 'Bảo dưỡng định kỳ cấp 2', price: 1200000, category: 'Bảo dưỡng' },
      { id: 'SV004', name: 'Cân chỉnh thước lái 3D', price: 600000, category: 'Sửa chữa gầm' },
    ],
    status: 'waiting_approval',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T11:00:00',
  },
  'SO-004': {
    id: 'SO-004',
    customerId: 'C010',
    customerName: 'Lê Văn Nam',
    customerPhone: '0977 123 456',
    customerEmail: 'nam.le@email.com',
    vehiclePlate: '30A-999.99',
    vehicleModel: 'Mazda 3 Premium',
    vehicleYear: 2018,
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
};

export default function ReceptionServiceOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useOutletContext<{
    showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  }>();

  // Load Order (Stateful mock for cancellation simulation)
  const [order, setOrder] = useState<any>(id ? MOCK_SERVICE_ORDERS[id] : null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [incurredCost, setIncurredCost] = useState('150000'); // 150k default if in progress

  if (!order) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400">
        <AlertTriangle size={48} className="mb-4 text-amber-400" />
        <p className="text-lg font-semibold mb-1">Không tìm thấy hóa đơn dịch vụ</p>
        <p className="text-sm mb-4">Mã hóa đơn "{id}" không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button
          onClick={() => navigate('/reception/service-orders')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00285E] text-white rounded-xl text-sm font-bold"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusCfg = SO_STATUS_CONFIG[order.status];
  const StatusIcon = statusCfg.icon;

  const isAlreadyStarted = order.status !== 'draft' && order.status !== 'assigned';

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const getOrderTotal = () => {
    return order.services.reduce((sum: number, s: any) => sum + s.price, 0);
  };

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      showToast('Vui lòng điền lý do hủy đơn.', 'warning');
      return;
    }

    const costValue = isAlreadyStarted ? parseFloat(incurredCost) || 0 : 0;

    // Simulate database update
    const updatedOrder = {
      ...order,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'Lê lễ tân (Receptionist)',
      cancelReason: cancelReason,
      incurredCost: costValue,
    };

    setOrder(updatedOrder);
    setShowCancelModal(false);
    showToast(`Hủy hóa đơn dịch vụ ${order.id} thành công!`, 'success');
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/reception/service-orders')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-1">
              Chi tiết hóa đơn dịch vụ
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500">{order.id}</span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
              >
                <StatusIcon size={12} />
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {order.status !== 'cancelled' && order.status !== 'completed' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-bold transition-colors"
            >
              <XCircle size={16} />
              Hủy hóa đơn dịch vụ
            </button>
          )}
        </div>
      </div>

      {/* CANCELLED INFO CARD */}
      {order.status === 'cancelled' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-rose-800 flex items-center gap-2 uppercase tracking-widest">
            <XCircle size={16} />
            Thông tin hủy hóa đơn dịch vụ (Audit Log)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-rose-700">
            <div>
              <span className="text-[10px] text-rose-400 uppercase block">Người thực hiện hủy</span>
              <span className="text-sm font-bold">{order.cancelledBy || 'Lễ tân hệ thống'}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-400 uppercase block">Thời gian hủy</span>
              <span className="text-sm font-bold">
                {new Date(order.cancelledAt || order.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="text-[10px] text-rose-400 uppercase block">Lý do hủy</span>
              <p className="text-sm font-bold bg-white/70 border border-rose-100 rounded-lg p-2.5 mt-1 font-medium leading-relaxed">
                {order.cancelReason}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-rose-400 uppercase block">Chi phí phát sinh đã thu hồi</span>
              <span className="text-base font-extrabold text-rose-600 block mt-0.5">
                {formatPrice(order.incurredCost || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Calendar size={16} className="text-[#00285E]" />
            Thông tin hóa đơn dịch vụ
          </h2>
          <div className="space-y-3">
            <InfoRow label="Mã hóa đơn dịch vụ" value={order.id} />
            {order.appointmentId && <InfoRow label="Liên kết Lịch hẹn" value={order.appointmentId} highlight />}
            <InfoRow label="Người tạo tiếp nhận" value={order.createdBy} />
            <InfoRow label="Thời điểm tiếp nhận" value={new Date(order.createdAt).toLocaleString('vi-VN')} />
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <User size={16} className="text-[#00285E]" />
            Thông tin Khách hàng
          </h2>
          <div className="space-y-3">
            <InfoRow label="Họ và tên" value={order.customerName} />
            <InfoRow label="Số điện thoại" value={order.customerPhone} icon={<Phone size={14} className="text-slate-400" />} />
            <InfoRow label="Email" value={order.customerEmail || '—'} icon={<Mail size={14} className="text-slate-400" />} />
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Car size={16} className="text-[#00285E]" />
            Thông tin Xe
          </h2>
          <div className="space-y-3">
            <InfoRow label="Biển số" value={order.vehiclePlate} highlight />
            <InfoRow label="Dòng xe" value={order.vehicleModel} />
            <InfoRow label="Năm sản xuất" value={order.vehicleYear?.toString() || '—'} />
            <InfoRow label="Số km tiếp nhận" value={order.vehicleMileage ? `${order.vehicleMileage.toLocaleString('vi-VN')} km` : '—'} icon={<Gauge size={14} className="text-slate-400" />} />
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Wrench size={16} className="text-[#00285E]" />
              Hạng mục dịch vụ tiếp nhận
            </h2>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {order.services.map((service: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#00285E] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700">{service.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">{service.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#00285E]">
            <span>Tổng cộng (tạm tính):</span>
            <span className="text-base font-extrabold">{formatPrice(getOrderTotal())}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-widest">
            <StickyNote size={16} className="text-[#00285E]" />
            Ghi chú tiếp nhận
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">
            {order.notes}
          </p>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertTriangle size={22} className="text-rose-500" />
              Yêu cầu hủy hóa đơn dịch vụ
            </h3>

            {isAlreadyStarted ? (
              <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-xl p-3 text-xs leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertTriangle size={14} />
                  Chú ý: Xe đã bước vào sửa chữa!
                </p>
                <p>
                  Hóa đơn `{order.id}` hiện có trạng thái **{statusCfg.label}**. Theo quy định, nếu đã tháo lắp hoặc sửa một phần, bạn cần thu hồi chi phí phát sinh (ví dụ: công kiểm tra, phụ tùng đã bóc hộp, công tháo lắp).
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                Hóa đơn `{order.id}` chưa bắt đầu thực hiện sửa chữa. Huỷ đơn này sẽ không tính thêm chi phí phát sinh.
              </p>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Lý do hủy hóa đơn <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do chi tiết từ chối tiếp tục sửa chữa..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all resize-none"
              />
            </div>

            {isAlreadyStarted && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <DollarSign size={13} />
                  Chi phí phát sinh thu hồi (đ)
                </label>
                <input
                  type="number"
                  value={incurredCost}
                  onChange={(e) => setIncurredCost(e.target.value)}
                  placeholder="VD: 150000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-semibold"
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  (Bao gồm công kiểm tra, tháo lắp, phụ tùng hao hụt)
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Xác nhận hủy hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between py-1 border-b border-slate-100 last:border-0 pb-2.5 last:pb-0">
      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className={`text-sm font-bold text-right ${highlight ? 'text-[#00285E] bg-[#EDF3FF] px-2 py-0.5 rounded-md' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}
