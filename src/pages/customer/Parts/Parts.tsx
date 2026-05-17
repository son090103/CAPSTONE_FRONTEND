import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Filter, ChevronRight, Check,
    ShieldCheck, Wrench, ShoppingCart
} from 'lucide-react';
import { COLORS } from '../../../components/share/Color';
import { Button } from '../../../components/share/Button';



export default function Parts() {
    const [priceRange, setPriceRange] = useState(10000000);

    const products = [
        { id: 1, name: 'Má phanh Ceramic Pro', price: '1.250.000đ', tag: 'Best Seller', desc: 'Độ bền cao, giảm tiếng ồn và bụi phanh, phù hợp cho các dòng xe cao cấp.', image: '/images/AB6AXuA4LBFMSnhknbgkjpKvZ_qJdH77tlON9N7u21dIFCmfZXWAlkT-p5tWUBd5GIBr-DcpL_gz1tM4hjfVV9S6xpNPdKlEaThTGf29cIUuX4Mr7Um3WXjDlOgYHzlV4rIxlojF2v5C5jUukmtDPRzeNRHi-3rkFWTAZoTzFK0wwYpJCoiwclvLUFVvwT3v9AIzWHDq-MEJA_Q-C1Lbct.png' },
        { id: 2, name: 'Lọc dầu Synthetic', price: '350.000đ', tag: undefined, desc: 'Lọc sạch 99% tạp chất, giúp động cơ vận hành êm ái và bền bỉ.', image: '/images/AB6AXuAMNYLW4EURBChXIjVN12Yo-ExH61l1X_m4xOKrWROwoXwCnwHXEvyHAAXZql3XZKD4REmRdhXBrWUIO2KMxleVt9Y_a-ueUU9I2iw-vfm26ahZgq37lugBwaeIGkGRS-nYSB18TjDdt2fIoYCRhGf2-hyenpCjYHfaX6H_cqrZI2wu99sulXhGYZcMLj-wVJrWH8LJ6ia323w5qs.png' },
        { id: 3, name: 'Bugi Iridium High-Performance', price: '450.000đ', tag: undefined, desc: 'Đánh lửa cực mạnh, tiết kiệm nhiên liệu và tăng tốc mượt mà.', image: '/images/AB6AXuBVzy_VYDxmSwYN43hrOqJPUmUclDL2WZjgPOcfT3jzR9_bndwueNwFjoyu4VD2YiKN418NTwTN5SEVKNl5ThfSEdy9qGm64qCzYJg2-8UVOejH8FRE61RDjjfcqlmU5Ge8PDEKJE8VI_O_Zm61DzSNtr6zfN47neFGbFBIhGhmSo0bg1QYUXixjLt1UQrJT3QW3P1YMFbZy1quJX.png' },
        { id: 4, name: 'Giảm xóc Gas-Filled', price: '2.800.000đ', tag: '-15%', desc: 'Cải thiện độ ổn định khi vào cua và mang lại cảm giác lái êm ái.', image: '/images/AB6AXuBhNpw82zCf-1iHmkNvwCnle9gXzU978dvfraGQB__UBthJ5Nwj-mYjwlJo5C1RSkuW87cY6NI5J-3pV95epQnr5o00YxsNeboAPTY1pWHLAcq-fhKxhvTJNQ5IG0eWX_0NlZsrNNE-Py6j8MKoGRVpIcbdMECEKeXdfAgV_tpWoYGcHnXPUvmGjJpSRZ5FLQvOF5WCyV9sQLLQQx.png' },
        { id: 5, name: 'Lọc gió động cơ OEM', price: '280.000đ', tag: undefined, desc: 'Tối ưu lưu lượng khí nạp, bảo vệ động cơ khỏi bụi bẩn và dị vật.', image: '/images/AB6AXuCkuwy1UUpC-i7nhprPFTyaY-Rwu3tAxF_0rTz9f1huI7Sfyd-m5UZGvsVVCJc0E67RiSiOgH12dyFgsXKZGzyhbBU-GPBi6mQyNH69E7wHAaqSbmB35THvWUHgB0bvsWP7QKSjGTAGGsbVoqzlw5wV2jK0TteV3qNgafPhtSkSHTGCFMSm3VncK0op5yZq5XLjtMtl4Th8vWYQYM.png' },
        { id: 6, name: 'Ắc quy khô 70Ah', price: '1.850.000đ', tag: undefined, desc: 'Công nghệ miễn bảo dưỡng, khởi động mạnh mẽ ngay cả khi trời lạnh.', image: '/images/AB6AXuCp-frQqVtq_mR2dF8okADuNvQPhFa18vwl9pW7sO2wC7uwGGHKkpo4uzXZZTULtdMWx56vrXB2PPdLSihwxn6ppBoPMDy-uP-MT7MyASYWaNqqr14jRR3i5xrrLHCrKbCx6TRBkLNN8XC7h0jnYmBMIbtfdKPqmABpImrLkyymT-G5_lgamEoiygkyoSfRu85AD-G9qkovxWFR2Q.png' },
    ];

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: '#F8FAFC' }}>

            {/* ── HEADER ───────────────────────────────────────── */}
            <section className="bg-white pt-12 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-display mb-4" style={{ color: COLORS.navy }}>
                        Linh Kiện Chính Hãng
                    </h1>
                    <p className="max-w-2xl leading-relaxed" style={{ color: `${COLORS.navy}99` }}>
                        Nâng tầm hiệu suất và độ an toàn cho xế yêu với hệ thống linh kiện nhập khẩu 100%,
                        bảo hành dài hạn và hỗ trợ lắp đặt chuyên nghiệp.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {[
                            { title: '100% Chính Hãng', desc: 'Cam kết chất lượng từ nhà sản xuất', icon: <Check size={20} style={{ color: COLORS.orange }} /> },
                            { title: 'Bảo Hành Dài Hạn', desc: 'An tâm tuyệt đối với chính sách 1 đổi 1', icon: <ShieldCheck size={20} style={{ color: COLORS.orange }} /> },
                            { title: 'Hỗ Trợ Lắp Đặt', desc: 'Miễn phí công thay tại các chi nhánh', icon: <Wrench size={20} style={{ color: COLORS.orange }} /> },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-6 rounded-2xl border border-blue-50"
                                style={{ backgroundColor: '#F8FAFC' }}>
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="font-bold" style={{ color: COLORS.navy }}>{item.title}</div>
                                    <div className="text-xs" style={{ color: `${COLORS.navy}80` }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── SIDEBAR ──────────────────────────────────── */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-50 sticky top-24">
                            <div className="flex items-center gap-2 mb-8" style={{ color: COLORS.navy }}>
                                <Filter size={18} />
                                <h3 className="font-bold text-lg">Bộ lọc</h3>
                            </div>

                            {/* Loại xe */}
                            <div className="mb-10">
                                <label className="text-xs font-bold uppercase tracking-widest mb-4 block"
                                    style={{ color: `${COLORS.navy}66` }}>Loại xe</label>
                                <select className="w-full bg-[#F8FAFC] border-none rounded-xl p-3 text-sm outline-none"
                                    style={{ color: COLORS.navy }}>
                                    <option>Tất cả loại xe</option>
                                    <option>SUV / Crossover</option>
                                    <option>Sedan / Coupe</option>
                                    <option>Xe thể thao</option>
                                </select>
                            </div>

                            {/* Thương hiệu */}
                            <div className="mb-10">
                                <label className="text-xs font-bold uppercase tracking-widest mb-4 block"
                                    style={{ color: `${COLORS.navy}66` }}>Thương hiệu</label>
                                <div className="space-y-3">
                                    {['Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi'].map((brand) => (
                                        <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                            <span className="text-sm transition-colors" style={{ color: `${COLORS.navy}B3` }}>
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Khoảng giá */}
                            <div className="mb-10">
                                <label className="text-xs font-bold uppercase tracking-widest mb-4 block"
                                    style={{ color: `${COLORS.navy}66` }}>Khoảng giá (VNĐ)</label>
                                <input
                                    type="range" min="0" max="50000000" step="500000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-3 text-xs font-mono" style={{ color: `${COLORS.navy}80` }}>
                                    <span>0đ</span>
                                    <span>{new Intl.NumberFormat('vi-VN').format(priceRange)}đ+</span>
                                </div>
                            </div>

                            {/* ── Áp dụng — Button tái sử dụng ── */}
                            <Button
                                size="sm"
                                icon={null}
                                bg={COLORS.navy}
                                color={COLORS.white}
                                className="w-full justify-center rounded-xl"
                                style={{ boxShadow: `0 4px 16px ${COLORS.navy}1A` }}
                            >
                                Áp dụng bộ lọc
                            </Button>
                        </div>
                    </aside>

                    {/* ── PRODUCT GRID ─────────────────────────────── */}
                    <main className="flex-grow">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-blue-50">
                            <div className="text-sm" style={{ color: `${COLORS.navy}99` }}>
                                Hiển thị <span className="font-bold" style={{ color: COLORS.navy }}>24</span> sản phẩm
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm" style={{ color: `${COLORS.navy}80` }}>Sắp xếp:</span>
                                <select className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer"
                                    style={{ color: COLORS.navy }}>
                                    <option>Phổ biến nhất</option>
                                    <option>Giá: Thấp đến Cao</option>
                                    <option>Giá: Cao đến Thấp</option>
                                    <option>Mới nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-blue-50 group flex flex-col"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {product.tag && (
                                            <div className="absolute top-4 left-4 inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg"
                                                style={{ backgroundColor: COLORS.orange, color: COLORS.navy }}>
                                                {product.tag}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <h4 className="font-bold leading-tight transition-colors group-hover:opacity-70"
                                                style={{ color: COLORS.navy }}>
                                                {product.name}
                                            </h4>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold font-display" style={{ color: COLORS.orange }}>
                                                    {product.price}
                                                </div>
                                                <div className="text-[10px] uppercase font-mono" style={{ color: `${COLORS.navy}66` }}>
                                                    Bao gồm VAT
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm mb-8 line-clamp-3 leading-relaxed" style={{ color: `${COLORS.navy}99` }}>
                                            {product.desc}
                                        </p>

                                        {/* ── Buy Now — Button tái sử dụng ── */}
                                        <Button
                                            size="sm"
                                            bg={COLORS.orange}
                                            color={COLORS.navy}
                                            icon={<ShoppingCart size={18} />}
                                            className="w-full justify-center rounded-2xl h-14"
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── PAGINATION ── */}
                        <div className="mt-16 flex justify-center items-center gap-2">
                            {/* Prev */}
                            <Button size="sm" icon={null} bg={COLORS.white} color={COLORS.navy}
                                className="w-10 h-10 justify-center rounded-xl p-0"
                                style={{ border: '1px solid #DBEAFE' }}>
                                <ChevronRight size={18} className="rotate-180" />
                            </Button>

                            {/* Page 1 — active */}
                            <Button size="sm" icon={null} bg={COLORS.navy} color={COLORS.white}
                                className="w-10 h-10 justify-center rounded-xl p-0 text-sm font-bold">
                                1
                            </Button>

                            {/* Page 2 */}
                            <Button size="sm" icon={null} bg={COLORS.white} color={COLORS.navy}
                                className="w-10 h-10 justify-center rounded-xl p-0 text-sm font-bold"
                                style={{ border: '1px solid #DBEAFE' }}>
                                2
                            </Button>

                            {/* Page 3 */}
                            <Button size="sm" icon={null} bg={COLORS.white} color={COLORS.navy}
                                className="w-10 h-10 justify-center rounded-xl p-0 text-sm font-bold"
                                style={{ border: '1px solid #DBEAFE' }}>
                                3
                            </Button>

                            <span className="px-2" style={{ color: `${COLORS.navy}66` }}>...</span>

                            {/* Next */}
                            <Button size="sm" icon={null} bg={COLORS.white} color={COLORS.navy}
                                className="w-10 h-10 justify-center rounded-xl p-0"
                                style={{ border: '1px solid #DBEAFE' }}>
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}