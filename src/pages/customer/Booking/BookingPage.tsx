import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
    Calendar, Car, User, Settings,
    Check, ChevronRight, Phone, Clock, Edit2, ArrowLeft,
    Star
} from 'lucide-react';
import { COLORS } from '../../../components/share/Color';

interface ServiceItem {
    id: number;
    title: string;
    desc: string;
    price: string;
    numericPrice: number;
    badge?: string;
    rating: number;
    reviewCount: number;
    details?: string[];
    originalPrice?: string;
    discountPercentage?: number;
    promoText?: string;
}

export default function BookingPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [searchParams] = useSearchParams();
    
    // Form States
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(() => {
        const id = searchParams.get('serviceId');
        return id ? parseInt(id, 10) : null;
    });
    const [selectedSubItems, setSelectedSubItems] = useState<string[]>([]);
    
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    
    const [vehicleBrand, setVehicleBrand] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Generate random booking code once per submission success
    const bookingCode = useMemo(() => Math.floor(100000 + Math.random() * 900000), [isSuccess]);

    const steps = [
        { id: 1, label: t('booking.steps.service', 'Dịch vụ'), icon: <Settings size={20} /> },
        { id: 2, label: t('booking.steps.time', 'Thời gian'), icon: <Clock size={20} /> },
        { id: 3, label: t('booking.steps.vehicle', 'Thông tin xe'), icon: <Car size={20} /> },
        { id: 4, label: t('booking.steps.contact', 'Liên hệ'), icon: <User size={20} /> },
    ];

    const services: ServiceItem[] = [
        {
            id: 1,
            title: t('services.list.periodic.title', 'Bảo Dưỡng Định Kỳ'),
            desc: t('services.list.periodic.desc', 'Kiểm tra tổng quát và thay thế linh kiện hao mòn định kỳ để xe luôn vận hành êm ái.'),
            price: t('services.list.periodic.price', 'Từ 500.000đ'),
            numericPrice: 500000,
            originalPrice: t('services.list.periodic.originalPrice', 'Từ 550.000đ'),
            discountPercentage: 10,
            promoText: t('services.list.periodic.promoText', 'Tặng nước rửa kính cao cấp & kiểm tra lốp miễn phí'),
            badge: t('booking.services.popularBadge', 'Phổ biến'),
            rating: 4.9,
            reviewCount: 184,
            details: [
                t('services.list.periodic.details.0', 'Thay nhớt động cơ chính hãng phù hợp thông số xe.'),
                t('services.list.periodic.details.1', 'Kiểm tra và làm sạch lọc gió động cơ, lọc gió cabin.'),
                t('services.list.periodic.details.2', 'Kiểm tra hệ thống phanh, má phanh, đĩa phanh.'),
                t('services.list.periodic.details.3', 'Kiểm tra bình ắc quy và hệ thống chiếu sáng.'),
                t('services.list.periodic.details.4', 'Đọc lỗi lỗi hộp đen (OBD) bằng thiết bị chuyên dụng.')
            ]
        },
        {
            id: 2,
            title: t('services.list.engine.title', 'Sửa Chữa Động Cơ'),
            desc: t('services.list.engine.desc', 'Xử lý triệt để các vấn đề phức tạp của động cơ bởi các chuyên gia dày dạn kinh nghiệm.'),
            price: t('services.list.engine.price', 'Từ 1.200.000đ'),
            numericPrice: 1200000,
            originalPrice: t('services.list.engine.originalPrice', 'Từ 1.400.000đ'),
            discountPercentage: 15,
            promoText: t('services.list.engine.promoText', 'Giảm 15% gói vệ sinh kim phun buồng đốt đi kèm'),
            rating: 4.8,
            reviewCount: 96,
            details: [
                t('services.list.engine.details.0', 'Đo áp suất buồng đốt, kiểm tra tỉ số nén động cơ.'),
                t('services.list.engine.details.1', 'Xử lý hiện tượng rò rỉ dầu máy, hao nước làm mát.'),
                t('services.list.engine.details.2', 'Cân chỉnh cam, khắc phục tiếng gõ động cơ lạ.'),
                t('services.list.engine.details.3', 'Đại tu động cơ chuyên nghiệp theo tiêu chuẩn hãng.'),
                t('services.list.engine.details.4', 'Vệ sinh kim phun, họng hút và buồng đốt bằng máy chuyên dụng.')
            ]
        },
        {
            id: 3,
            title: t('services.list.tireBrake.title', 'Dịch Vụ Lốp & Phanh'),
            desc: t('services.list.tireBrake.desc', 'Đảm bảo an toàn tối đa với dịch vụ kiểm tra lốp, cân bằng động và bảo dưỡng hệ thống phanh.'),
            price: t('services.list.tireBrake.price', 'Từ 400.000đ'),
            numericPrice: 400000,
            originalPrice: t('services.list.tireBrake.originalPrice', 'Từ 500.000đ'),
            discountPercentage: 20,
            promoText: t('services.list.tireBrake.promoText', 'Miễn phí cân bằng động khi thay từ 2 lốp Michelin'),
            rating: 4.8,
            reviewCount: 112,
            details: [
                t('services.list.tireBrake.details.0', 'Cân chỉnh thước lái 3D tiên tiến nhất hiện nay.'),
                t('services.list.tireBrake.details.1', 'Cân bằng động lốp xe triệt tiêu hiện tượng rung vô lăng.'),
                t('services.list.tireBrake.details.2', 'Láng đĩa phanh trực tiếp không cần tháo rời.'),
                t('services.list.tireBrake.details.3', 'Thay mới má phanh chính hãng nhập khẩu.'),
                t('services.list.tireBrake.details.4', 'Kiểm tra toàn bộ đường ống dẫn dầu và cụm heo phanh.')
            ]
        },
        {
            id: 4,
            title: t('services.list.detailing.title', 'Chăm Sóc Nội Thất'),
            desc: t('services.list.detailing.desc', 'Làm sạch sâu, khử mùi và bảo dưỡng các bề mặt da, nhựa bên trong xe như mới.'),
            price: t('services.list.detailing.price', 'Từ 800.000đ'),
            numericPrice: 800000,
            originalPrice: t('services.list.detailing.originalPrice', 'Từ 900.000đ'),
            discountPercentage: 12,
            promoText: t('services.list.detailing.promoText', 'Tặng gói khử mùi cabin Ozon trị giá 200.000đ'),
            rating: 4.7,
            reviewCount: 75,
            details: [
                t('services.list.detailing.details.0', 'Dọn nội thất toàn diện, hút bụi và giặt thảm sàn.'),
                t('services.list.detailing.details.1', 'Vệ sinh bề mặt da ghế bằng dung dịch chuyên sâu bảo vệ da.'),
                t('services.list.detailing.details.2', 'Khử trùng hệ thống điều hòa và khử mùi ozon cabin.'),
                t('services.list.detailing.details.3', 'Dưỡng bóng táp-lô, táp-pi cửa chống lão hóa tia UV.'),
                t('services.list.detailing.details.4', 'Làm sạch trần nỉ và cốp sau tỉ mỉ.')
            ]
        },
        {
            id: 5,
            title: t('services.list.electronics.title', 'Chẩn Đoán Điện Tử'),
            desc: t('services.list.electronics.desc', 'Sử dụng máy quét chuyên dụng để phát hiện chính xác mọi lỗi hệ thống điện tử trên xe.'),
            price: t('services.list.electronics.price', 'Từ 300.000đ'),
            numericPrice: 300000,
            originalPrice: t('services.list.electronics.originalPrice', 'Từ 350.000đ'),
            discountPercentage: 15,
            promoText: t('services.list.electronics.promoText', 'Miễn phí chẩn đoán lỗi OBD nhanh bằng máy chuyên dụng'),
            rating: 4.9,
            reviewCount: 142,
            details: [
                t('services.list.electronics.details.0', 'Quét toàn bộ lỗi hệ thống điện thân xe, hộp điều khiển.'),
                t('services.list.electronics.details.1', 'Chẩn đoán lỗi cảm biến ABS, ESP, túi khí SRS.'),
                t('services.list.electronics.details.2', 'Kiểm tra tình trạng máy phát điện, máy khởi động.'),
                t('services.list.electronics.details.3', 'Cập nhật phần mềm hệ thống (ECU flashing) nếu có.'),
                t('services.list.electronics.details.4', 'Xóa các mã lỗi ảo phát sinh do sụt điện.')
            ]
        },
        {
            id: 6,
            title: t('services.list.rescue.title', 'Cứu Hộ 24/7'),
            desc: t('services.list.rescue.desc', 'Hỗ trợ khẩn cấp mọi lúc, mọi nơi khi xe gặp sự cố bất ngờ trên đường.'),
            price: t('services.list.rescue.price', 'Liên hệ'),
            numericPrice: 0,
            originalPrice: '',
            promoText: t('services.list.rescue.promoText', 'Hỗ trợ khẩn cấp 24/7 toàn khu vực nội thành'),
            badge: t('booking.services.emergencyBadge', 'Khẩn cấp'),
            rating: 5.0,
            reviewCount: 310,
            details: [
                t('services.list.rescue.details.0', 'Hỗ trợ kích nổ ắc quy tại chỗ nhanh chóng.'),
                t('services.list.rescue.details.1', 'Hỗ trợ thay lốp dự phòng khẩn cấp.'),
                t('services.list.rescue.details.2', 'Cung cấp nhiên liệu khẩn cấp trên đường.'),
                t('services.list.rescue.details.3', 'Xe cẩu kéo chuyên dụng đưa về trung tâm gần nhất.'),
                t('services.list.rescue.details.4', 'Đội ngũ cứu hộ túc trực sẵn sàng 24 giờ mỗi ngày.')
            ]
        }
    ];

    const timeSlots = [
        { time: '08:00', label: t('booking.timeSlots.morning', 'Sáng') },
        { time: '09:30', label: t('booking.timeSlots.morning', 'Sáng') },
        { time: '11:00', label: t('booking.timeSlots.morning', 'Sáng') },
        { time: '13:30', label: t('booking.timeSlots.afternoon', 'Chiều') },
        { time: '15:00', label: t('booking.timeSlots.afternoon', 'Chiều') },
        { time: '16:30', label: t('booking.timeSlots.afternoon', 'Chiều') },
    ];

    const selectedService = services.find(s => s.id === selectedServiceId);

    useEffect(() => {
        if (selectedServiceId) {
            const service = services.find(s => s.id === selectedServiceId);
            if (service && service.details) {
                setSelectedSubItems(service.details);
            } else {
                setSelectedSubItems([]);
            }
        } else {
            setSelectedSubItems([]);
        }
    }, [selectedServiceId]);

    // Form validation helpers
    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 1:
                return selectedServiceId !== null;
            case 2:
                return bookingDate !== '' && bookingTime !== '';
            case 3:
                return vehicleBrand.trim() !== '' && vehicleModel.trim() !== '' && vehiclePlate.trim() !== '';
            case 4:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                return contactName.trim() !== '' && phoneRegex.test(contactPhone) && emailRegex.test(contactEmail);
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (!validateStep(step)) {
            alert(t('booking.alerts.validationError', 'Vui lòng điền đầy đủ và đúng thông tin yêu cầu của bước hiện tại.'));
            return;
        }
        if (step < 4) {
            setStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API network call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    const inputClass = 'w-full bg-[#F8FAFC] border border-blue-50/50 rounded-xl md:rounded-2xl p-2.5 md:p-4 text-xs md:text-sm outline-none transition-all focus:border-amber-400 focus:bg-white text-brand-blue';

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 text-center"
                >
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-inner">
                        <Check className="h-10 w-10 text-emerald-600" strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-brand-blue font-display">{t('booking.success.title', 'Đặt lịch thành công!')}</h2>
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed text-center">
                            {t('booking.success.desc', 'Mã đặt lịch của bạn là {{code}}. Chúng tôi đã gửi email xác nhận chi tiết lịch hẹn của bạn. Bộ phận chăm sóc khách hàng sẽ liên hệ với bạn trong vòng 15 phút.', { code: `AGM-${bookingCode}` })}
                        </p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left text-xs space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">{t('booking.summary.serviceLabel', 'Dịch vụ:')}</span>
                            <span className="font-bold text-brand-blue">{selectedService?.title}</span>
                        </div>
                        {selectedSubItems.length > 0 && (
                            <div className="pl-3 border-l-2 border-[#F9A11B] py-0.5 space-y-1 my-1">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {t('booking.summary.itemsLabel', 'Hạng mục thực hiện:')}
                                </div>
                                {selectedSubItems.map((item, idx) => (
                                    <div key={idx} className="text-slate-600 font-medium text-[11px] leading-relaxed">
                                        • {item}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-400">{t('booking.summary.timeLabel', 'Thời gian:')}</span>
                            <span className="font-bold text-brand-blue">{bookingTime} - {bookingDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">{t('booking.summary.plateLabel', 'Biển số xe:')}</span>
                            <span className="font-bold text-brand-blue">{vehiclePlate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">{t('booking.summary.customerLabel', 'Khách hàng:')}</span>
                            <span className="font-bold text-brand-blue">{contactName}</span>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-2">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full py-3 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-blue/90 transition-all cursor-pointer"
                        >
                            {t('booking.success.goHome', 'Về trang chủ')}
                        </button>
                        <button
                            onClick={() => {
                                setStep(1);
                                setSelectedServiceId(null);
                                setBookingDate('');
                                setBookingTime('');
                                setVehicleBrand('');
                                setVehicleModel('');
                                setVehiclePlate('');
                                setContactName('');
                                setContactPhone('');
                                setContactEmail('');
                                setIsSuccess(false);
                            }}
                            className="w-full py-3 bg-slate-50 border border-slate-200 text-gray-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                            {t('booking.success.bookAnother', 'Đặt dịch vụ khác')}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 text-left" style={{ backgroundColor: '#F8F9FF' }}>
            {/* ── HEADER ───────────────────────────────────────── */}
            <section className="pt-12 pb-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-display mb-4 text-brand-blue">
                        {t('booking.heroTitle', 'Đặt lịch dịch vụ')}
                    </h1>
                    <p className="max-w-2xl text-gray-500 leading-relaxed text-left">
                        {t('booking.heroDesc', 'Trải nghiệm quy trình dịch vụ bảo dưỡng tối giản, đặt lịch trong 1 phút để nhận hỗ trợ kỹ thuật tận tâm tại hệ thống AGM Intelligent.')}
                    </p>

                    {/* ── STEP INDICATOR ── */}
                    <div className="mt-16 flex items-center justify-between max-w-3xl mx-auto relative px-4">
                        {/* Track */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0 bg-gray-200" />
                        {/* Progress */}
                        <div
                            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: `${(step - 1) * 33.33}%`, backgroundColor: COLORS.orange }}
                        />

                        {steps.map((s) => {
                            const isDone = s.id < step;
                            const isActive = s.id === step;
                            return (
                                <div key={s.id} className="relative z-10 flex flex-col items-center">
                                    <div
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300 shadow-sm border border-slate-100 animate-none"
                                        style={{
                                            backgroundColor: isDone || isActive ? COLORS.orange : '#FFFFFF',
                                            color: isDone || isActive ? COLORS.navy : '#8A96B3',
                                            transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                    >
                                        {isDone ? <Check size={18} strokeWidth={3} /> : s.id}
                                    </div>
                                    <span
                                        className="text-[9px] md:text-[10px] font-bold mt-3 tracking-wider uppercase hidden sm:inline"
                                        style={{ color: isActive ? COLORS.navy : '#8A96B3' }}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── MAIN FORM CONTAINER ──────────────────────── */}
                    <div className="lg:col-span-2 space-y-8 text-left">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: SELECT SERVICE */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-10 rounded-3xl bg-white border border-gray-100 shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                                            <Settings size={20} />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-brand-blue font-display">{t('booking.step1.title', 'Chọn dịch vụ bảo dưỡng')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map((service) => {
                                            const isSelected = selectedServiceId === service.id;
                                            return (
                                                <div
                                                    key={service.id}
                                                    onClick={() => setSelectedServiceId(service.id)}
                                                    className="relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col group text-left"
                                                    style={{
                                                        borderColor: isSelected ? COLORS.orange : '#F1F5F9',
                                                        backgroundColor: isSelected ? 'rgba(249,161,27,0.03)' : '#FFFFFF',
                                                        boxShadow: isSelected ? '0 10px 20px rgba(249,161,27,0.04)' : 'none'
                                                    }}
                                                >
                                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 flex-wrap justify-end max-w-[70%]">
                                                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-xs shrink-0">
                                                            <Star size={10} fill="currentColor" className="text-amber-500 shrink-0" />
                                                            <span>{service.rating}</span>
                                                            <span className="text-gray-400 font-medium">({service.reviewCount})</span>
                                                        </div>
                                                        {service.discountPercentage && (
                                                            <div className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg shadow-xs shrink-0">
                                                                {t('services.discountLabel', 'Giảm {{percent}}%', { percent: service.discountPercentage })}
                                                            </div>
                                                        )}
                                                        {service.badge && (
                                                            <div className="text-[9px] font-bold px-2 py-0.5 rounded-lg shrink-0"
                                                                style={{ backgroundColor: COLORS.orange, color: COLORS.navy }}>
                                                                {service.badge}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 shadow-sm">
                                                        <Settings size={18} className="text-gray-400" />
                                                    </div>

                                                    <h3 className="text-base font-bold mb-1 text-brand-blue">{service.title}</h3>
                                                    <p className="text-xs text-gray-400 mb-2 leading-relaxed flex-grow">
                                                        {service.desc}
                                                    </p>

                                                    {service.promoText && (
                                                        <div className="mb-4 p-2 bg-amber-50/50 rounded-xl border border-amber-100/50 flex items-start gap-1.5 text-[10px] text-amber-700 font-semibold text-left">
                                                            <span className="shrink-0">🎁</span>
                                                            <span className="line-clamp-2 leading-tight">{service.promoText}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <div className="text-[9px] font-bold uppercase mb-0.5 text-gray-400">{t('booking.step1.estimatedPrice', 'Giá dự kiến')}</div>
                                                            <div className="flex items-baseline gap-1.5">
                                                                {service.originalPrice && (
                                                                    <span className="text-xs text-gray-400 line-through font-medium">{service.originalPrice}</span>
                                                                )}
                                                                <span className="text-base font-bold text-brand-orange">{service.price}</span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0"
                                                            style={{
                                                                borderColor: isSelected ? COLORS.orange : '#CBD5E1',
                                                                backgroundColor: isSelected ? COLORS.orange : 'transparent',
                                                                color: isSelected ? COLORS.navy : 'transparent',
                                                            }}
                                                        >
                                                            <Check size={12} strokeWidth={4} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {selectedService && selectedService.details && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8 pt-8 border-t border-gray-100 text-left"
                                        >
                                            <h4 className="text-xs font-bold text-[#00285E] mb-2 uppercase tracking-wider">
                                                {t('booking.step1.customizeTasks', 'Tùy chỉnh hạng mục công việc')}
                                            </h4>
                                            <p className="text-[11px] text-gray-400 mb-4">
                                                {t('booking.step1.customizeTasksDesc', 'Chọn hoặc bỏ chọn các hạng mục cụ thể bạn mong muốn thực hiện trong gói dịch vụ.')}
                                            </p>
                                            <div className="space-y-2.5">
                                                {selectedService.details.map((detail, index) => {
                                                    const isChecked = selectedSubItems.includes(detail);
                                                    return (
                                                        <label
                                                            key={index}
                                                            className="flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none hover:bg-slate-50/50"
                                                            style={{
                                                                borderColor: isChecked ? 'rgba(249,161,27,0.3)' : '#F1F5F9',
                                                                backgroundColor: isChecked ? 'rgba(249,161,27,0.01)' : 'transparent',
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => {
                                                                    if (isChecked) {
                                                                        if (selectedSubItems.length > 1) {
                                                                            setSelectedSubItems(prev => prev.filter(item => item !== detail));
                                                                        } else {
                                                                            alert(t('booking.alerts.minOneTask', 'Bạn phải chọn ít nhất một hạng mục công việc.'));
                                                                        }
                                                                    } else {
                                                                        setSelectedSubItems(prev => [...prev, detail]);
                                                                    }
                                                                }}
                                                                className="mt-0.5 accent-[#F9A11B] rounded cursor-pointer shrink-0"
                                                            />
                                                            <span className="text-xs md:text-sm text-slate-700 leading-relaxed">
                                                                {detail}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 2: DATE & TIME SELECTOR */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-10 rounded-3xl bg-white border border-gray-100 shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                                            <Calendar size={20} />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-brand-blue font-display">{t('booking.step2.title', 'Chọn thời gian hẹn')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Datepicker input */}
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 text-left">
                                                {t('booking.step2.dateLabel', 'Chọn ngày hẹn')}
                                            </label>
                                            <input 
                                                type="date" 
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-[#F8FAFC] border border-blue-50/50 rounded-xl md:rounded-2xl p-4 text-xs md:text-sm outline-none transition-all focus:border-amber-400 focus:bg-white text-brand-blue"
                                            />
                                        </div>

                                        {/* Time picker list */}
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 text-left">
                                                {t('booking.step2.timeLabel', 'Chọn khung giờ')}
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {timeSlots.map((slot) => {
                                                    const isSelected = bookingTime === slot.time;
                                                    return (
                                                        <div
                                                            key={slot.time}
                                                            onClick={() => setBookingTime(slot.time)}
                                                            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-brand-orange bg-amber-50/20 text-brand-orange font-bold shadow-xs' 
                                                                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 text-brand-blue'
                                                            }`}
                                                        >
                                                            <div className="text-sm font-mono">{slot.time}</div>
                                                            <div className="text-[9px] uppercase tracking-wider opacity-60 mt-0.5">{slot.label}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: VEHICLE INFORMATION */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-10 rounded-3xl bg-white border border-gray-100 shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                                            <Car size={20} />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-brand-blue font-display">{t('booking.step3.title', 'Thông tin phương tiện')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1 text-left">
                                                {t('booking.step3.brandLabel', 'Hãng xe')}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder={t('booking.step3.brandPlaceholder', 'Ví dụ: Toyota, BMW, Mazda...')}
                                                value={vehicleBrand}
                                                onChange={(e) => setVehicleBrand(e.target.value)}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1 text-left">
                                                {t('booking.step3.modelLabel', 'Dòng xe (Model)')}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder={t('booking.step3.modelPlaceholder', 'Ví dụ: Camry, 320i, CX-5...')}
                                                value={vehicleModel}
                                                onChange={(e) => setVehicleModel(e.target.value)}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1 text-left">
                                                {t('booking.step3.plateLabel', 'Biển số xe')}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder={t('booking.step3.platePlaceholder', 'Ví dụ: 30A-123.45 hoặc 51F-999.99')}
                                                value={vehiclePlate}
                                                onChange={(e) => setVehiclePlate(e.target.value)}
                                                className={inputClass} 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: CONTACT INFORMATION */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-10 rounded-3xl bg-white border border-gray-100 shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                                            <User size={20} />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-brand-blue font-display">{t('booking.step4.title', 'Thông tin liên hệ')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1 text-left">
                                                {t('booking.step4.nameLabel', 'Họ và tên')}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder={t('booking.step4.namePlaceholder', 'Nguyễn Văn A')}
                                                value={contactName}
                                                onChange={(e) => setContactName(e.target.value)}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1 text-left">
                                                {t('booking.step4.phoneLabel', 'Số điện thoại')}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder={t('booking.step4.phonePlaceholder', '0912345678')}
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1 text-left">
                                                {t('booking.step4.emailLabel', 'Địa chỉ Email')}
                                            </label>
                                            <input 
                                                type="email" 
                                                placeholder={t('booking.step4.emailPlaceholder', 'khachhang@example.com')}
                                                value={contactEmail}
                                                onChange={(e) => setContactEmail(e.target.value)}
                                                className={inputClass} 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation controls below the form */}
                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                            <button
                                onClick={handleBack}
                                className={`flex items-center gap-2 px-6 py-3 font-bold text-xs rounded-xl border border-gray-200 text-gray-600 transition-all ${
                                    step === 1 ? 'opacity-40 cursor-not-allowed border-gray-100 text-gray-300' : 'hover:bg-gray-50'
                                }`}
                            >
                                <ArrowLeft size={16} /> {t('booking.buttons.back', 'Quay lại')}
                            </button>

                            <button
                                disabled={isSubmitting}
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                            >
                                {isSubmitting 
                                    ? t('booking.buttons.processing', 'Đang xử lý...') 
                                    : step === 4 
                                        ? t('booking.buttons.confirm', 'Xác nhận đặt lịch') 
                                        : t('booking.buttons.next', 'Tiếp theo')} 
                                {step < 4 && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* ── SIDEBAR SUMMARY ──────────────────────────── */}
                    <aside className="text-left">
                        <div className="p-8 rounded-3xl shadow-xl text-white sticky top-24 overflow-hidden"
                            style={{ backgroundColor: '#00285E' }}>
                            {/* Backdrop Subtle Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-slate-900 z-0" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl z-0" />

                            <h3 className="text-xl font-bold mb-8 border-b border-white/10 pb-6 relative z-10 font-display">
                                {t('booking.sidebar.title', 'Tóm tắt đặt lịch')}
                            </h3>

                            <div className="space-y-6 relative z-10 text-left">
                                {/* Dịch vụ */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <Settings size={18} style={{ color: COLORS.orange }} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{t('booking.sidebar.serviceLabel', 'Dịch vụ đã chọn')}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="font-bold text-xs md:text-sm">
                                                {selectedService ? selectedService.title : t('booking.sidebar.notSelected', 'Chưa chọn')}
                                            </span>
                                            {selectedService && step > 1 && (
                                                <button onClick={() => setStep(1)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-brand-orange border-none bg-transparent cursor-pointer">
                                                    <Edit2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                        {selectedService && selectedSubItems.length > 0 && (
                                            <div className="mt-2.5 pl-2 border-l border-[#F9A11B]/40 space-y-1">
                                                <div className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">
                                                    {t('booking.sidebar.itemsLabel', 'Hạng mục đã chọn')}
                                                </div>
                                                {selectedSubItems.map((item, idx) => (
                                                    <div key={idx} className="text-[10px] text-slate-300 leading-snug flex items-start gap-1">
                                                        <span className="text-[#F9A11B] shrink-0">•</span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thời gian */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <Calendar size={18} style={{ color: COLORS.orange }} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{t('booking.sidebar.timeLabel', 'Thời gian hẹn')}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="font-bold text-xs md:text-sm">
                                                {bookingDate && bookingTime ? `${bookingTime} - ${bookingDate}` : t('booking.sidebar.notSelected', 'Chưa chọn')}
                                            </span>
                                            {bookingDate && bookingTime && step > 2 && (
                                                <button onClick={() => setStep(2)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-brand-orange border-none bg-transparent cursor-pointer">
                                                    <Edit2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Phương tiện */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <Car size={18} style={{ color: COLORS.orange }} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{t('booking.sidebar.vehicleLabel', 'Phương tiện')}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="font-bold text-xs md:text-sm">
                                                {vehicleBrand && vehicleModel ? `${vehicleBrand} ${vehicleModel} (${vehiclePlate || 'N/A'})` : t('booking.sidebar.notEntered', 'Chưa nhập')}
                                            </span>
                                            {vehicleBrand && vehicleModel && step > 3 && (
                                                <button onClick={() => setStep(3)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-brand-orange border-none bg-transparent cursor-pointer">
                                                    <Edit2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tổng tiền */}
                            <div className="mt-8 pt-6 border-t border-white/10 space-y-4 relative z-10">
                                {selectedService && selectedService.originalPrice && (
                                    <div className="flex justify-between text-xs text-white/60">
                                        <span>{t('services.originalPriceLabel', 'Giá gốc:')}</span>
                                        <span className="font-mono text-white/50 line-through">{selectedService.originalPrice}</span>
                                    </div>
                                )}
                                {selectedService && selectedService.discountPercentage && (
                                    <div className="flex justify-between text-xs text-red-400 font-bold">
                                        <span>{t('services.promoBadge', 'Khuyến mãi')}</span>
                                        <span>-{selectedService.discountPercentage}%</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs text-white/60">
                                    <span>{t('booking.sidebar.servicePrice', 'Giá dịch vụ')}</span>
                                    <span className="font-mono text-white">{selectedService ? selectedService.price : '0đ'}</span>
                                </div>
                                <div className="flex justify-between text-xs text-white/60">
                                    <span>{t('booking.sidebar.installationFee', 'Công lắp đặt / kiểm tra')}</span>
                                    <span className="font-mono text-white">{t('booking.sidebar.free', 'Miễn phí')}</span>
                                </div>

                                {selectedService && selectedService.promoText && (
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-[10px] text-[#F9A11B] font-semibold leading-relaxed flex items-start gap-1.5">
                                        <span className="shrink-0 mt-0.5">🎁</span>
                                        <span>{selectedService.promoText}</span>
                                    </div>
                                )}

                                <div className="pt-6 flex justify-between items-end border-t border-white/5">
                                    <div>
                                        <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{t('booking.sidebar.total', 'Tổng cộng')}</div>
                                        <div className="text-2xl md:text-3xl font-bold font-display" style={{ color: COLORS.orange }}>
                                            {selectedService ? selectedService.price : '0đ'}
                                        </div>
                                    </div>
                                    <div className="text-[9px] text-white/20 italic mb-1">{t('booking.sidebar.estimatedNote', '* Giá tạm tính')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Hotline support */}
                        <div className="mt-6 p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4 shadow-xs text-left">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue shadow-inner">
                                <Phone size={20} />
                            </div>
                            <div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{t('booking.hotline.title', 'Cần tư vấn trực tiếp?')}</div>
                                <div className="font-bold tracking-tight text-brand-blue hover:text-brand-orange transition-colors">{t('booking.hotline.value', 'Hotline: 1900 1234')}</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}