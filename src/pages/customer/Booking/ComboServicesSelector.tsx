import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import type { ServiceCombo, ServiceItem } from './BookingPage';

interface ComboServicesSelectorProps {
    dbCombos: ServiceCombo[];
    selectedComboId: number | null;
    setSelectedComboId: (id: number | null) => void;
    mappedServices: ServiceItem[];
    getServicePriceValue: (id: number) => number;
    COLORS: { orange: string; navy: string;[key: string]: string };
}

export default function ComboServicesSelector({
    dbCombos,
    selectedComboId,
    setSelectedComboId,
    mappedServices,
    getServicePriceValue,
    COLORS,
}: ComboServicesSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {dbCombos.filter(c => c.is_active).map((combo) => {
                const isSelected = selectedComboId === combo.id;
                const original = combo.service_ids.reduce((sum, id) => sum + getServicePriceValue(id), 0);
                const discounted = Math.round(original * (1 - combo.discount_percentage / 100));
                const comboServiceNames = combo.service_ids.map(id => {
                    const s = mappedServices.find(x => x.id === id);
                    return s ? s.title : "Dịch vụ bảo dưỡng";
                });

                return (
                    <div
                        key={combo.id}
                        onClick={() => setSelectedComboId(combo.id)}
                        className="relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group text-left"
                        style={{
                            borderColor: isSelected ? COLORS.orange : '#F1F5F9',
                            backgroundColor: isSelected ? 'rgba(249,161,27,0.03)' : '#FFFFFF',
                            boxShadow: isSelected ? '0 10px 20px rgba(249,161,27,0.04)' : 'none'
                        }}
                    >
                        <div>
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 flex-wrap justify-end">
                                <div className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg shadow-xs shrink-0">
                                    Giảm {combo.discount_percentage}%
                                </div>
                                <div className="text-[9px] font-bold px-2 py-0.5 rounded-lg shrink-0 bg-brand-orange text-brand-blue">
                                    Combo
                                </div>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 shadow-sm">
                                <Sparkles size={18} className="text-gray-400" />
                            </div>

                            <h3 className="text-base font-bold mb-1 text-brand-blue">{combo.combo_name}</h3>

                            <div className="my-3 space-y-1.5 pl-2 border-l-2 border-amber-400/50">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-display">Dịch vụ đi kèm:</span>
                                {comboServiceNames.map((name, idx) => (
                                    <div key={idx} className="text-[11px] text-slate-500 leading-snug flex items-center gap-1">
                                        <span className="text-[#F9A11B] shrink-0">•</span>
                                        <span>{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                            <div>
                                <div className="text-[9px] font-bold uppercase mb-0.5 text-gray-400">Giá combo ưu đãi</div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs text-gray-400 line-through font-medium">Từ {original.toLocaleString("vi-VN")}đ</span>
                                    <span className="text-base font-bold text-brand-orange">Từ {discounted.toLocaleString("vi-VN")}đ</span>
                                </div>
                            </div>
                            <div
                                className="w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0"
                                style={{
                                    borderColor: isSelected ? COLORS.orange : '#CBD5E1',
                                    backgroundColor: isSelected ? COLORS.orange : 'transparent',
                                    color: isSelected ? COLORS.navy : 'transparent',
                                }}
                            >
                                <Check size={12} strokeWidth={4} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
