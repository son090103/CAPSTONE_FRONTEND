import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Package,
  TrendingUp,
  Boxes,
  Filter,
  Pencil,
  Trash2,
  X,
  Wrench,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

interface SparePart {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  is_active: boolean;
}

const MOCK_CATEGORIES = [
  "Động cơ",
  "Phanh",
  "Lốp",
  "Hệ thống điện",
  "Dầu nhớt",
  "Phụ kiện",
];

const INITIAL_PARTS: SparePart[] = [
  {
    id: 1,
    name: "Bộ lọc dầu Toyota Vios",
    description: "Lọc dầu chính hãng, dùng cho Vios 2018-2023.",
    quantity: 25,
    category: "Động cơ",
    is_active: true,
  },
  {
    id: 2,
    name: "Má phanh trước Honda City",
    description: "Má phanh ceramic, ít bụi, êm.",
    quantity: 12,
    category: "Phanh",
    is_active: true,
  },
  {
    id: 3,
    name: "Dầu động cơ tổng hợp 5W30",
    description: "Dầu nhớt tổng hợp toàn phần, can 4L.",
    quantity: 0,
    category: "Dầu nhớt",
    is_active: false,
  },
];

export default function AdminSpareParts() {
  const { showToast } = useOutletContext<{
    searchQuery: string;
    showToast: (text: string, type?: "success" | "info" | "warning") => void;
  }>();

  const [parts, setParts] = useState<SparePart[]>(INITIAL_PARTS);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const total = parts.length;
    const inStock = parts.filter((p) => p.quantity > 0).length;
    const outOfStock = parts.filter((p) => p.quantity === 0).length;
    return { total, inStock, outOfStock };
  }, [parts]);

  const handleOpenCreate = () => {
    setEditingPart(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (part: SparePart) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = (part: SparePart) => {
    if (window.confirm(`Xóa phụ tùng "${part.name}"?`)) {
      setParts((prev) => prev.filter((p) => p.id !== part.id));
      showToast(`Đã xóa "${part.name}"`, "success");
    }
  };

  const handleSavePart = (data: Omit<SparePart, "id">) => {
    if (editingPart) {
      setParts((prev) =>
        prev.map((p) => (p.id === editingPart.id ? { ...editingPart, ...data } : p))
      );
      showToast("Cập nhật phụ tùng thành công!", "success");
    } else {
      const newId = parts.length ? Math.max(...parts.map((p) => p.id)) + 1 : 1;
      setParts((prev) => [...prev, { id: newId, ...data }]);
      showToast("Thêm phụ tùng mới thành công!", "success");
    }
    setIsModalOpen(false);
    setEditingPart(null);
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">
            Quản lý Phụ tùng
          </h1>
          <p className="text-slate-500 text-sm">
            Theo dõi tồn kho và quản lý danh mục phụ tùng của gara.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#00285E] text-[#00285E] rounded text-sm font-bold hover:bg-[#EDF3FF] transition-all"
          >
            <span>Thêm phụ tùng mới</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
          className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-center gap-4 cursor-pointer transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Package size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Tổng phụ tùng
            </span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight block">
              {stats.total}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
          className="bg-white p-6 rounded-2xl border-2 border-[#F9A11B] shadow-xs flex items-center gap-4 cursor-pointer transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Còn hàng
            </span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight block">
              {stats.inStock}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
          className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-center gap-4 cursor-pointer transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Boxes size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Hết hàng
            </span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight block">
              {stats.outOfStock}
            </span>
          </div>
        </motion.div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Danh sách Phụ tùng
          </h2>
          <button
            onClick={() => showToast("Mở bộ lọc nâng cao...", "info")}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
          >
            <Filter size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="py-4 px-6">Tên phụ tùng</th>
                <th className="py-4 px-4">Danh mục</th>
                <th className="py-4 px-4">Mô tả</th>
                <th className="py-4 px-4">Số lượng</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {parts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 text-sm"
                  >
                    Chưa có phụ tùng nào.
                  </td>
                </tr>
              ) : (
                parts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#00285E] text-sm block">
                        {p.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase bg-slate-100 text-slate-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">
                      {p.description}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">
                      {p.quantity}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.is_active
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {p.is_active ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREATE / EDIT */}
      {isModalOpen && (
        <SparePartFormModal
          initial={editingPart}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPart(null);
          }}
          onSubmit={handleSavePart}
        />
      )}
    </div>
  );
}

interface SparePartFormModalProps {
  initial: SparePart | null;
  onClose: () => void;
  onSubmit: (data: Omit<SparePart, "id">) => void;
}

function SparePartFormModal({ initial, onClose, onSubmit }: SparePartFormModalProps) {
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [quantity, setQuantity] = useState<number>(initial?.quantity ?? 0);
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [isActive, setIsActive] = useState<boolean>(initial?.is_active ?? true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập tên phụ tùng.");
      return;
    }
    if (!category) {
      setErrorMsg("Vui lòng chọn danh mục.");
      return;
    }
    if (quantity < 0) {
      setErrorMsg("Số lượng không được âm.");
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      quantity,
      category,
      is_active: isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isEdit ? "Chỉnh sửa phụ tùng" : "Thêm phụ tùng mới"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý thông tin phụ tùng và tồn kho của gara.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY 2 COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* LEFT COLUMN: ILLUSTRATION & TIPS */}
          <div className="md:col-span-2 bg-[#EDF3FF] p-6 flex flex-col gap-4 border-r border-slate-100">
            <div className="flex items-center gap-2 text-[#00285E]">
              <div className="w-9 h-9 rounded bg-[#00285E] flex items-center justify-center shrink-0">
                <Wrench size={16} className="text-[#F9A11B]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Phụ tùng kho</h3>
                <p className="text-[11px] text-slate-500">
                  Cập nhật số lượng và mô tả đầy đủ.
                </p>
              </div>
            </div>

            <div className="relative aspect-square rounded-md overflow-hidden shadow-2xl border border-white/10 group flex-1">
              <img
                src="/images/Service-Image.png"
                alt="Spare part"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="md:col-span-3 p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Tên phụ tùng
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vd: Bộ lọc dầu Toyota Vios"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Vd: Lọc dầu chính hãng, dùng cho Vios 2018-2023."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Danh mục
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Số lượng
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#00285E] focus:ring-[#00285E]/20"
              />
              <span className="text-sm font-semibold text-slate-700">
                Kích hoạt phụ tùng
              </span>
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mb-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded px-3 py-2">
            {errorMsg}
          </div>
        )}

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#F9A11B] text-[#00285E] rounded text-sm font-bold shadow-md shadow-[#F9A11B]/20 hover:bg-[#E08F12] transition-all"
          >
            {isEdit ? "Lưu thay đổi" : "Tạo phụ tùng"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
