import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Car,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface WarrantyPolicy {
  id: number;
  name: string;
  vehicleMake: string;
  vehicleModel: string;
  sparePart: string;
  warrantyType: 'TIME' | 'DISTANCE' | 'BOTH' | 'NONE';
  durationMonths: number;
  kmLimit: number;
  isActive: boolean;
  createdAt: string;
}

const MOCK_VEHICLE_DATA: Record<string, string[]> = {
  Toyota: ['Vios', 'Camry', 'Fortuner', 'Innova'],
  Honda: ['City', 'Civic', 'CR-V'],
  Mazda: ['Mazda 3', 'Mazda 6', 'CX-5'],
  Hyundai: ['Accent', 'Elantra', 'Santa Fe'],
  Kia: ['Morning', 'Cerato', 'Seltos'],
};

const MOCK_SPARE_PARTS = [
  'Bộ lọc dầu Toyota Vios',
  'Má phanh trước Honda City',
  'Dầu động cơ tổng hợp 5W30',
  'Lọc gió điều hòa',
  'Lốp xe Michelin Pilot Sport 4',
  'Bugi NGK Iridium',
  'Ắc quy GS 12V 45Ah',
];

const INITIAL_POLICIES: WarrantyPolicy[] = [
  {
    id: 1,
    name: 'Chính sách bảo hành Bộ lọc dầu Vios',
    vehicleMake: 'Toyota',
    vehicleModel: 'Vios',
    sparePart: 'Bộ lọc dầu Toyota Vios',
    warrantyType: 'TIME',
    durationMonths: 3,
    kmLimit: 0,
    isActive: true,
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 2,
    name: 'Chính sách bảo hành Má phanh Honda City',
    vehicleMake: 'Honda',
    vehicleModel: 'City',
    sparePart: 'Má phanh trước Honda City',
    warrantyType: 'BOTH',
    durationMonths: 6,
    kmLimit: 10000,
    isActive: true,
    createdAt: new Date('2026-02-20').toISOString(),
  },
  {
    id: 3,
    name: 'Chính sách bảo hành lốp Michelin CX-5',
    vehicleMake: 'Mazda',
    vehicleModel: 'CX-5',
    sparePart: 'Lốp xe Michelin Pilot Sport 4',
    warrantyType: 'DISTANCE',
    durationMonths: 0,
    kmLimit: 20000,
    isActive: true,
    createdAt: new Date('2026-03-05').toISOString(),
  },
];

