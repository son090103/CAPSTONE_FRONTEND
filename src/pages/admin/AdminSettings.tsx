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
  Percent,
  Edit,
  Calculator
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

  // Pricing Settings States
  const [hourlyRate, setHourlyRate] = useState('300000');
  const [partsMarkup, setPartsMarkup] = useState('15');
  const [vatRate, setVatRate] = useState('8');
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    transfer: true,
    card: false
  });
  const [isSavingPricing, setIsSavingPricing] = useState(false);

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
    { id: 'pricing', label: 'Pricing Rules', icon: Coins },
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

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPricing(true);
    setTimeout(() => {
      setIsSavingPricing(false);
      showToast('Đã cập nhật biểu phí và cấu hình giá dịch vụ!', 'success');
    }, 1000);
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

            {/* PRICING RULES TAB */}
            {activeTab === 'pricing' && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Coins className="text-[#00285E]" size={20} />
                  Biểu phí & Cấu hình giá
                </h2>

                <form onSubmit={handleSavePricing} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Giá công thợ (/giờ)
                      </label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-slate-400 font-bold text-xs">VND</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Tỷ lệ biên lợi nhuận phụ tùng
                      </label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          value={partsMarkup}
                          onChange={(e) => setPartsMarkup(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <Percent size={14} className="text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Thuế giá trị gia tăng (VAT)
                      </label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          value={vatRate}
                          onChange={(e) => setVatRate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-800"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <Percent size={14} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                      Phương thức thanh toán chấp nhận
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/75 transition-colors">
                        <input
                          type="checkbox"
                          checked={paymentMethods.cash}
                          onChange={(e) => setPaymentMethods({ ...paymentMethods, cash: e.target.checked })}
                          className="rounded text-[#00285E] focus:ring-[#00285E]/20 w-4.5 h-4.5 border-slate-300"
                        />
                        <span className="text-sm font-semibold text-slate-700">Tiền mặt (Cash)</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/75 transition-colors">
                        <input
                          type="checkbox"
                          checked={paymentMethods.transfer}
                          onChange={(e) => setPaymentMethods({ ...paymentMethods, transfer: e.target.checked })}
                          className="rounded text-[#00285E] focus:ring-[#00285E]/20 w-4.5 h-4.5 border-slate-300"
                        />
                        <span className="text-sm font-semibold text-slate-700">Chuyển khoản (Bank)</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/75 transition-colors">
                        <input
                          type="checkbox"
                          checked={paymentMethods.card}
                          onChange={(e) => setPaymentMethods({ ...paymentMethods, card: e.target.checked })}
                          className="rounded text-[#00285E] focus:ring-[#00285E]/20 w-4.5 h-4.5 border-slate-300"
                        />
                        <span className="text-sm font-semibold text-slate-700">Thẻ VISA / Mastercard</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-slate-100 pt-6">
                    <button
                      type="submit"
                      disabled={isSavingPricing}
                      className="flex items-center gap-2 px-6 py-3 bg-[#00285E] hover:bg-[#062047] disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00285E]/10 hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <Save size={16} />
                      <span>{isSavingPricing ? 'Đang lưu...' : 'Lưu biểu phí'}</span>
                    </button>
                  </div>
                </form>
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
    </div>
  );
}
