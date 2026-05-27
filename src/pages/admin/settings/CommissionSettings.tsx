import { useState } from 'react';
import { Calculator, Plus, Edit, Trash2 } from 'lucide-react';

interface CommissionSettingsProps {
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function CommissionSettings({ showToast }: CommissionSettingsProps) {
  // Commission Rules States
  const [commissionRules, setCommissionRules] = useState([
    {
      id: 1,
      role: 'Kỹ thuật viên chính',
      type: 'percentage',
      value: 10,
      applyTo: 'revenue_labor',
      description: 'Hưởng 10% trên tổng giá trị công thợ thực hiện'
    },
    {
      id: 2,
      role: 'Cố vấn dịch vụ',
      type: 'percentage',
      value: 2.5,
      applyTo: 'revenue_total',
      description: 'Hưởng 2.5% trên tổng hóa đơn (gồm cả công và phụ tùng)'
    },
    {
      id: 3,
      role: 'Kỹ thuật viên phụ',
      type: 'fixed',
      value: 50000,
      applyTo: 'per_order',
      description: 'Nhận 50,000 VND cố định cho mỗi lượt xe hỗ trợ'
    }
  ]);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [ruleRole, setRuleRole] = useState('');
  const [ruleType, setRuleType] = useState<'percentage' | 'fixed'>('percentage');
  const [ruleValue, setRuleValue] = useState('');
  const [ruleApplyTo, setRuleApplyTo] = useState('revenue_labor');
  const [ruleDescription, setRuleDescription] = useState('');

  const handleOpenCreateRule = () => {
    setEditingRule(null);
    setRuleRole('');
    setRuleType('percentage');
    setRuleValue('');
    setRuleApplyTo('revenue_labor');
    setRuleDescription('');
    setIsCommissionModalOpen(true);
  };

  const handleOpenEditRule = (rule: any) => {
    setEditingRule(rule);
    setRuleRole(rule.role);
    setRuleType(rule.type);
    setRuleValue(rule.value.toString());
    setRuleApplyTo(rule.applyTo);
    setRuleDescription(rule.description);
    setIsCommissionModalOpen(true);
  };

  const handleSaveCommissionRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleRole.trim() || !ruleValue) return;

    const valueNum = parseFloat(ruleValue);
    const applyToLabel = 
      ruleApplyTo === 'revenue_labor' ? 'giá trị công thợ thực hiện' :
      ruleApplyTo === 'revenue_total' ? 'tổng hóa đơn dịch vụ' : 'lượt xe hỗ trợ sửa chữa';
    const autoDesc = ruleType === 'percentage' 
      ? `Hưởng ${valueNum}% trên ${applyToLabel}`
      : `Nhận ${valueNum.toLocaleString()} VND cố định cho mỗi ${applyToLabel}`;

    const ruleData = {
      id: editingRule ? editingRule.id : Date.now(),
      role: ruleRole,
      type: ruleType,
      value: valueNum,
      applyTo: ruleApplyTo,
      description: ruleDescription.trim() || autoDesc
    };

    if (editingRule) {
      setCommissionRules(commissionRules.map(r => r.id === editingRule.id ? ruleData : r));
      showToast('Đã cập nhật quy tắc tính hoa hồng thành công!', 'success');
    } else {
      setCommissionRules([...commissionRules, ruleData]);
      showToast('Đã tạo quy tắc tính hoa hồng mới thành công!', 'success');
    }
    setIsCommissionModalOpen(false);
  };

  const handleDeleteCommissionRule = (id: number) => {
    setCommissionRules(commissionRules.filter(r => r.id !== id));
    showToast('Đã xóa quy tắc tính hoa hồng!', 'warning');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-[#00285E]" size={20} />
            Quy tắc tính hoa hồng nhân sự
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Cấu hình cách tính hoa hồng cho kỹ thuật viên, cố vấn dịch vụ và nhân sự khác theo % doanh thu hoặc số tiền cố định.
          </p>
        </div>
        <button
          onClick={handleOpenCreateRule}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#00285E] hover:bg-[#062047] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#00285E]/10"
        >
          <Plus size={14} />
          <span>Thêm quy tắc</span>
        </button>
      </div>

      <div className="space-y-4">
        {commissionRules.map((rule) => (
          <div
            key={rule.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-100/40 gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-800 text-base">{rule.role}</span>
                <span className="bg-blue-50 text-[#00285E] text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-100 uppercase tracking-wider">
                  {rule.applyTo === 'revenue_labor' ? 'Doanh thu công thợ' :
                   rule.applyTo === 'revenue_total' ? 'Tổng hóa đơn' : 'Lượt xe'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">{rule.description}</p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-lg md:text-xl font-extrabold text-[#00285E]">
                  {rule.type === 'percentage' ? `${rule.value}%` : `${rule.value.toLocaleString()} VND`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditRule(rule)}
                  className="text-slate-400 hover:text-[#00285E] transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCommissionRule(rule.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMMISSION EDIT/CREATE MODAL */}
      {isCommissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCommissionModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl border border-slate-200/50 shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all font-sans">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator className="text-[#00285E]" size={20} />
              {editingRule ? 'Cập nhật quy tắc hoa hồng' : 'Thêm quy tắc hoa hồng mới'}
            </h3>

            <form onSubmit={handleSaveCommissionRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Vai trò áp dụng
                </label>
                <select
                  value={ruleRole}
                  onChange={(e) => setRuleRole(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
                >
                  <option value="">Chọn vai trò...</option>
                  <option value="Kỹ thuật viên chính">Kỹ thuật viên chính</option>
                  <option value="Kỹ thuật viên phụ">Kỹ thuật viên phụ</option>
                  <option value="Cố vấn dịch vụ">Cố vấn dịch vụ</option>
                  <option value="Nhân viên rửa xe">Nhân viên rửa xe</option>
                  <option value="Nhân viên lễ tân">Nhân viên lễ tân</option>
                  <option value="Điều phối viên">Điều phối viên</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Loại tính hoa hồng
                  </label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
                  >
                    <option value="percentage">Theo phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VND)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Mức hoa hồng
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      type="number"
                      value={ruleValue}
                      onChange={(e) => setRuleValue(e.target.value)}
                      placeholder={ruleType === 'percentage' ? 'Ví dụ: 10' : 'Ví dụ: 50000'}
                      required
                      min="0"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-slate-400 font-bold text-xs">
                        {ruleType === 'percentage' ? '%' : 'VND'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Áp dụng tính theo
                </label>
                <select
                  value={ruleApplyTo}
                  onChange={(e) => setRuleApplyTo(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
                >
                  <option value="revenue_labor">Doanh thu công thợ</option>
                  <option value="revenue_total">Tổng hóa đơn dịch vụ</option>
                  <option value="per_order">Lượt xe hỗ trợ sửa chữa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Mô tả quy tắc (Tự động tạo nếu bỏ trống)</span>
                  <span className="text-[10px] text-slate-400 lowercase font-medium">Tùy chọn</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Nhận 10% hoa hồng trên tổng công thợ của đơn hàng được giao."
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-semibold text-white bg-[#00285E] hover:bg-[#062047] rounded-xl transition-all shadow-md shadow-[#00285E]/10"
                >
                  {editingRule ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