export default function AdminWarrantyPolicies() {
  const { showToast } = useOutletContext<{
    showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  }>();

  const [policies, setPolicies] = useState<WarrantyPolicy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'TIME' | 'DISTANCE' | 'BOTH' | 'NONE'>('ALL');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<WarrantyPolicy | null>(null);

  // Load policies from localStorage or initialize
  useEffect(() => {
    const stored = localStorage.getItem('warranty_policies');
    if (stored) {
      try {
        setPolicies(JSON.parse(stored));
      } catch (e) {
        setPolicies(INITIAL_POLICIES);
      }
    } else {
      setPolicies(INITIAL_POLICIES);
      localStorage.setItem('warranty_policies', JSON.stringify(INITIAL_POLICIES));
    }
  }, []);

  const savePolicies = (newPolicies: WarrantyPolicy[]) => {
    setPolicies(newPolicies);
    localStorage.setItem('warranty_policies', JSON.stringify(newPolicies));
  };

  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (policy: WarrantyPolicy) => {
    setEditingPolicy(policy);
    setIsModalOpen(true);
  };

  const handleDelete = (policy: WarrantyPolicy) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chính sách bảo hành "${policy.name}"?`)) {
      const updated = policies.filter((p) => p.id !== policy.id);
      savePolicies(updated);
      showToast(`Đã xóa chính sách "${policy.name}" thành công.`, 'success');
    }
  };

  const handleSavePolicy = (data: Omit<WarrantyPolicy, 'id' | 'createdAt'>) => {
    let updated: WarrantyPolicy[];
    if (editingPolicy) {
      updated = policies.map((p) =>
        p.id === editingPolicy.id
          ? { ...editingPolicy, ...data }
          : p
      );
      showToast('Cập nhật chính sách bảo hành thành công.', 'success');
    } else {
      const newPolicy: WarrantyPolicy = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      updated = [...policies, newPolicy];
      showToast('Chính sách bảo hành đã được tạo thành công.', 'success');
    }
    savePolicies(updated);
    setIsModalOpen(false);
    setEditingPolicy(null);
  };

  // Filter list
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sparePart.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && p.isActive) ||
        (statusFilter === 'INACTIVE' && !p.isActive);

      const matchesType = typeFilter === 'ALL' || p.warrantyType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [policies, searchQuery, statusFilter, typeFilter]);

  const getWarrantyTypeLabel = (type: string) => {
    switch (type) {
      case 'TIME':
        return 'Thời gian';
      case 'DISTANCE':
        return 'Số KM';
      case 'BOTH':
        return 'Thời gian & Số KM';
      case 'NONE':
        return 'Không bảo hành';
      default:
        return type;
    }
  };

  const getWarrantyConditions = (policy: WarrantyPolicy) => {
    if (policy.warrantyType === 'NONE') return 'Không áp dụng bảo hành';
    const timeText = policy.durationMonths > 0 ? `${policy.durationMonths} tháng` : '';
    const kmText = policy.kmLimit > 0 ? `${policy.kmLimit.toLocaleString('vi-VN')} KM` : '';
    
    if (policy.warrantyType === 'BOTH') {
      return `${timeText} hoặc ${kmText} (tùy ĐK nào đến trước)`;
    }
    return timeText || kmText || '—';
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-2 flex items-center gap-2">
            <ShieldCheck className="text-amber-500" size={28} />
            Quản lý Chính sách Bảo hành
          </h1>
          <p className="text-slate-500 text-sm">
            Tạo và thiết lập các chính sách bảo hành tự động áp dụng cho phụ tùng và dòng xe tương ứng.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00285E] hover:bg-[#062047] text-white rounded-xl text-sm font-bold shadow-md shadow-[#00285E]/15 transition-all transform hover:translate-y-[-1px]"
        >
          <Plus size={16} />
          <span>Tạo chính sách mới</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc phụ tùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all"
          />
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter size={14} /> Lọc:
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00285E]/10"
          >
            <option value="ALL">Tất cả loại bảo hành</option>
            <option value="TIME">Theo Thời gian</option>
            <option value="DISTANCE">Theo Số KM</option>
            <option value="BOTH">Cả hai</option>
            <option value="NONE">Không bảo hành</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00285E]/10"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* POLICY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="py-4.5 px-6">Tên chính sách</th>
                <th className="py-4.5 px-4">Phụ tùng</th>
                <th className="py-4.5 px-4">Dòng xe áp dụng</th>
                <th className="py-4.5 px-4">Loại bảo hành</th>
                <th className="py-4.5 px-4">Điều kiện bảo hành</th>
                <th className="py-4.5 px-4 text-center">Trạng thái</th>
                <th className="py-4.5 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    Không tìm thấy chính sách bảo hành nào phù hợp...
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#00285E] text-sm block">
                        {policy.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Khởi tạo: {new Date(policy.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4 text-slate-700 text-xs font-semibold">
                      {policy.sparePart}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-100 rounded-lg px-2.5 py-1 w-fit border border-slate-200/60">
                        <Car size={13} className="text-slate-500" />
                        <span>{policy.vehicleMake} {policy.vehicleModel}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                        {getWarrantyTypeLabel(policy.warrantyType)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600 text-xs font-bold">
                      {getWarrantyConditions(policy)}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          policy.isActive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {policy.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(policy)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(policy)}
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

      {/* POLICY FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <WarrantyFormModal
            initial={editingPolicy}
            policies={policies}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPolicy(null);
            }}
            onSave={handleSavePolicy}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── WARRANTY FORM MODAL ──────────────────────────────────────────────────────
interface WarrantyFormModalProps {
  initial: WarrantyPolicy | null;
  policies: WarrantyPolicy[];
  onClose: () => void;
  onSave: (data: Omit<WarrantyPolicy, 'id' | 'createdAt'>) => void;
}

function WarrantyFormModal({ initial, policies, onClose, onSave }: WarrantyFormModalProps) {
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? '');
  const [vehicleMake, setVehicleMake] = useState(initial?.vehicleMake ?? '');
  const [vehicleModel, setVehicleModel] = useState(initial?.vehicleModel ?? '');
  const [sparePart, setSparePart] = useState(initial?.sparePart ?? '');
  const [warrantyType, setWarrantyType] = useState<'TIME' | 'DISTANCE' | 'BOTH' | 'NONE'>(initial?.warrantyType ?? 'TIME');
  const [durationMonths, setDurationMonths] = useState<number>(initial?.durationMonths ?? 12);
  const [kmLimit, setKmLimit] = useState<number>(initial?.kmLimit ?? 10000);
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);

  const [errorMsg, setErrorMsg] = useState('');

  // Dynamically filter models based on selected make
  const availableModels = useMemo(() => {
    if (!vehicleMake) return [];
    return MOCK_VEHICLE_DATA[vehicleMake] || [];
  }, [vehicleMake]);

  // Reset model if make changes and model is no longer valid
  useEffect(() => {
    if (vehicleMake && !MOCK_VEHICLE_DATA[vehicleMake]?.includes(vehicleModel)) {
      setVehicleModel('');
    }
  }, [vehicleMake]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên chính sách bảo hành.');
      return;
    }
    if (!vehicleMake) {
      setErrorMsg('Vui lòng chọn hãng xe áp dụng.');
      return;
    }
    if (!vehicleModel) {
      setErrorMsg('Vui lòng chọn dòng xe áp dụng.');
      return;
    }
    if (!sparePart) {
      setErrorMsg('Vui lòng chọn phụ tùng liên kết.');
      return;
    }

    if (warrantyType === 'TIME' || warrantyType === 'BOTH') {
      if (durationMonths <= 0 || isNaN(durationMonths)) {
        setErrorMsg('Thời hạn bảo hành (Tháng) phải lớn hơn 0.');
        return;
      }
    }

    if (warrantyType === 'DISTANCE' || warrantyType === 'BOTH') {
      if (kmLimit <= 0 || isNaN(kmLimit)) {
        setErrorMsg('Giới hạn quãng đường bảo hành (KM) phải lớn hơn 0.');
        return;
      }
    }

    // Check duplicate check: "Duplicate warranty policies are not allowed for the same combination of Spare Part, Vehicle Make, and Vehicle Model."
    const isDuplicate = policies.some(
      (p) =>
        p.sparePart === sparePart &&
        p.vehicleMake === vehicleMake &&
        p.vehicleModel === vehicleModel &&
        p.id !== initial?.id
    );

    if (isDuplicate) {
      setErrorMsg(
        `Chính sách bảo hành cho sự kết hợp giữa phụ tùng "${sparePart}", hãng xe "${vehicleMake}", dòng xe "${vehicleModel}" đã tồn tại trên hệ thống.`
      );
      return;
    }

    // Clear error and save
    setErrorMsg('');
    onSave({
      name: name.trim(),
      vehicleMake,
      vehicleModel,
      sparePart,
      warrantyType,
      durationMonths: (warrantyType === 'TIME' || warrantyType === 'BOTH') ? durationMonths : 0,
      kmLimit: (warrantyType === 'DISTANCE' || warrantyType === 'BOTH') ? kmLimit : 0,
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/60 w-full max-w-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-[#00285E] tracking-tight">
              {isEdit ? 'Cập nhật chính sách bảo hành' : 'Tạo chính sách bảo hành mới'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập quy tắc bảo hành theo thời gian và số KM áp dụng cho dòng xe cụ thể.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Policy Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Tên chính sách bảo hành *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vd: Bảo hành lỗi kỹ thuật 6 tháng cho Má Phanh Honda City"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
            />
          </div>

          {/* Vehicle Make & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Hãng xe áp dụng *
              </label>
              <select
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
              >
                <option value="">-- Chọn hãng xe --</option>
                {Object.keys(MOCK_VEHICLE_DATA).map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Dòng xe áp dụng *
              </label>
              <select
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                disabled={!vehicleMake}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700 disabled:opacity-50"
              >
                <option value="">-- Chọn dòng xe --</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Linked Spare Part */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Phụ tùng liên kết *
            </label>
            <select
              value={sparePart}
              onChange={(e) => setSparePart(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
            >
              <option value="">-- Chọn loại phụ tùng --</option>
              {MOCK_SPARE_PARTS.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>
          </div>

          {/* Warranty Type & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Loại bảo hành *
              </label>
              <select
                value={warrantyType}
                onChange={(e) => setWarrantyType(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
              >
                <option value="TIME">Theo Thời gian</option>
                <option value="DISTANCE">Theo Số KM</option>
                <option value="BOTH">Thời gian & KM</option>
                <option value="NONE">Không bảo hành</option>
              </select>
            </div>

            {/* Warranty Period (months) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Thời hạn (Tháng)
              </label>
              <input
                type="number"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                disabled={warrantyType === 'DISTANCE' || warrantyType === 'NONE'}
                min={1}
                placeholder="Vd: 6"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 disabled:opacity-40"
              />
            </div>

            {/* Warranty KM Limit */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Giới hạn (KM)
              </label>
              <input
                type="number"
                value={kmLimit}
                onChange={(e) => setKmLimit(Number(e.target.value))}
                disabled={warrantyType === 'TIME' || warrantyType === 'NONE'}
                min={1}
                placeholder="Vd: 10000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 disabled:opacity-40"
              />
            </div>
          </div>

          {/* Active checkbox */}
          <div className="flex items-center gap-2.5 pt-2 select-none">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-slate-300 text-[#00285E] focus:ring-[#00285E]/20"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Kích hoạt chính sách này
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2 flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#F9A11B] text-[#00285E] rounded-xl text-sm font-bold shadow-md shadow-[#F9A11B]/20 hover:bg-[#E08F12] transition-all"
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo chính sách'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
