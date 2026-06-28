import { useState } from 'react';
import { Store, Clock, Calendar, Save } from 'lucide-react';

interface GeneralSettingsProps {
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function GeneralSettings({ showToast }: GeneralSettingsProps) {
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

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    setTimeout(() => {
      setIsSavingGeneral(false);
      showToast('Đã lưu thông tin cấu hình Garage thành công!', 'success');
    }, 1000);
  };

  return (
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
    </div>
  );
}
