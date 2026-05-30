import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Wrench, Zap, Car, ShieldCheck,
    Droplets, Plus, Package, Wallet, UserCheck, Search, X, Clock
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../../components/share/Color';
import { Button } from '../../../components/share/Button';
import { useNavigate } from 'react-router-dom';

interface ServiceItem {
    id: number;
    title: string;
    desc: string;
    icon: React.ReactNode;
    price: string;
    category: string;
    image: string;
    duration?: string;
    details?: string[];
}

export default function Services() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    const categories = [
        { id: 'all', label: t('common.all', 'Tất cả') },
        { id: 'maintenance', label: t('services.categories.maintenance', 'Bảo dưỡng') },
        { id: 'repair', label: t('services.categories.repair', 'Sửa chữa') },
    ];

    const services: ServiceItem[] = [
        {
            id: 1,
            title: t('services.list.periodic.title', 'Bảo Dưỡng Định Kỳ'),
            desc: t('services.list.periodic.desc', 'Kiểm tra tổng quát và thay thế linh kiện hao mòn định kỳ để xe luôn vận hành êm ái.'),
            icon: <Settings size={18} />,
            price: t('services.list.periodic.price', 'Từ 500.000đ'),
            category: 'maintenance',
            image: '/images/Precision Maintenance (1).png',
            duration: t('services.list.periodic.duration', '60 - 120 phút'),
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
            icon: <Wrench size={18} />,
            price: t('services.list.engine.price', 'Từ 1.200.000đ'),
            category: 'repair',
            image: '/images/Advanced Repair.png',
            duration: t('services.list.engine.duration', 'Buổi hoặc ngày (tùy tình trạng)'),
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
            icon: <Car size={18} />,
            price: t('services.list.tireBrake.price', 'Từ 400.000đ'),
            category: 'maintenance',
            image: '/images/Vehicle Protection.png',
            duration: t('services.list.tireBrake.duration', '30 - 60 phút'),
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
            icon: <Droplets size={18} />,
            price: t('services.list.detailing.price', 'Từ 800.000đ'),
            category: 'maintenance',
            image: '/images/Elite Detailing.png',
            duration: t('services.list.detailing.duration', '120 - 240 phút'),
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
            icon: <Zap size={18} />,
            price: t('services.list.electronics.price', 'Từ 300.000đ'),
            category: 'repair',
            image: '/images/Digital Diagnostics.png',
            duration: t('services.list.electronics.duration', '30 - 45 phút'),
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
            icon: <Zap size={18} />,
            price: '24/7',
            category: 'repair',
            image: '/images/Performance Tuning.png',
            duration: t('services.list.rescue.duration', 'Phản hồi trong 15 - 30 phút'),
            details: [
                t('services.list.rescue.details.0', 'Hỗ trợ kích nổ ắc quy tại chỗ nhanh chóng.'),
                t('services.list.rescue.details.1', 'Hỗ trợ thay lốp dự phòng khẩn cấp.'),
                t('services.list.rescue.details.2', 'Cung cấp nhiên liệu khẩn cấp trên đường.'),
                t('services.list.rescue.details.3', 'Xe cẩu kéo chuyên dụng đưa về trung tâm gần nhất.'),
                t('services.list.rescue.details.4', 'Đội ngũ cứu hộ túc trực sẵn sàng 24 giờ mỗi ngày.')
            ]
        },
    ];

    const filteredServices = services.filter(service => {
        const matchesCategory = activeTab === 'all' || service.category === activeTab;
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleBookNow = (serviceId: number) => {
        navigate(`/phone-service?serviceId=${serviceId}`);
    };

    return (
        <div className="bg-white text-left">
            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative h-[240px] md:h-[600px] flex items-center overflow-hidden" style={{ backgroundColor: COLORS.navy }}>
                <div className="absolute inset-0">
                    <img src="/images/div.w-full.png" alt="Service Workshop" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0" style={{ backgroundColor: `${COLORS.navy}66` }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl text-center md:text-left">
                        <h1 className="text-3xl md:text-6xl font-bold font-display text-white mb-2 md:mb-6 leading-tight">
                            {t('services.heroTitle', 'Dịch vụ chuyên nghiệp')}
                        </h1>
                        <p className="hidden md:block text-lg text-white/90 max-w-xl mb-12 leading-relaxed">
                            {t('services.heroDesc', 'Nâng tầm trải nghiệm bảo dưỡng xe với đội ngũ kỹ thuật viên tay nghề cao và công nghệ chẩn đoán tiên tiến nhất. Chúng tôi cam kết mang lại sự an toàn tuyệt đối cho mọi hành trình của bạn.')}
                        </p>

                        <div className="hidden md:flex flex-wrap gap-4">
                            <Button
                                to="/phone-service"
                                size="md"
                                bg={COLORS.orange}
                                color={COLORS.navy}
                                icon={null}
                                className="uppercase text-sm rounded-md font-bold"
                            >
                                {t('nav.booking', 'Đặt lịch ngay')}
                            </Button>

                            <Button
                                size="md"
                                bg="transparent"
                                color={COLORS.white}
                                icon={null}
                                className="uppercase text-sm rounded-md font-bold"
                                style={{ border: `1px solid ${COLORS.white}` }}
                                onClick={() => {
                                    window.open('tel:19001234');
                                }}
                            >
                                {t('services.emergencyConsult', 'Tư vấn khẩn cấp')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SERVICES LIST ─────────────────────────────────── */}
            <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-8">
                    <div>
                        <span className="font-bold text-sm tracking-widest uppercase mb-4 block" style={{ color: COLORS.orange }}>
                            {t('services.forYourCar', 'DÀNH CHO XE CỦA BẠN')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-display text-brand-blue">
                            {t('services.catalogTitle', 'Danh mục dịch vụ')}
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full xl:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-grow md:max-w-md">
                            <input
                                type="text"
                                placeholder={t('services.searchPlaceholder', 'Tìm kiếm dịch vụ bảo dưỡng...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200/80 bg-white text-xs md:text-sm text-brand-blue placeholder-gray-400 focus:outline-none focus:border-brand-orange transition-all"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="p-1 hover:bg-gray-100 rounded-full absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${activeTab === cat.id
                                        ? 'bg-brand-blue text-white shadow-md shadow-blue-900/10'
                                        : 'bg-white text-brand-blue/70 border border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredServices.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center max-w-lg mx-auto"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100 shadow-inner">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-brand-blue mb-1">{t('services.noResults', 'Không tìm thấy kết quả')}</h3>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed px-4 text-center">
                            {t('services.noResultsDesc', 'Không tìm thấy dịch vụ nào phù hợp với từ khóa "{{query}}". Vui lòng thử từ khóa khác hoặc thiết lập lại bộ lọc.', { query: searchQuery })}
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                            className="mt-6 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-blue/90 transition-all cursor-pointer"
                        >
                            {t('services.resetFilters', 'Thiết lập lại bộ lọc')}
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {filteredServices.map((service) => (
                            <motion.div
                                layout
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(10,35,87,0.15)', borderColor: 'rgba(10,35,87,0.25)' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-200/80 flex flex-col cursor-pointer"
                                onClick={() => setSelectedService(service)}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
                                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-md"
                                        style={{ backgroundColor: `${COLORS.navy}F0` }}>
                                        {service.price}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-brand-blue bg-blue-50 p-2 rounded-lg shrink-0">{service.icon}</span>
                                            <h3 className="text-base md:text-lg font-bold text-brand-blue line-clamp-1">{service.title}</h3>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6 flex-grow line-clamp-2">
                                            {service.desc}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setSelectedService(service); }}
                                            className="flex-1 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold text-xs rounded-xl transition-all"
                                        >
                                            {t('common.details', 'Chi tiết')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleBookNow(service.id); }}
                                            className="flex-1 py-2 bg-brand-blue text-white hover:bg-brand-blue/90 font-bold text-xs rounded-xl transition-all shadow-sm"
                                        >
                                            {service.id === 6 ? t('services.callRescue', 'Gọi cứu hộ') : t('services.bookService', 'Đặt dịch vụ')}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── WHY CHOOSE US ─────────────────────────────────── */}
            <section className="py-32" style={{ backgroundColor: '#EDF3FF' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold font-display mb-10 relative inline-block" style={{ color: COLORS.navy }}>
                        {t('services.whyChooseUsTitle', 'Tại sao chọn AGM Intelligent?')}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full"
                            style={{ backgroundColor: COLORS.navy }} />
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mt-10 md:mt-24">
                        {[
                            { title: t('services.whyChooseUs.techs.title', 'Kỹ thuật viên'), desc: t('services.whyChooseUs.techs.desc', 'Đội ngũ chuyên gia được đào tạo bài bản và giàu kinh nghiệm thực tế.'), icon: <UserCheck size={32} /> },
                            { title: t('services.whyChooseUs.parts.title', 'Phụ tùng chính hãng'), desc: t('services.whyChooseUs.parts.desc', 'Cam kết sử dụng 100% linh kiện chính hãng, rõ ràng nguồn gốc xuất xứ.'), icon: <Package size={32} /> },
                            { title: t('services.whyChooseUs.pricing.title', 'Giá cả minh bạch'), desc: t('services.whyChooseUs.pricing.desc', 'Báo giá chi tiết trước khi thực hiện, không phát sinh chi phí ẩn.'), icon: <Wallet size={32} /> },
                            { title: t('services.whyChooseUs.warranty.title', 'Bảo hành dài hạn'), desc: t('services.whyChooseUs.warranty.desc', 'Chính sách bảo hành uy tín cho mọi hạng mục sửa chữa và phụ tùng.'), icon: <ShieldCheck size={32} /> },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 16px 32px rgba(10,35,87,0.12)' }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                                className="bg-white p-4 md:p-12 rounded-2xl shadow-sm border border-transparent cursor-pointer flex flex-col justify-between"
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4 md:mb-10 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-8 md:[&>svg]:h-8"
                                    style={{ color: COLORS.navy }}
                                >
                                    {item.icon}
                                </motion.div>
                                <h4 className="text-xs md:text-xl font-bold mb-2 md:mb-4 line-clamp-1 md:line-clamp-none" style={{ color: COLORS.navy }}>{item.title}</h4>
                                <p className="text-[10px] md:text-sm leading-normal md:leading-relaxed font-medium line-clamp-2 md:line-clamp-none" style={{ color: `${COLORS.navy}80` }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────── */}
            <section className="py-40 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold font-display mb-20 text-center uppercase tracking-tighter"
                    style={{ color: COLORS.navy }}>
                    {t('services.faqTitle', 'Câu Hỏi Thường Gặp')}
                </h2>
                <div className="space-y-6">
                    {[
                        t('services.faq.q1', 'Thời gian bảo dưỡng định kỳ mất bao lâu?'),
                        t('services.faq.q2', 'Tôi có cần đặt lịch trước không?'),
                        t('services.faq.q3', 'AGM Intelligent có hỗ trợ xe mượn khi sửa chữa lâu không?')
                    ].map((q, i) => (
                        <div key={i} className="bg-[#F8FAFC] border border-gray-100 rounded-lg overflow-hidden">
                            <motion.button
                                whileHover={{ backgroundColor: `${COLORS.navy}08` }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full p-8 text-left flex justify-between items-center group transition-colors"
                            >
                                <span className="font-bold text-base" style={{ color: `${COLORS.navy}CC` }}>{q}</span>
                                <Plus size={20} style={{ color: COLORS.navy }} className="group-hover:rotate-45 transition-transform" />
                            </motion.button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICE DETAIL MODAL ──────────────────────────── */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        {/* Modal content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-2xl w-full relative z-10 text-left flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header Image */}
                            <div className="relative h-48 md:h-64 bg-slate-950 shrink-0">
                                <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover opacity-90" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950/80 text-white rounded-full transition-colors border border-white/10"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="absolute bottom-4 left-6 right-6 text-white">
                                    <span className="px-2.5 py-1 bg-brand-orange text-brand-blue font-bold text-[10px] rounded-md tracking-wider uppercase inline-block mb-2">
                                        {selectedService.category === 'maintenance'
                                            ? t('services.categories.maintenance', 'BẢO DƯỠNG')
                                            : t('services.categories.repair', 'SỬA CHỮA')}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold font-display">{selectedService.title}</h3>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
                                <div className="flex flex-wrap items-center gap-6 text-xs text-brand-blue font-bold">
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                                        <Clock className="w-4 h-4 text-brand-blue" />
                                        <span>{t('services.modal.duration', 'Thời gian: {{duration}}', { duration: selectedService.duration || '60 - 90 phút' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg text-amber-800">
                                        <Wallet className="w-4 h-4 text-amber-600" />
                                        <span>{t('services.modal.price', 'Giá dự kiến: {{price}}', { price: selectedService.price })}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider">{t('services.modal.descriptionLabel', 'Mô tả dịch vụ')}</h4>
                                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                                        {selectedService.desc}
                                    </p>
                                </div>

                                {selectedService.details && selectedService.details.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-brand-blue uppercase tracking-wider">{t('services.modal.itemsLabel', 'Các hạng mục công việc')}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                            {selectedService.details.map((detail, index) => (
                                                <div key={index} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <span className="w-1.5 h-1.5 bg-brand-orange rounded-full shrink-0 mt-1.5" />
                                                    <span>{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-50 text-[11px] text-gray-500 leading-relaxed">
                                    <ShieldCheck className="w-5 h-5 text-brand-blue shrink-0" />
                                    <span>{t('services.modal.guarantee', 'Tất cả dịch vụ được thực hiện bởi kỹ thuật viên tay nghề cao và bảo hành chính hãng tối thiểu 6 tháng tại hệ thống AGM Intelligent.')}</span>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs rounded-xl transition-all"
                                >
                                    {t('history.close', 'Đóng')}
                                </button>
                                <button
                                    onClick={() => {
                                        const id = selectedService.id;
                                        setSelectedService(null);
                                        handleBookNow(id);
                                    }}
                                    className="flex-1 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-md text-center"
                                >
                                    {t('nav.booking', 'Đặt lịch ngay')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}