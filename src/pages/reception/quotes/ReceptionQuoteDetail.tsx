import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  User,
  CarFront,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileCheck,
  Ban,
  MessageSquareWarning,
  FileText,
} from 'lucide-react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import type { QuoteModel } from '../../../model/Quote';
import { getQuoteById, updateQuote } from './mockQuotesStore';

export default function ReceptionQuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<{
    showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  }>();

  const [quote, setQuote] = useState<QuoteModel | undefined>(undefined);
  const [services, setServices] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    if (id) {
      const q = getQuoteById(id);
      setQuote(q);
      if (q) {
        setServices(q.services.map(s => ({ ...s, selected: s.selected !== false })));
        setParts(q.parts.map(p => ({ ...p, selected: p.selected !== false })));
      }
    }
  }, [id]);

  if (!quote) {
    return (
      <div className="p-8 text-center text-slate-500 font-bold max-w-lg mx-auto">
        <AlertTriangle className="mx-auto mb-4 text-rose-500" size={40} />
        <p>Báo giá không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button
          onClick={() => navigate('/reception/quotes')}
          className="mt-4 px-4 py-2 bg-[#00285E] text-white rounded-xl text-sm font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const toggleService = (idx: number) => {
    if (quote.status !== 'pending') return;
    setServices(prev =>
      prev.map((s, i) => (i === idx ? { ...s, selected: !s.selected } : s))
    );
  };

  const togglePart = (idx: number) => {
    if (quote.status !== 'pending') return;
    setParts(prev =>
      prev.map((p, i) => (i === idx ? { ...p, selected: !p.selected } : p))
    );
  };

  const currentLaborCost = services.reduce((sum, s) => sum + (s.selected !== false ? s.laborCost : 0), 0);
  const currentPartsCost = parts.reduce((sum, p) => sum + (p.selected !== false ? p.total : 0), 0);
  const currentTotalAmount = currentLaborCost + currentPartsCost;

  const hasSelectedItems = services.some(s => s.selected !== false) || parts.some(p => p.selected !== false);

  const confirmApprove = () => {
    if (!quote || !hasSelectedItems) return;
    const updatedQuote: QuoteModel = {
      ...quote,
      services: services.map(s => ({ name: s.name, laborCost: s.laborCost, selected: s.selected })),
      parts: parts.map(p => ({ name: p.name, quantity: p.quantity, unit: p.unit, unitPrice: p.unitPrice, total: p.total, selected: p.selected })),
      laborCost: currentLaborCost,
      partsCost: currentPartsCost,
      totalAmount: currentTotalAmount,
      status: 'approved',
      approvedBy: 'Lễ tân tiếp nhận',
      approvedDate: new Date().toISOString(),
    };
    setQuote(updatedQuote);
    updateQuote(quote.id, updatedQuote);
    setShowApproveConfirmModal(false);
    showToast('Phê duyệt báo giá thành công!', 'success');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim() || !quote) return;

    const updatedQuote: QuoteModel = {
      ...quote,
      status: 'rejected',
      rejectionReason: rejectReason,
    };
    setQuote(updatedQuote);
    updateQuote(quote.id, updatedQuote);
    setShowRejectModal(false);
    setRejectReason('');
    showToast('Từ chối báo giá thành công!', 'warning');
  };

  const getStatusBadge = (status: QuoteModel['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1.5">
            <Clock size={12} />
            <span>Chờ khách hàng / Lễ tân duyệt</span>
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle size={12} />
            <span>Đã được phê duyệt</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1.5">
            <XCircle size={12} />
            <span>Đã từ chối báo giá</span>
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
      {/* Back & Quick Print bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/reception/quotes')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách</span>
        </button>

        <button
          onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-all text-xs"
        >
          <Printer size={14} />
          <span>In báo giá bản cứng</span>
        </button>
      </div>

      {/* Main Quote Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-8">
        {/* Info Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Dự toán sửa chữa</span>
              <span>•</span>
              <button
                onClick={() => navigate(`/reception/service-orders/${quote.serviceOrderId}`)}
                className="text-[#00285E] hover:underline flex items-center gap-0.5 normal-case font-extrabold"
                title="Xem chi tiết Hóa đơn dịch vụ"
              >
                <FileText size={10} />
                <span>SO: {quote.serviceOrderId}</span>
              </button>
              {quote.comboName && (
                <>
                  <span>•</span>
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[9px] font-extrabold border border-amber-200 normal-case">
                    Combo: {quote.comboName}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-[#00285E] tracking-tight">Chi tiết Báo giá {quote.id}</h1>
              {getStatusBadge(quote.status)}
            </div>
          </div>
          <div className="text-left sm:text-right text-xs font-semibold text-slate-400">
            <span>Ngày lập báo giá:</span>
            <span className="text-slate-700 block font-bold mt-0.5">
              {new Date(quote.createdAt).toLocaleDateString('vi-VN')} {new Date(quote.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Customer & Vehicle Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm font-semibold text-slate-600">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <User size={14} className="text-[#00285E]" />
              <span>Thông tin khách hàng</span>
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Tên khách</span>
                <span className="text-slate-800">{quote.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số điện thoại</span>
                <span>{quote.customerPhone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <CarFront size={14} className="text-[#00285E]" />
              <span>Thông tin xe tiếp nhận</span>
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Biển kiểm soát</span>
                <span className="text-slate-800 font-extrabold">{quote.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dòng xe</span>
                <span>{quote.vehicleModel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-[#00285E] text-sm uppercase tracking-wider flex items-center gap-2">
            <span>I. Công dịch vụ kỹ thuật</span>
          </h3>
          <div className="border border-slate-200/60 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Nội dung công việc</th>
                  <th className="px-5 py-3 text-right">Chi phí nhân công</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {services.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      {quote.status === 'pending' ? (
                        <input
                          type="checkbox"
                          checked={item.selected !== false}
                          onChange={() => toggleService(idx)}
                          className="accent-[#00285E] rounded cursor-pointer w-4 h-4"
                        />
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          item.selected !== false
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}>
                          {item.selected !== false ? 'Đồng ý' : 'Bỏ qua'}
                        </span>
                      )}
                      <span className="font-bold text-slate-800">{item.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.laborCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parts Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-[#00285E] text-sm uppercase tracking-wider flex items-center gap-2">
            <span>II. Phụ tùng / Vật tư thay thế</span>
          </h3>
          <div className="border border-slate-200/60 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Tên phụ tùng vật tư</th>
                  <th className="px-5 py-3 text-center">Số lượng</th>
                  <th className="px-5 py-3 text-right">Đơn giá</th>
                  <th className="px-5 py-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {parts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-4 text-center text-slate-400 font-bold">
                      Không có phụ tùng thay thế.
                    </td>
                  </tr>
                ) : (
                  parts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        {quote.status === 'pending' ? (
                          <input
                            type="checkbox"
                            checked={item.selected !== false}
                            onChange={() => togglePart(idx)}
                            className="accent-[#00285E] rounded cursor-pointer w-4 h-4"
                          />
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            item.selected !== false
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-50 text-slate-400 border border-slate-200'
                          }`}>
                            {item.selected !== false ? 'Đồng ý' : 'Bỏ qua'}
                          </span>
                        )}
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-900 font-bold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Summary Box */}
        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <div className="w-full sm:w-80 space-y-3.5 text-sm font-semibold text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Chi phí nhân công (I)</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentLaborCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Chi phí phụ tùng (II)</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPartsCost)}</span>
            </div>
            <div className="flex justify-between items-center pt-3.5 border-t border-dashed border-slate-200">
              <span className="text-slate-850 font-bold text-base">Tổng giá dự toán</span>
              <span className="text-2xl font-black text-[#00285E]">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentTotalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decisions or Audits panels */}
      {quote.status === 'pending' ? (
        // Pending Decisions Action Row
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-850">Đợi duyệt báo giá</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Hãy trao đổi với chủ xe hoặc xác nhận phê duyệt nội bộ từ cấp quản lý.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all text-sm"
            >
              <Ban size={16} />
              <span>Từ chối báo giá</span>
            </button>
            <button
              onClick={() => setShowApproveConfirmModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00285E] text-white hover:bg-[#00285E]/90 font-bold transition-all text-sm shadow-md"
            >
              <FileCheck size={16} />
              <span>Phê duyệt báo giá</span>
            </button>
          </div>
        </div>
      ) : (
        // Approved/Rejected Status Block Display
        <div
          className={`p-5 rounded-2xl border flex items-start gap-4 ${
            quote.status === 'approved'
              ? 'bg-emerald-50/40 border-emerald-200 text-emerald-800'
              : 'bg-rose-50/40 border-rose-200 text-rose-800'
          }`}
        >
          {quote.status === 'approved' ? (
            <>
              <CheckCircle className="shrink-0 text-emerald-500 mt-0.5" size={20} />
              <div className="space-y-1 text-sm font-semibold text-emerald-700">
                <p className="font-extrabold text-slate-800">Thông tin phê duyệt</p>
                <p className="text-xs">Người duyệt: {quote.approvedBy || 'Chưa cập nhật'}</p>
                {quote.approvedDate && (
                  <p className="text-xs">
                    Thời gian duyệt: {new Date(quote.approvedDate).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <MessageSquareWarning className="shrink-0 text-rose-500 mt-0.5" size={20} />
              <div className="space-y-1 text-sm font-semibold text-rose-700">
                <p className="font-extrabold text-slate-850">Lý do từ chối báo giá</p>
                <p className="text-xs bg-white/60 p-3 rounded-xl border border-rose-100 text-slate-700 mt-2 font-medium leading-relaxed">
                  {quote.rejectionReason || 'Không có lý do chi tiết.'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reject Modal dialog (mandatory rejectionReason) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setShowRejectModal(false)}
          ></div>

          {/* Modal Container */}
          <form
            onSubmit={handleRejectSubmit}
            className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-5"
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <XCircle className="text-rose-500" size={20} />
                <span>Từ chối báo giá</span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Vui lòng điền lý do từ chối. Lý do này là bắt buộc để hỗ trợ kỹ thuật viên kiểm tra hoặc điều chỉnh lại.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Lý do từ chối <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Ví dụ: Khách hàng yêu cầu bỏ thay phuộc trước, chỉ làm phần cân chỉnh..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium text-slate-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!rejectReason.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all text-xs text-white ${
                  rejectReason.trim()
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/10'
                    : 'bg-rose-305 bg-slate-300 cursor-not-allowed'
                }`}
              >
                Xác nhận từ chối
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Approve Confirmation Modal */}
      {showApproveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setShowApproveConfirmModal(false)}></div>
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-5">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                <FileCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Phê duyệt Báo giá {quote.id}</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed px-2">
                Xác nhận duyệt báo giá này cho xe <strong className="text-slate-750">{quote.vehiclePlate}</strong> với{' '}
                <strong className="text-emerald-600 font-bold">{services.filter(s => s.selected !== false).length} dịch vụ</strong> và{' '}
                <strong className="text-emerald-600 font-bold">{parts.filter(p => p.selected !== false).length} phụ tùng/vật tư</strong> được chọn.
              </p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-left font-semibold text-slate-650">
                <div className="flex justify-between">
                  <span>Chi phí nhân công:</span>
                  <span className="text-slate-800 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentLaborCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chi phí phụ tùng:</span>
                  <span className="text-slate-800 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPartsCost)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 text-sm font-bold">
                  <span className="text-slate-850">Tổng thanh toán duyệt:</span>
                  <span className="text-[#00285E] font-black">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentTotalAmount)}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-medium leading-relaxed px-2">
                Hệ thống sẽ tự động cập nhật trạng thái hóa đơn dịch vụ tương ứng sang <strong className="text-emerald-600">Đang sửa chữa</strong> và loại bỏ các hạng mục không được phê duyệt.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowApproveConfirmModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmApprove}
                className="flex-1 px-5 py-2.5 rounded-xl bg-[#00285E] hover:bg-[#00285E]/90 text-white font-bold transition-all text-xs shadow-md shadow-blue-900/10"
              >
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Print Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-fade-in" onClick={() => setShowPrintModal(false)}></div>
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 w-full max-w-3xl space-y-6 my-8 z-10 max-h-[90vh] overflow-y-auto">
            
            {/* Printable area */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-6 text-slate-800 print:border-0 print:p-0">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-850 pb-4">
                <div>
                  <h2 className="text-lg font-black uppercase text-[#00285E] tracking-wider">AGM INTELLIGENT GARA</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Địa chỉ: 123 Đường Số 1, Phường Tân Phong, Quận 7, TP. HCM</p>
                  <p className="text-[10px] text-slate-400 font-medium">Hotline: 1900 6789 - Website: agmgarage.vn</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-slate-800">PHIẾU BÁO GIÁ</h2>
                  <p className="text-xs font-bold text-slate-650">Số: {quote.id}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Ngày: {new Date(quote.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Client and Car info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p><span className="text-slate-450 font-semibold">Khách hàng:</span> <strong className="text-slate-800">{quote.customerName}</strong></p>
                  <p><span className="text-slate-450 font-semibold">Điện thoại:</span> <span className="font-bold text-slate-800">{quote.customerPhone}</span></p>
                </div>
                <div className="space-y-1">
                  <p><span className="text-slate-450 font-semibold">Biển số xe:</span> <strong className="text-slate-850">{quote.vehiclePlate}</strong></p>
                  <p><span className="text-slate-450 font-semibold">Dòng xe:</span> <span className="font-bold text-slate-800">{quote.vehicleModel}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                {/* Services */}
                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase text-[#00285E]">I. Nội dung Công việc & dịch vụ kỹ thuật</p>
                  <table className="w-full text-left border-collapse text-[11px] border border-slate-200">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[9px]">
                        <th className="px-3 py-2 border-r border-slate-200">Nội dung</th>
                        <th className="px-3 py-2 text-right">Chi phí nhân công</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {services.filter(s => s.selected !== false).length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-3 py-4 text-center text-slate-450 italic font-semibold">
                            Không có công việc dịch vụ nào được phê duyệt.
                          </td>
                        </tr>
                      ) : (
                        services.filter(s => s.selected !== false).map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-800">{item.name}</td>
                            <td className="px-3 py-2 text-right text-slate-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.laborCost)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Parts */}
                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase text-[#00285E]">II. Phụ tùng / Vật tư thay thế</p>
                  <table className="w-full text-left border-collapse text-[11px] border border-slate-200">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[9px]">
                        <th className="px-3 py-2 border-r border-slate-200">Tên phụ tùng</th>
                        <th className="px-3 py-2 border-r border-slate-200 text-center">SL</th>
                        <th className="px-3 py-2 border-r border-slate-200 text-center">ĐVT</th>
                        <th className="px-3 py-2 border-r border-slate-200 text-right">Đơn giá</th>
                        <th className="px-3 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {parts.filter(p => p.selected !== false).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-4 text-center text-slate-450 italic font-semibold">
                            Không có phụ tùng thay thế nào được phê duyệt.
                          </td>
                        </tr>
                      ) : (
                        parts.filter(p => p.selected !== false).map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-800">{item.name}</td>
                            <td className="px-3 py-2 border-r border-slate-200 text-center">{item.quantity}</td>
                            <td className="px-3 py-2 border-r border-slate-200 text-center">{item.unit}</td>
                            <td className="px-3 py-2 border-r border-slate-200 text-right">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-900 font-bold">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Totals */}
              <div className="flex justify-end border-t border-slate-200 pt-4">
                <table className="w-64 text-xs font-semibold">
                  <tbody>
                    <tr>
                      <td className="py-1 text-slate-400">Chi phí nhân công:</td>
                      <td className="py-1 text-right text-slate-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentLaborCost)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-400">Chi phí phụ tùng:</td>
                      <td className="py-1 text-right text-slate-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPartsCost)}</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="py-2 text-sm font-bold text-slate-800">Tổng cộng thanh toán:</td>
                      <td className="py-2 text-right text-sm font-black text-[#00285E]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentTotalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-xs"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Đang tiến hành in báo giá...', 'success');
                  setShowPrintModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#00285E] hover:bg-[#00285E]/90 text-white font-bold transition-all text-xs shadow-md shadow-blue-900/10"
              >
                Xác nhận in bản cứng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
