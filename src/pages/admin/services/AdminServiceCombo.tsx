import { useState } from "react";
import { motion } from "motion/react";
import { Boxes, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { type Category, type ServiceCatalog } from "../../../model/dto/serviceCatalog.dto";

export interface ServiceCombo {
  id: number;
  combo_name: string;
  category_id: number;
  service_ids: number[];
  discount_percentage: number;
  is_active: boolean;
  createdAt: string;
}

// LocalStorage helpers for combos persistence
export const getServiceCombos = (): ServiceCombo[] => {
  try {
    const stored = localStorage.getItem("service_combos");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveServiceCombos = (combos: ServiceCombo[]) => {
  try {
    localStorage.setItem("service_combos", JSON.stringify(combos));
  } catch (e) {
    console.error(e);
  }
};

const getServicePrices = (): Record<number, number> => {
  try {
    const stored = localStorage.getItem("service_prices");
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

interface ComboFormModalProps {
  initial: ServiceCombo | null;
  services: ServiceCatalog[];
  categories: Category[];
  onClose: () => void;
  onSave: (combo: ServiceCombo) => void;
}

export function ComboFormModal({ initial, services, categories, onClose, onSave }: ComboFormModalProps) {
  const [name, setName] = useState(initial?.combo_name ?? "");
  const [categoryId, setCategoryId] = useState<number>(initial?.category_id ?? 0);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(initial?.service_ids ?? []);
  const [discount, setDiscount] = useState<number>(initial?.discount_percentage ?? 10);
  const [isActive, setIsActive] = useState<boolean>(initial?.is_active ?? true);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const servicePrices = getServicePrices();

  // Dynamic calculations
  const totalOriginal = selectedServiceIds.reduce((sum, id) => {
    return sum + (servicePrices[id] ?? 300000);
  }, 0);
  const discountedPrice = totalOriginal * (1 - discount / 100);

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg("Tên gói combo không được để trống");
      return;
    }
    if (categoryId === 0) {
      setErrorMsg("Vui lòng chọn danh mục cho combo");
      return;
    }
    if (selectedServiceIds.length === 0) {
      setErrorMsg("Gói combo phải chứa ít nhất một dịch vụ");
      return;
    }
    if (discount < 0 || discount > 100 || isNaN(discount)) {
      setErrorMsg("Phần trăm chiết khấu phải từ 0% đến 100%");
      return;
    }
    
    // Check duplication
    const existing = getServiceCombos();
    const isDuplicate = existing.some(
      c => c.combo_name.trim().toLowerCase() === name.trim().toLowerCase() && c.id !== initial?.id
    );
    if (isDuplicate) {
      setErrorMsg("Tên gói combo đã tồn tại trong hệ thống");
      return;
    }

    const savedCombo: ServiceCombo = {
      id: initial?.id ?? Date.now(),
      combo_name: name.trim(),
      category_id: categoryId,
      service_ids: selectedServiceIds,
      discount_percentage: discount,
      is_active: isActive,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };

    setSuccessMsg(initial ? "Cập nhật gói dịch vụ thành công!" : "Tạo gói dịch vụ thành công!");
    setErrorMsg("");
    setTimeout(() => {
      onSave(savedCombo);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden z-10"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {initial ? "Chỉnh sửa gói Combo" : "Tạo gói Combo dịch vụ mới"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cấu hình các dịch vụ đi kèm và thiết lập chiết khấu ưu đãi.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Left instructions block */}
          <div className="md:col-span-2 bg-[#EDF3FF] p-6 flex flex-col gap-4 border-r border-slate-100">
            <div className="flex items-center gap-2 text-[#00285E]">
              <div className="w-9 h-9 rounded bg-[#00285E] flex items-center justify-center shrink-0">
                <Boxes size={16} className="text-[#F9A11B]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Gói dịch vụ Combo</h3>
                <p className="text-[11px] text-slate-500">Tiết kiệm hơn cho khách hàng.</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/40 text-xs space-y-3 flex-1">
              <span className="font-bold text-slate-700 uppercase block tracking-wider">Thông tin biểu phí</span>
              <div className="space-y-2 font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Tổng giá trị gốc:</span>
                  <span className="text-slate-800">{totalOriginal.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Chiết khấu áp dụng:</span>
                  <span className="text-emerald-600">-{discount}%</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2 flex justify-between text-sm">
                  <span className="text-[#00285E]">Giá bán Combo:</span>
                  <span className="text-[#00285E] font-black">{discountedPrice.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form block */}
          <div className="md:col-span-3 p-6 space-y-4 max-h-[450px] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Tên gói Combo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vd: Combo chăm sóc xe toàn diện mùa mưa"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Phân loại Combo *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
                >
                  <option value={0} disabled>-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Chiết khấu (%) *
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Chọn dịch vụ đi kèm * (Ít nhất 1 dịch vụ)
              </label>
              <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
                {services.filter(s => s.is_active).map(s => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  const sPrice = servicePrices[s.id] ?? 300000;
                  return (
                    <label key={s.id} className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer transition-colors text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedServiceIds(selectedServiceIds.filter(id => id !== s.id));
                          } else {
                            setSelectedServiceIds([...selectedServiceIds, s.id]);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-[#00285E] focus:ring-[#00285E]/20"
                      />
                      <div className="flex-1 flex justify-between">
                        <span>{s.service_name}</span>
                        <span className="text-slate-400 font-bold">{sPrice.toLocaleString("vi-VN")} đ</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#00285E] focus:ring-[#00285E]/20"
                />
                <span className="text-sm font-semibold text-slate-700">Kích hoạt gói Combo</span>
              </label>
            </div>

            {errorMsg && (
              <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded px-3 py-2 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 rounded text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            Hủy
          </button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-[#F9A11B] text-[#00285E] rounded text-sm font-bold shadow-md shadow-[#F9A11B]/20 hover:bg-[#E08F12] transition-all">
            {initial ? "Lưu thay đổi" : "Tạo gói combo"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
