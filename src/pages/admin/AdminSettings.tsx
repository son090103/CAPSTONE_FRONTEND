import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import {
  Store,
  Clock,
  Calendar,
  Save,
  Coins,
  ShieldCheck,
  BellRing,
  Plus,
  Trash2,
  Edit,
  Calculator,
  AlertCircle,
  Tag
} from 'lucide-react';

// Define the tabs
type TabType = 'general' | 'pricing' | 'warranty' | 'commission' | 'notifications';

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function AdminSettings() {
  const { showToast } = useOutletContext<{
    showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  }>();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // General Settings Form States
  const [garageName, setGarageName] = useState('AGM Intelligent');
  const [phone, setPhone] = useState('090 1234 567');
  const [address, setAddress] = useState('123 Đường số 4, Khu Công Nghệ Cao, Thủ Đức, TP.HCM');
  const [email, setEmail] = useState('contact@agm-intelligent.vn');
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Operating Hours State
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [hours, setHours] = useState({
    weekday: '08:00 - 18:00',
    saturday: '08:00 - 16:00',
    sunday: 'Đóng cửa'
  });

  // Sub-tab state for Pricing tab
  const [pricingSubTab, setPricingSubTab] = useState<'rules' | 'policies'>('rules');

  // Pricing Rules States
  const [laborRate, setLaborRate] = useState('300000');
  const [servicePrices, setServicePrices] = useState([
    { id: '1', name: 'Thay dầu động cơ & lọc nhớt', price: '250000', promoPrice: '200000' },
    { id: '2', name: 'Bảo dưỡng hệ thống phanh 4 bánh', price: '450000', promoPrice: '380000' },
    { id: '3', name: 'Cân chỉnh thước lái 3D', price: '600000', promoPrice: '500000' },
    { id: '4', name: 'Gói combo bảo dưỡng định kỳ AGM Standard', price: '1200000', promoPrice: '990000' },
    { id: '5', name: 'Gói combo vệ sinh khoang máy & nội thất AGM Pro', price: '2500000', promoPrice: '1990000' }
  ]);
  const [membershipDiscounts, setMembershipDiscounts] = useState({
    silver: '5',
    gold: '10',
    platinum: '15'
  });
  const [pricingEffectiveDate, setPricingEffectiveDate] = useState('');
  const [errorsPricingRules, setErrorsPricingRules] = useState<Record<string, string>>({});
  const [isSavingPricingRules, setIsSavingPricingRules] = useState(false);

  // Pricing Policies States
  const [pricingPolicies, setPricingPolicies] = useState([
    { id: 1, category: 'Dầu nhớt & Phụ gia', markupRate: 15, discountRate: 0.05, startDate: '2026-06-01', endDate: '2026-12-31' },
    { id: 2, category: 'Hệ thống phanh', markupRate: 20, discountRate: 0.10, startDate: '', endDate: '' },
    { id: 3, category: 'Lốp & Mâm xe', markupRate: 10, discountRate: 0.08, startDate: '2026-07-01', endDate: '' }
  ]);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const [policyCategory, setPolicyCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [policyMarkup, setPolicyMarkup] = useState('0');
  const [policyDiscount, setPolicyDiscount] = useState('0');
  const [policyStartDate, setPolicyStartDate] = useState('');
  const [policyEndDate, setPolicyEndDate] = useState('');
  const [policyErrors, setPolicyErrors] = useState<Record<string, string>>({});

  // Warranty Policy States
  const [warrantyPolicies, setWarrantyPolicies] = useState([
    { id: 1, name: 'Bảo dưỡng định kỳ', duration: '3 tháng', condition: 'Hoặc 5,000 km (tùy ĐK nào đến trước)' },
    { id: 2, name: 'Phụ tùng chính hãng', duration: '6 tháng', condition: 'Bảo hành lỗi kỹ thuật từ nhà sản xuất' },
    { id: 3, name: 'Đại tu động cơ & hộp số', duration: '12 tháng', condition: 'Hoặc 20,000 km. Không bao gồm hao mòn tự nhiên' }
  ]);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDuration, setNewPolicyDuration] = useState('3 tháng');
  const [newPolicyCondition, setNewPolicyCondition] = useState('');

  // Notification States
  const [notifications, setNotifications] = useState({
    smsOnComplete: true,
    emailWeekly: true,
    autoReminder: false,
    telegramAlert: true
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

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

  const tabs: TabItem[] = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'pricing', label: 'Quy tắc giá phụ tùng', icon: Coins },
    { id: 'warranty', label: 'Warranty Policies', icon: ShieldCheck },
    { id: 'commission', label: 'Commission Rules', icon: Calculator },
    { id: 'notifications', label: 'Notifications', icon: BellRing }
  ];

  // Save Handlers
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    setTimeout(() => {
      setIsSavingGeneral(false);
      showToast('Đã lưu thông tin cấu hình Garage thành công!', 'success');
    }, 1000);
  };

  // Pricing Rules Validation & Save Handlers
  const validatePricingRules = () => {
    const errs: Record<string, string> = {};
    if (!laborRate || parseFloat(laborRate) <= 0) {
      errs.laborRate = 'Giá công thợ phải lớn hơn 0';
    }

    servicePrices.forEach((item, index) => {
      if (!item.price || parseFloat(item.price) <= 0) {
        errs[`service_${index}_price`] = 'Giá dịch vụ phải lớn hơn 0';
      }
      if (item.promoPrice) {
        const pVal = parseFloat(item.price);
        const promoVal = parseFloat(item.promoPrice);
        if (promoVal <= 0) {
          errs[`service_${index}_promo`] = 'Giá khuyến mãi phải lớn hơn 0';
        }
        if (promoVal >= pVal) {
          errs[`service_${index}_promo`] = 'Giá khuyến mãi phải nhỏ hơn giá niêm yết';
        }
      }
    });

    Object.entries(membershipDiscounts).forEach(([tier, val]) => {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0 || num > 100) {
        errs[`discount_${tier}`] = 'Chiết khấu phải từ 0% đến 100%';
      }
    });

    if (!pricingEffectiveDate) {
      errs.effectiveDate = 'Vui lòng chọn ngày hiệu lực';
    } else {
      const selected = new Date(pricingEffectiveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        errs.effectiveDate = 'Ngày hiệu lực phải là một ngày trong tương lai';
      }
    }

    setErrorsPricingRules(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePricingRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePricingRules()) {
      showToast('Vui lòng kiểm tra lại các trường thông tin!', 'warning');
      return;
    }

    setIsSavingPricingRules(true);
    setTimeout(() => {
      setIsSavingPricingRules(false);
      showToast('Cấu hình biểu phí dịch vụ đã được cập nhật thành công.', 'success');
    }, 1000);
  };

  // Pricing Policies Validation & Save Handlers
  const validatePolicyItem = () => {
    const errs: Record<string, string> = {};
    const finalCategory = policyCategory === 'Khác' ? customCategory : policyCategory;
    if (!finalCategory || !finalCategory.trim()) {
      errs.category = 'Danh mục phụ tùng không được bỏ trống';
    }

    const markupVal = parseFloat(policyMarkup);
    if (isNaN(markupVal) || markupVal < 0 || markupVal > 1000) {
      errs.markup = 'Tỷ lệ markup phải từ 0 đến 1000';
    }

    const discountVal = parseFloat(policyDiscount);
    if (isNaN(discountVal) || discountVal < 0 || discountVal > 1) {
      errs.discount = 'Tỷ lệ chiết khấu phải từ 0 đến 1 (ví dụ: 0.1 = 10%)';
    }

    if (policyStartDate && policyEndDate) {
      const start = new Date(policyStartDate);
      const end = new Date(policyEndDate);
      if (start >= end) {
        errs.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setPolicyErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenCreatePolicy = () => {
    setEditingPolicy(null);
    setPolicyCategory('');
    setCustomCategory('');
    setPolicyMarkup('0');
    setPolicyDiscount('0');
    setPolicyStartDate('');
    setPolicyEndDate('');
    setPolicyErrors({});
    setIsPolicyModalOpen(true);
  };

  const handleOpenEditPolicy = (policy: any) => {
    const exists = pricingPolicies.some(p => p.id === policy.id);
    if (!exists) {
      showToast('Không tìm thấy chính sách giá.', 'warning');
      return;
    }

    setEditingPolicy(policy);
    const standardCategories = ['Dầu nhớt & Phụ gia', 'Hệ thống phanh', 'Lốp & Mâm xe', 'Hệ thống điện', 'Động cơ & Truyền động', 'Hệ thống treo & Lái'];
    if (standardCategories.includes(policy.category)) {
      setPolicyCategory(policy.category);
      setCustomCategory('');
    } else {
      setPolicyCategory('Khác');
      setCustomCategory(policy.category);
    }
    setPolicyMarkup(policy.markupRate.toString());
    setPolicyDiscount(policy.discountRate.toString());
    setPolicyStartDate(policy.startDate || '');
    setPolicyEndDate(policy.endDate || '');
    setPolicyErrors({});
    setIsPolicyModalOpen(true);
  };

  const handleSavePolicyItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePolicyItem()) {
      return;
    }

    const finalCategory = policyCategory === 'Khác' ? customCategory : policyCategory;

    // Simulate Server Error (HTTP 500)
    if (finalCategory === 'Server Error') {
      showToast('Server error', 'warning');
      return;
    }

    const policyData = {
      id: editingPolicy ? editingPolicy.id : Date.now(),
      category: finalCategory,
      markupRate: parseFloat(policyMarkup),
      discountRate: parseFloat(policyDiscount),
      startDate: policyStartDate,
      endDate: policyEndDate
    };

    if (editingPolicy) {
      const exists = pricingPolicies.some(p => p.id === editingPolicy.id);
      if (!exists) {
        showToast('Không tìm thấy chính sách giá.', 'warning');
        return;
      }
      setPricingPolicies(pricingPolicies.map(p => p.id === editingPolicy.id ? policyData : p));
      showToast('Chính sách giá đã được cập nhật thành công.', 'success');
    } else {
      setPricingPolicies([...pricingPolicies, policyData]);
      showToast('Chính sách giá được tạo thành công', 'success');
    }
    setIsPolicyModalOpen(false);
  };

  const handleDeletePolicyItem = (id: number) => {
    const exists = pricingPolicies.some(p => p.id === id);
    if (!exists) {
      showToast('Không tìm thấy chính sách giá.', 'warning');
      return;
    }
    setPricingPolicies(pricingPolicies.filter(p => p.id !== id));
    showToast('Đã xóa chính sách giá thành công.', 'success');
  };

  const handleSaveNotifications = () => {
    setIsSavingNotifications(true);
    setTimeout(() => {
      setIsSavingNotifications(false);
      showToast('Đã đồng bộ tùy chọn thông báo hệ thống!', 'success');
    }, 800);
  };

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
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto font-sans">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-2">Cài đặt hệ thống</h1>
        <p className="text-slate-500 text-sm">
          Quản lý cấu hình dịch vụ, chính sách bảo hành và thông tin chung của Garage.
        </p>
      </div>

      {/* HORIZONTAL TAB NAVIGATION */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${isActive
                  ? 'border-[#00285E] text-[#00285E]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                <Icon size={16} className={isActive ? 'text-[#00285E]' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB CONTENT WITH ANIMATION */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Card: Thông tin Garage */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Store className="text-[#00285E]" size={20} />
                    Thông tin Garage
                  </h2>
                  <form onSubmit={handleSaveGeneral} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Tên Garage
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={garageName}
                            onChange={(e) => setGarageName(e.target.value)}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Email liên hệ
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-medium text-slate-800"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSavingGeneral}
                        className="flex items-center gap-2 px-6 py-3 bg-[#00285E] hover:bg-[#062047] disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00285E]/10 hover:shadow-lg transition-all active:scale-[0.98]"
                      >
                        <Save size={16} />
                        <span>{isSavingGeneral ? 'Đang lưu...' : 'Lưu thông tin'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Card: Giờ hoạt động */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Clock className="text-[#00285E]" size={20} />
                    Giờ hoạt động
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                      <span className="font-bold text-slate-700 text-sm">Thứ 2 - Thứ 6</span>
                      <span className="text-slate-500 font-semibold text-sm">{hours.weekday}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                      <span className="font-bold text-slate-700 text-sm">Thứ 7</span>
                      <span className="text-slate-500 font-semibold text-sm">{hours.saturday}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="font-bold text-slate-700 text-sm">Chủ Nhật</span>
                      <span className="text-rose-500 font-bold text-sm">{hours.sunday}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsHoursModalOpen(true)}
                    className="w-full text-center py-3 text-sm font-bold text-[#00285E] hover:text-white border-2 border-[#00285E] hover:bg-[#00285E] rounded-xl transition-all shadow-xs active:scale-[0.98]"
                  >
                    Chỉnh sửa lịch
                  </button>
                </div>
              </div>
            )}

            {/* PRICING RULES & POLICIES TAB */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                {/* SUB-TABS NAVIGATION */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setPricingSubTab('rules')}
                    className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                      pricingSubTab === 'rules'
                        ? 'border-[#00285E] text-[#00285E]'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Coins size={16} />
                    Cấu hình biểu phí dịch vụ
                  </button>
                  <button
                    onClick={() => setPricingSubTab('policies')}
                    className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                      pricingSubTab === 'policies'
                        ? 'border-[#00285E] text-[#00285E]'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Tag size={16} />
                    Quy tắc giá phụ tùng
                  </button>
                </div>

                {/* RULES SUB-TAB */}
                {pricingSubTab === 'rules' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Coins className="text-[#00285E]" size={20} />
                      Cấu hình biểu phí & Chiết khấu dịch vụ
                    </h2>

                    <form onSubmit={handleSavePricingRules} className="space-y-6">
                      {/* LABOR HOURLY RATE */}
                      <div className="border-b border-slate-100 pb-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-4">Chi phí nhân công</h3>
                        <div className="max-w-md">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Giá công thợ mặc định (/giờ) *
                          </label>
                          <div className="relative rounded-xl shadow-xs">
                            <input
                              type="number"
                              value={laborRate}
                              onChange={(e) => setLaborRate(e.target.value)}
                              className={`w-full bg-white border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                                errorsPricingRules.laborRate ? 'border-rose-500' : 'border-slate-200'
                              }`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                              <span className="text-slate-400 font-bold text-xs">VND</span>
                            </div>
                          </div>
                          {errorsPricingRules.laborRate && (
                            <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errorsPricingRules.laborRate}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* SERVICE ITEM PRICES */}
                      <div className="border-b border-slate-100 pb-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-4">Biểu giá dịch vụ & Gói combo</h3>
                        <div className="space-y-4">
                          {servicePrices.map((service, index) => (
                            <div key={service.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                              <div className="md:col-span-6">
                                <span className="text-sm font-bold text-slate-700 block">{service.name}</span>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">
                                  Giá niêm yết (VND) *
                                </label>
                                <div className="relative rounded-xl shadow-xs">
                                  <input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) => {
                                      const updated = [...servicePrices];
                                      updated[index].price = e.target.value;
                                      setServicePrices(updated);
                                    }}
                                    className={`w-full bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                                      errorsPricingRules[`service_${index}_price`] ? 'border-rose-500' : 'border-slate-200'
                                    }`}
                                  />
                                </div>
                                {errorsPricingRules[`service_${index}_price`] && (
                                  <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    {errorsPricingRules[`service_${index}_price`]}
                                  </p>
                                )}
                              </div>
                              <div className="md:col-span-3">
                                <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">
                                  Giá khuyến mãi (VND)
                                </label>
                                <div className="relative rounded-xl shadow-xs">
                                  <input
                                    type="number"
                                    placeholder="Không áp dụng"
                                    value={service.promoPrice}
                                    onChange={(e) => {
                                      const updated = [...servicePrices];
                                      updated[index].promoPrice = e.target.value;
                                      setServicePrices(updated);
                                    }}
                                    className={`w-full bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                                      errorsPricingRules[`service_${index}_promo`] ? 'border-rose-500' : 'border-slate-200'
                                    }`}
                                  />
                                </div>
                                {errorsPricingRules[`service_${index}_promo`] && (
                                  <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    {errorsPricingRules[`service_${index}_promo`]}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MEMBERSHIP TIER DISCOUNTS */}
                      <div className="border-b border-slate-100 pb-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-4">Chiết khấu theo hạng thành viên</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Hạng Bạc (Silver) % *
                            </label>
                            <div className="relative rounded-xl shadow-xs">
                              <input
                                type="number"
                                value={membershipDiscounts.silver}
                                onChange={(e) => setMembershipDiscounts({ ...membershipDiscounts, silver: e.target.value })}
                                className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                                  errorsPricingRules.discount_silver ? 'border-rose-500' : 'border-slate-200'
                                }`}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-slate-400 font-bold text-xs">%</span>
                              </div>
                            </div>
                            {errorsPricingRules.discount_silver && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errorsPricingRules.discount_silver}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Hạng Vàng (Gold) % *
                            </label>
                            <div className="relative rounded-xl shadow-xs">
                              <input
                                type="number"
                                value={membershipDiscounts.gold}
                                onChange={(e) => setMembershipDiscounts({ ...membershipDiscounts, gold: e.target.value })}
                                className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                                  errorsPricingRules.discount_gold ? 'border-rose-500' : 'border-slate-200'
                                }`}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-slate-400 font-bold text-xs">%</span>
                              </div>
                            </div>
                            {errorsPricingRules.discount_gold && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errorsPricingRules.discount_gold}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Hạng Kim Cương (Platinum) % *
                            </label>
                            <div className="relative rounded-xl shadow-xs">
                              <input
                                type="number"
                                value={membershipDiscounts.platinum}
                                onChange={(e) => setMembershipDiscounts({ ...membershipDiscounts, platinum: e.target.value })}
                                className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                                  errorsPricingRules.discount_platinum ? 'border-rose-500' : 'border-slate-200'
                                }`}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-slate-400 font-bold text-xs">%</span>
                              </div>
                            </div>
                            {errorsPricingRules.discount_platinum && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errorsPricingRules.discount_platinum}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* EFFECTIVE DATE */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-4">Ngày áp dụng biểu phí</h3>
                        <div className="max-w-md">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Ngày hiệu lực biểu phí mới *
                          </label>
                          <input
                            type="date"
                            value={pricingEffectiveDate}
                            onChange={(e) => setPricingEffectiveDate(e.target.value)}
                            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                              errorsPricingRules.effectiveDate ? 'border-rose-500' : 'border-slate-200'
                            }`}
                          />
                          {errorsPricingRules.effectiveDate && (
                            <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errorsPricingRules.effectiveDate}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* SUBMIT BUTTON */}
                      <div className="flex justify-end border-t border-slate-100 pt-6">
                        <button
                          type="submit"
                          disabled={isSavingPricingRules}
                          className="flex items-center gap-2 px-6 py-3 bg-[#00285E] hover:bg-[#062047] disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00285E]/10 hover:shadow-lg transition-all active:scale-[0.98]"
                        >
                          <Save size={16} />
                          <span>{isSavingPricingRules ? 'Đang cập nhật...' : 'Lưu biểu phí'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* POLICIES SUB-TAB */}
                {pricingSubTab === 'policies' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <Tag className="text-[#00285E]" size={20} />
                          Danh sách quy tắc định giá phụ tùng
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">
                          Thiết lập hệ số markup biên lợi nhuận và giảm giá tối đa cho từng nhóm hàng phụ tùng cụ thể.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenCreatePolicy}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#00285E] hover:bg-[#062047] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#00285E]/10 hover:shadow-lg self-start sm:self-center"
                      >
                        <Plus size={14} />
                        <span>Tạo chính sách giá</span>
                      </button>
                    </div>

                    {/* TABLE / LIST OF POLICIES */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-slate-600">
                        <thead>
                          <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <th className="py-4 px-4">Nhóm phụ tùng</th>
                            <th className="py-4 px-4 text-center">Markup Rate</th>
                            <th className="py-4 px-4 text-center">Discount Rate</th>
                            <th className="py-4 px-4">Ngày áp dụng</th>
                            <th className="py-4 px-4">Trạng thái</th>
                            <th className="py-4 px-4 text-right">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricingPolicies.map((policy) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const start = policy.startDate ? new Date(policy.startDate) : null;
                            const end = policy.endDate ? new Date(policy.endDate) : null;

                            let statusText = 'Đang áp dụng';
                            let statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                            if (start && start > today) {
                              statusText = 'Chưa hiệu lực';
                              statusColor = 'bg-blue-50 text-blue-600 border-blue-100';
                            } else if (end && end < today) {
                              statusText = 'Hết hiệu lực';
                              statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
                            } else if (!start && !end) {
                              statusText = 'Vô thời hạn';
                              statusColor = 'bg-indigo-50 text-indigo-600 border-indigo-100';
                            }

                            return (
                              <tr key={policy.id} className="border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4 font-bold text-slate-800 text-sm">
                                  {policy.category}
                                </td>
                                <td className="py-4 px-4 text-center font-extrabold text-slate-700 text-sm">
                                  +{policy.markupRate}%
                                </td>
                                <td className="py-4 px-4 text-center font-extrabold text-indigo-600 text-sm">
                                  -{policy.discountRate * 100}%
                                </td>
                                <td className="py-4 px-4 text-xs font-semibold text-slate-500">
                                  {policy.startDate || policy.endDate ? (
                                    <>
                                      {policy.startDate ? policy.startDate : 'Bất đầu'}
                                      <span className="mx-1">→</span>
                                      {policy.endDate ? policy.endDate : 'Vô hạn'}
                                    </>
                                  ) : (
                                    <span className="text-slate-400">Áp dụng vô thời hạn</span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleOpenEditPolicy(policy)}
                                      className="text-slate-400 hover:text-[#00285E] transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePolicyItem(policy.id)}
                                      className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                                      title="Xóa"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WARRANTY POLICIES TAB */}
            {activeTab === 'warranty' && (
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
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BellRing className="text-[#00285E]" size={20} />
                  Cấu hình thông báo tự động
                </h2>

                <div className="space-y-6">
                  {/* SMS On Complete */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-slate-800 text-sm md:text-base block">
                        Gửi SMS khi hoàn thành sửa chữa
                      </span>
                      <span className="text-xs text-slate-400 font-semibold block">
                        Tự động nhắn tin Zalo/SMS cho chủ xe kèm link hóa đơn điện tử khi KTV hoàn tất xe.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.smsOnComplete}
                        onChange={(e) => setNotifications({ ...notifications, smsOnComplete: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
                    </label>
                  </div>

                  {/* Weekly email report */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-slate-800 text-sm md:text-base block">
                        Báo cáo tuần cho Quản trị viên
                      </span>
                      <span className="text-xs text-slate-400 font-semibold block">
                        Gửi email tổng hợp doanh thu, lượng xe dịch vụ và các mặt hàng sắp hết kho vào mỗi thứ 2.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailWeekly}
                        onChange={(e) => setNotifications({ ...notifications, emailWeekly: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
                    </label>
                  </div>

                  {/* Auto maintenance reminder */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-slate-800 text-sm md:text-base block">
                        Tự động nhắc lịch bảo dưỡng định kỳ
                      </span>
                      <span className="text-xs text-slate-400 font-semibold block">
                        Hệ thống tự động liên hệ khách hàng sau 6 tháng kể từ đợt dịch vụ trước để đặt lịch hẹn.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.autoReminder}
                        onChange={(e) => setNotifications({ ...notifications, autoReminder: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
                    </label>
                  </div>

                  {/* Telegram alerts */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-slate-800 text-sm md:text-base block">
                        Cảnh báo khẩn cấp qua Telegram
                      </span>
                      <span className="text-xs text-slate-400 font-semibold block">
                        Nhận tin nhắn báo cáo tức thời khi có lịch hẹn bị quá giờ hoặc khi kho cạn kiệt.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.telegramAlert}
                        onChange={(e) => setNotifications({ ...notifications, telegramAlert: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-6 mt-6">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={isSavingNotifications}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00285E] hover:bg-[#062047] disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00285E]/10 hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <Save size={16} />
                    <span>{isSavingNotifications ? 'Đang đồng bộ...' : 'Đồng bộ cấu hình'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* COMMISSION RULES TAB */}
            {activeTab === 'commission' && (
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* HOUR EDIT MODAL */}
      {isHoursModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsHoursModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl border border-slate-200/50 shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="text-[#00285E]" size={20} />
              Cập nhật giờ hoạt động
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Thứ 2 - Thứ 6
                </label>
                <input
                  type="text"
                  value={hours.weekday}
                  onChange={(e) => setHours({ ...hours, weekday: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Thứ 7
                </label>
                <input
                  type="text"
                  value={hours.saturday}
                  onChange={(e) => setHours({ ...hours, saturday: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Chủ Nhật
                </label>
                <input
                  type="text"
                  value={hours.sunday}
                  onChange={(e) => setHours({ ...hours, sunday: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setIsHoursModalOpen(false)}
                className="flex-1 py-3 text-sm font-semibold border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setIsHoursModalOpen(false);
                  showToast('Đã chỉnh sửa lịch hoạt động của Garage!', 'success');
                }}
                className="flex-1 py-3 text-sm font-semibold text-white bg-[#00285E] hover:bg-[#062047] rounded-xl transition-all shadow-md shadow-[#00285E]/10"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

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
      {/* POLICY EDIT/CREATE MODAL */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPolicyModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl border border-slate-200/50 shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all font-sans">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Tag className="text-[#00285E]" size={20} />
              {editingPolicy ? 'Cập nhật chính sách giá' : 'Thêm chính sách giá mới'}
            </h3>

            <form onSubmit={handleSavePolicyItem} className="space-y-4">
              {/* Category Group */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nhóm phụ tùng *
                </label>
                <select
                  value={policyCategory}
                  onChange={(e) => setPolicyCategory(e.target.value)}
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700 ${
                    policyErrors.category ? 'border-rose-500' : 'border-slate-200'
                  }`}
                >
                  <option value="">Chọn nhóm hàng...</option>
                  <option value="Dầu nhớt & Phụ gia">Dầu nhớt & Phụ gia</option>
                  <option value="Hệ thống phanh">Hệ thống phanh</option>
                  <option value="Lốp & Mâm xe">Lốp & Mâm xe</option>
                  <option value="Hệ thống điện">Hệ thống điện</option>
                  <option value="Động cơ & Truyền động">Động cơ & Truyền động</option>
                  <option value="Hệ thống treo & Lái">Hệ thống treo & Lái</option>
                  <option value="Khác">Khác...</option>
                </select>

                {policyCategory === 'Khác' && (
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Tên nhóm hàng khác *
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Phụ kiện trang trí"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                        policyErrors.category ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                )}

                {policyErrors.category && (
                  <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {policyErrors.category}
                  </p>
                )}
              </div>

              {/* Markup and Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Tỷ lệ Markup (0 - 1000%) *
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      type="number"
                      value={policyMarkup}
                      onChange={(e) => setPolicyMarkup(e.target.value)}
                      className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                        policyErrors.markup ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-slate-400 font-bold text-xs">%</span>
                    </div>
                  </div>
                  {policyErrors.markup && (
                    <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {policyErrors.markup}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Tỷ lệ chiết khấu (0 - 1.0) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={policyDiscount}
                    onChange={(e) => setPolicyDiscount(e.target.value)}
                    placeholder="Ví dụ: 0.1 cho 10%"
                    className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                      policyErrors.discount ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    1.0 = 100%, 0.1 = 10%, 0.05 = 5%
                  </p>
                  {policyErrors.discount && (
                    <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {policyErrors.discount}
                    </p>
                  )}
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Ngày bắt đầu hiệu lực
                  </label>
                  <input
                    type="date"
                    value={policyStartDate}
                    onChange={(e) => setPolicyStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={policyEndDate}
                    onChange={(e) => setPolicyEndDate(e.target.value)}
                    className={`w-full bg-white border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800 ${
                      policyErrors.endDate ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {policyErrors.endDate && (
                    <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {policyErrors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-semibold text-white bg-[#00285E] hover:bg-[#062047] rounded-xl transition-all shadow-md shadow-[#00285E]/10"
                >
                  {editingPolicy ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
