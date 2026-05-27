import { useState } from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

interface WarrantySettingsProps {
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function WarrantySettings({ showToast }: WarrantySettingsProps) {
  // Warranty Policy States
  const [warrantyPolicies, setWarrantyPolicies] = useState([
    { id: 1, name: 'Bảo dưỡng định kỳ', duration: '3 tháng', condition: 'Hoặc 5,000 km (tùy ĐK nào đến trước)' },
    { id: 2, name: 'Phụ tùng chính hãng', duration: '6 tháng', condition: 'Bảo hành lỗi kỹ thuật từ nhà sản xuất' },
    { id: 3, name: 'Đại tu động cơ & hộp số', duration: '12 tháng', condition: 'Hoặc 20,000 km. Không bao gồm hao mòn tự nhiên' }
  ]);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDuration, setNewPolicyDuration] = useState('3 tháng');
  const [newPolicyCondition, setNewPolicyCondition] = useState('');

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName.trim()) return;
    const newPolicy = {
      id: Date.now(),
      name: newPolicyName,
      duration: newPolicyDuration,
      condition: newPolicyCondition || 'Không áp dụng điều kiện phụ'
    };
    setWarrantyPolicies([...warrantyPolicies, newPolicy]);
    setNewPolicyName('');
    setNewPolicyCondition('');
    showToast('Đã thêm chính sách bảo hành mới!', 'success');
  };

  const handleDeletePolicy = (id: number) => {
    setWarrantyPolicies(warrantyPolicies.filter(p => p.id !== id));
    showToast('Đã xóa chính sách bảo hành!', 'warning');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* List of Policies */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="text-[#00285E]" size={20} />
          Danh sách chính sách bảo hành
        </h2>

        <div className="space-y-4">
          {warrantyPolicies.map((policy) => (
            <div
              key={policy.id}
              className="flex items-start justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-100/40 relative group"
            >
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm md:text-base">{policy.name}</span>
                  <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">
                    {policy.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">{policy.condition}</p>
              </div>

              <button
                onClick={() => handleDeletePolicy(policy.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form to Add Policy */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Plus className="text-[#00285E]" size={18} />
          Tạo chính sách mới
        </h2>

        <form onSubmit={handleAddPolicy} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tên dịch vụ/phần bảo hành
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Thay dầu động cơ"
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Thời hạn bảo hành
            </label>
            <select
              value={newPolicyDuration}
              onChange={(e) => setNewPolicyDuration(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
            >
              <option value="1 tháng">1 tháng</option>
              <option value="3 tháng">3 tháng</option>
              <option value="6 tháng">6 tháng</option>
              <option value="12 tháng">12 tháng</option>
              <option value="24 tháng">24 tháng</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Điều kiện áp dụng
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Hoặc 10,000 km tùy điều kiện nào..."
              value={newPolicyCondition}
              onChange={(e) => setNewPolicyCondition(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00285E] hover:bg-[#062047] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#00285E]/10 active:scale-[0.98]"
          >
            Thêm chính sách
          </button>
        </form>
      </div>
    </div>
  );
}
