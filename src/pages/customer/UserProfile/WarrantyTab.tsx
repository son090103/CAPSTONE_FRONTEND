import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Calendar, AlertCircle, Info, X, Check } from 'lucide-react';

interface WarrantyItem {
    id: string;
    vehicleName: string;
    vehiclePlate: string;
    partName: string;
    startDate: string;
    endDate: string;
    duration: string;
    status: 'Đang bảo hành' | 'Hết hạn';
}

interface QuotationItem {
    id: string;
    date: string;
    vehicleName: string;
    vehiclePlate: string;
    serviceName: string;
    cost: string;
    vat: string;
    total: string;
    status: 'Chờ phê duyệt' | 'Đã đồng ý' | 'Đã từ chối' | 'Hết hạn';
    details: string;
}

export default function WarrantyTab() {
    const { t } = useTranslation();

    const [warrantyList] = useState<WarrantyItem[]>([
        {
            id: 'WR-911-0089',
            vehicleName: 'Porsche 911 Carrera',
            vehiclePlate: '29A-123.45',
            partName: t('warranty.parts.oilFilter', 'Lọc nhớt chính hãng OEM'),
            startDate: '15/10/2023',
            endDate: '15/04/2024',
            duration: t('warranty.durations.sixMonths', '6 tháng'),
            status: 'Đang bảo hành'
        },
        {
            id: 'WR-M4-0125',
            vehicleName: 'BMW M4 Competition',
            vehiclePlate: '30H-999.88',
            partName: t('warranty.parts.brakePads', 'Má phanh Ceramic Pro'),
            startDate: '02/09/2023',
            endDate: '02/09/2024',
            duration: t('warranty.durations.twelveMonths', '12 tháng'),
            status: 'Đang bảo hành'
        },
        {
            id: 'WR-911-0050',
            vehicleName: 'Porsche 911 Carrera',
            vehiclePlate: '29A-123.45',
            partName: t('warranty.parts.cabinFilter', 'Lọc gió carbon điều hòa'),
            startDate: '20/01/2023',
            endDate: '20/07/2023',
            duration: t('warranty.durations.sixMonths', '6 tháng'),
            status: 'Hết hạn'
        }
    ]);

    const [quotations, setQuotations] = useState<QuotationItem[]>([
        {
            id: 'BG-2023-5819',
            date: '30/10/2023',
            vehicleName: 'Porsche 911 Carrera',
            vehiclePlate: '29A-123.45',
            serviceName: t('warranty.services.coolantPump', 'Thay Cụm Bơm Nước Làm Mát'),
            cost: '4.800.000đ',
            vat: '480.000đ',
            total: '5.280.000đ',
            status: 'Chờ phê duyệt',
            details: t('warranty.services.coolantPumpDesc', 'Phát hiện rò rỉ nước làm mát nhẹ quanh gioăng bơm nước khi kiểm tra tổng quát định kỳ. Khuyến nghị thay thế sớm để tránh quá nhiệt động cơ.')
        },
        {
            id: 'BG-2023-4912',
            date: '12/10/2023',
            vehicleName: 'BMW M4 Competition',
            vehiclePlate: '30H-999.88',
            serviceName: t('warranty.services.alignment', 'Cân Chỉnh Thước Lái & Đảo Lốp 3D'),
            cost: '800.000đ',
            vat: '80.000đ',
            total: '880.000đ',
            status: 'Đã đồng ý',
            details: t('warranty.services.alignmentDesc', 'Lốp xe có dấu hiệu mòn không đều. Khuyến nghị căn chỉnh thước lái bằng máy Hunter 3D và đảo lốp.')
        }
    ]);

    const [selectedQuote, setSelectedQuote] = useState<QuotationItem | null>(null);
    const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleQuoteAction = (quoteId: string, action: 'approve' | 'reject') => {
        setQuotations(prev =>
            prev.map(q => {
                if (q.id === quoteId) {
                    return {
                        ...q,
                        status: action === 'approve' ? 'Đã đồng ý' : 'Đã từ chối'
                    };
                }
                return q;
            })
        );

        if (selectedQuote && selectedQuote.id === quoteId) {
            setSelectedQuote(prev => prev ? { ...prev, status: action === 'approve' ? 'Đã đồng ý' : 'Đã từ chối' } : null);
        }

        setActionStatus({
            type: action === 'approve' ? 'success' : 'error',
            message: action === 'approve'
                ? t('warranty.approveSuccessAlert', 'Đồng ý báo giá thành công! Kỹ thuật viên sẽ liên hệ hẹn thời gian sửa chữa.')
                : t('warranty.rejectSuccessAlert', 'Đã từ chối báo giá dịch vụ.')
        });

        setTimeout(() => setActionStatus(null), 4000);
    };

    const getQuoteStatusLabel = (status: string) => {
        switch (status) {
            case 'Chờ phê duyệt':
                return t('warranty.statusPending', 'Chờ phê duyệt');
            case 'Đã đồng ý':
                return t('warranty.statusApproved', 'Đã đồng ý');
            case 'Đã từ chối':
                return t('warranty.statusRejected', 'Đã từ chối');
            case 'Hết hạn':
                return t('warranty.statusExpired', 'Hết hạn');
            default:
                return status;
        }
    };

    const getWarrantyStatusLabel = (status: string) => {
        switch (status) {
            case 'Đang bảo hành':
                return t('warranty.statusActive', 'Đang bảo hành');
            case 'Hết hạn':
                return t('warranty.statusExpired', 'Hết hạn');
            default:
                return status;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-left"
        >
            {/* Notification alert */}
            <AnimatePresence>
                {actionStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-3 shadow-md ${
                            actionStatus.type === 'success'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-red-50 border-red-100 text-red-700'
                        }`}
                    >
                        {actionStatus.type === 'success' ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                        <span>{actionStatus.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Part 1: Quotations / Approvals */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-display font-bold text-brand-blue tracking-tight">
                        {t('warranty.quotesTitle', 'Yêu Cầu Duyệt Báo Giá')}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {t('warranty.quotesDesc', 'Xem các phát sinh kỹ thuật được phát hiện trong quá trình kiểm tra xe và phê duyệt phương án xử lý.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quotations.map((quote) => (
                        <div
                            key={quote.id}
                            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                                quote.status === 'Chờ phê duyệt' ? 'border-brand-orange ring-1 ring-brand-orange/20' : 'border-gray-100'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <span className="font-mono font-bold text-xs text-brand-blue">{quote.id}</span>
                                        <h3 className="text-sm font-bold text-brand-blue mt-1 leading-tight">{quote.serviceName}</h3>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border shrink-0 ${
                                        quote.status === 'Chờ phê duyệt'
                                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                                            : quote.status === 'Đã đồng ý'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-gray-50 text-gray-400 border-gray-100'
                                    }`}>
                                        {getQuoteStatusLabel(quote.status)}
                                    </span>
                                </div>

                                <div className="text-[10px] text-gray-500 flex justify-between">
                                    <span>{t('history.vehicleLabel', 'Phương tiện:')} <strong>{quote.vehicleName}</strong></span>
                                    <span>{t('warranty.sentDate', 'Ngày gửi:')} <strong>{quote.date}</strong></span>
                                </div>

                                <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    {quote.details}
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-1">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                                        {t('warranty.estimatedCost', 'Tổng giá dự toán')}
                                    </span>
                                    <span className="text-base font-mono font-bold text-brand-orange">{quote.total}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedQuote(quote)}
                                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 font-bold text-[10px] rounded-lg text-gray-600 transition-all flex items-center gap-1"
                                    >
                                        <Info className="w-3.5 h-3.5" /> {t('common.details', 'Chi tiết')}
                                    </button>
                                    {quote.status === 'Chờ phê duyệt' && (
                                        <>
                                            <button
                                                onClick={() => handleQuoteAction(quote.id, 'reject')}
                                                className="p-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                                                title={t('warranty.rejectQuoteTooltip', 'Từ chối báo giá')}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleQuoteAction(quote.id, 'approve')}
                                                className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-brand-blue font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 shadow-xs"
                                            >
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> {t('warranty.approve', 'Đồng ý')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Part 2: Active Warranty Policies */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                    <h2 className="text-xl font-display font-bold text-brand-blue tracking-tight">
                        {t('warranty.infoTitle', 'Thông Tin Bảo Hành')}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {t('warranty.infoDesc', 'Theo dõi chính sách và thời hạn bảo hành cho các linh kiện đã được thay thế tại xưởng dịch vụ.')}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100 text-brand-blue font-bold text-[10px] uppercase tracking-wider">
                                    <th className="p-4">{t('warranty.policyId', 'Mã Bảo Hành')}</th>
                                    <th className="p-4">{t('warranty.partName', 'Linh Kiện')}</th>
                                    <th className="p-4">{t('history.vehicle', 'Xe')}</th>
                                    <th className="p-4">{t('warranty.activationDate', 'Ngày Kích Hoạt')}</th>
                                    <th className="p-4">{t('warranty.expirationDate', 'Hạn Bảo Hành')}</th>
                                    <th className="p-4">{t('warranty.duration', 'Thời Hạn')}</th>
                                    <th className="p-4">{t('history.status', 'Trạng Thái')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
                                {warrantyList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-mono font-bold text-brand-blue">{item.id}</td>
                                        <td className="p-4 font-bold text-brand-blue">{item.partName}</td>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-bold text-brand-blue">{item.vehicleName}</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">{item.vehiclePlate}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">{item.startDate}</td>
                                        <td className="p-4 font-mono font-bold">{item.endDate}</td>
                                        <td className="p-4">{item.duration}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                                                item.status === 'Đang bảo hành'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}>
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                {getWarrantyStatusLabel(item.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quotation Detail Modal */}
            <AnimatePresence>
                {selectedQuote && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedQuote(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-md w-full relative z-10 text-left flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 bg-brand-blue text-white flex justify-between items-center relative shrink-0">
                                <div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">
                                        {t('warranty.quoteDetailTitle', 'Chi tiết báo giá dự kiến')}
                                    </div>
                                    <h3 className="text-lg font-bold font-display mt-0.5">{selectedQuote.id}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedQuote(null)}
                                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-5 text-xs text-slate-600">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        {t('warranty.repairItem', 'Hạng mục sửa chữa')}
                                    </span>
                                    <div className="font-bold text-sm text-brand-blue">{selectedQuote.serviceName}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="space-y-1">
                                        <div className="text-gray-400">{t('history.vehicleLabel', 'Phương tiện:')}</div>
                                        <div className="font-bold text-brand-blue">{selectedQuote.vehicleName}</div>
                                        <div className="text-[10px] text-gray-400">{selectedQuote.vehiclePlate}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-gray-400">{t('history.invoiceDate', 'Ngày lập báo giá:')}</div>
                                        <div className="font-bold text-brand-blue flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                                            {selectedQuote.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        {t('warranty.techRecommendation', 'Lý do & Khuyến nghị của kỹ thuật viên')}
                                    </span>
                                    <p className="text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-medium">
                                        {selectedQuote.details}
                                    </p>
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-2 font-medium">
                                    <div className="flex justify-between">
                                        <span>{t('warranty.laborPartsCost', 'Chi phí linh kiện & nhân công:')}</span>
                                        <span>{selectedQuote.cost}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>{t('history.vat', 'Thuế VAT (10%):')}</span>
                                        <span>{selectedQuote.vat}</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-bold text-sm">
                                        <span className="text-brand-blue">{t('warranty.grandTotalEstimate', 'TỔNG DỰ TOÁN:')}</span>
                                        <span className="text-lg text-brand-orange font-mono">{selectedQuote.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 shrink-0">
                                {selectedQuote.status === 'Chờ phê duyệt' ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleQuoteAction(selectedQuote.id, 'reject');
                                                setSelectedQuote(null);
                                            }}
                                            className="flex-1 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all"
                                        >
                                            {t('warranty.reject', 'Từ chối')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleQuoteAction(selectedQuote.id, 'approve');
                                                setSelectedQuote(null);
                                            }}
                                            className="flex-1 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-brand-blue font-bold rounded-xl shadow-sm transition-all"
                                        >
                                            {t('warranty.approvePlan', 'Đồng ý phương án')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setSelectedQuote(null)}
                                        className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl transition-all text-center"
                                    >
                                        {t('history.close', 'Đóng')}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
