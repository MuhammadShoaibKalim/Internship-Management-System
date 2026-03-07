import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    Settings,
    Shield,
    Bell,
    Globe,
    Database,
    Lock,
    Save,
    RefreshCw,
    Terminal,
    Server,
    Activity,
    Cpu,
    Sparkles,
    Loader2
} from 'lucide-react';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const AdminSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('security');
    const [saving, setSaving] = useState(false);

    const tabs = [
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'platform', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'infrastructure', label: 'System Health', icon: Globe },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await API.get('/admin/settings');
            setSettings(response.data.data.settings);
        } catch (err) {
            console.error('Failed to fetch system settings', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key, currentValue) => {
        setSaving(true);
        try {
            const newValue = !currentValue;
            await API.patch('/admin/settings', { key, value: newValue });
            setSettings(settings.map(s => s.key === key ? { ...s, value: newValue } : s));
            toast.success(`Setting '${key}' updated!`);
        } catch (err) {
            toast.error('Failed to update setting.');
        } finally {
            setSaving(false);
        }
    };

    const filteredSettings = settings.filter(s => s.category === activeTab);

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <SectionHeader
                title="Platform Settings"
                subtitle="Settings"
                description="Manage security, notifications, and general platform settings for all users."
                icon={Settings}
                gradientFrom="from-slate-900"
                gradientTo="to-slate-500"
            >
                <div className="flex gap-4">
                    <button onClick={fetchSettings} className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                        <RefreshCw size={20} className={`text-primary-400 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </SectionHeader>

            {/* Settings Management Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all border-2 ${activeTab === tab.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-200 translate-x-2'
                                : 'bg-white text-slate-400 border-transparent hover:border-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <tab.icon size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <Sparkles size={14} className="text-primary-400 animate-pulse" />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="portal-card p-12 bg-white border-none shadow-2xl shadow-slate-100/50 min-h-[600px] flex flex-col">
                        <div className="mb-12 pb-8 border-b border-slate-50">
                            <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest italic leading-relaxed">
                                Manage settings for the {activeTab} section.
                            </p>
                        </div>

                        {/* Setting Sections */}
                        <div className="space-y-12 flex-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                                </div>
                            ) : filteredSettings.length > 0 ? (
                                filteredSettings.map((setting) => (
                                    <div key={setting.key} className="flex flex-col md:flex-row md:items-center justify-between gap-10 group bg-slate-50/50 p-8 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{setting.label || setting.key}</h4>
                                            <p className="text-xs text-slate-400 font-medium italic opacity-70 leading-relaxed max-w-md">
                                                {setting.description || 'Toggle this setting on or off.'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                disabled={saving}
                                                onClick={() => handleToggle(setting.key, setting.value)}
                                                className={`w-16 h-8 rounded-full relative p-1 transition-all ${setting.value ? 'bg-primary-500' : 'bg-slate-200'}`}
                                            >
                                                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${setting.value ? 'translate-x-8' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                    <Shield size={48} strokeWidth={1} />
                                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest">No settings in this section</p>
                                </div>
                            )}
                        </div>

                        {/* Node Telemetry Section */}
                        <div className="mt-12 pt-12 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-10 text-slate-400">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-100 group">
                                <Cpu size={32} className="group-hover:text-slate-900 transition-colors" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Response Time</p>
                                    <p className="text-xl font-bold text-slate-900">0.012ms</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-100 group">
                                <Database size={32} className="group-hover:text-slate-900 transition-colors" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">DB Speed</p>
                                    <p className="text-xl font-bold text-slate-900">14.0% Global</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
