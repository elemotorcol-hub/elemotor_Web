'use client';

import React, { useState, useMemo } from 'react';
import { 
    Search, Plus, FileText, Shield, 
    CreditCard, BookOpen, MoreVertical, 
    Download, Eye, Filter, X, 
    Upload, Check, ChevronRight,
    RefreshCcw, Info, AlertCircle
} from 'lucide-react';

import { ClientDocument } from '@/types/dashboard';
import { MOCK_DOCUMENTS_DATA as mockDocuments } from '@/mocks/clientPortalData';
import { useRouter } from 'next/navigation';

const TABS = ['Todos', 'Legales', 'Mantenimiento', 'Facturas'] as const;
type TabType = typeof TABS[number];

export default function DocumentosPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('Todos');
    const [documents, setDocuments] = useState<ClientDocument[]>(mockDocuments);
    
    // Upload Modal State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'Todos' || doc.category === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab, documents]);

    const stats = useMemo(() => ({
        total: documents.length,
        vencePronto: documents.filter(d => d.warningMessage).length
    }), [documents]);

    const renderIcon = (type: ClientDocument['iconType'], colorTheme: string) => {
        const iconProps = { className: "w-6 h-6" };
        switch (type) {
            case 'receipt': return <FileText {...iconProps} />;
            case 'shield-check': return <Shield {...iconProps} />;
            case 'id-card': return <CreditCard {...iconProps} />;
            case 'shield-alert': return <AlertCircle {...iconProps} />;
            case 'book': return <BookOpen {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        
        // Simulating upload process
        setTimeout(() => {
            const newDoc: ClientDocument = {
                id: Math.random().toString(36).substr(2, 9),
                title: selectedFile.name.split('.')[0],
                subtitle: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB - ${selectedFile.type.split('/')[1].toUpperCase()}`,
                uploadDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                iconType: 'receipt',
                colorTheme: 'text-emerald-400 bg-emerald-400/10',
                category: 'Facturas', // Default category for new uploads
                isActive: true
            };

            setDocuments(prev => [newDoc, ...prev]);
            setIsUploading(false);
            setUploadSuccess(true);
            setSelectedFile(null);

            setTimeout(() => {
                setIsUploadOpen(false);
                setUploadSuccess(false);
            }, 2000);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => router.push('/dashboard')}>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#10B981]">Documentos</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                        Mi <span className="text-[#10B981]">Guantera Digital</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Gestiona y visualiza toda la documentación técnica y legal de tu vehículo.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#15201D] border border-white/5 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[120px] shadow-xl">
                        <span className="text-slate-500 text-[9px] font-black tracking-[0.2em] mb-1">TOTAL</span>
                        <span className="text-white text-3xl font-black tracking-tighter">{stats.total}</span>
                    </div>
                    <div className="bg-[#15201D] border border-white/5 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[120px] shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-slate-500 text-[9px] font-black tracking-[0.2em] mb-1 relative z-10">ALERTAS</span>
                        <span className="text-yellow-500 text-3xl font-black tracking-tighter relative z-10">{stats.vencePronto}</span>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="relative w-full lg:w-[450px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Busca facturas, seguros, manuales..."
                        className="w-full bg-[#15201D] border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/30 transition-all shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-[#15201D] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar shadow-lg">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab 
                                ? 'bg-[#10B981] text-[#0A110F] shadow-[0_5px_15px_rgba(16,185,129,0.2)]' 
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Upload Card */}
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="h-[280px] rounded-[32px] border-2 border-dashed border-[#10B981]/20 bg-[#10B981]/[0.02] hover:bg-[#10B981]/[0.05] hover:border-[#10B981]/40 transition-all duration-500 flex flex-col items-center justify-center gap-6 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center text-[#0A110F] shadow-[0_10px_30px_rgba(16,185,129,0.3)] group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                            <Plus className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="text-center relative z-10">
                        <h4 className="text-white font-black text-sm mb-1 uppercase tracking-widest">Subir Documento</h4>
                        <p className="text-slate-500 text-[10px] font-bold px-8">EXPEDIENTES DIGITALES (PDF, JPG, PNG)</p>
                    </div>
                </button>

                {/* Document Cards */}
                {filteredDocuments.map((doc) => (
                    <div 
                        key={doc.id} 
                        className="h-[280px] bg-[#15201D] border border-white/5 rounded-[32px] p-8 flex flex-col hover:border-[#10B981]/30 hover:bg-white/[0.01] transition-all duration-500 group relative overflow-hidden shadow-xl"
                    >
                        {/* Decorative Background */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity ${doc.colorTheme.split(' ')[0]}`} />

                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${doc.colorTheme}`}>
                                {renderIcon(doc.iconType, doc.colorTheme)}
                            </div>
                            <button className="text-slate-700 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 relative z-10">
                            <h4 className="text-xl font-black text-white mb-2 tracking-tighter group-hover:text-[#10B981] transition-colors">
                                {doc.title}
                            </h4>
                            <div className="flex items-center gap-2">
                                {doc.isActive && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#10B981] text-[9px] font-black uppercase tracking-widest">
                                        <Check className="w-2.5 h-2.5" />
                                        Vigente
                                    </span>
                                )}
                                {doc.warningMessage ? (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase tracking-widest">
                                        <AlertCircle className="w-2.5 h-2.5" />
                                        {doc.warningMessage}
                                    </span>
                                ) : (
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">{doc.subtitle}</span>
                                )}
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 relative z-10">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-slate-600 text-[8px] font-black tracking-[0.2em] uppercase">FECHA</span>
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{doc.uploadDate}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-xl bg-[#0A110F] border border-white/5 text-slate-500 hover:text-[#10B981] hover:border-[#10B981]/30 transition-all flex items-center justify-center group/btn shadow-inner">
                                    <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center justify-center group/btn shadow-inner">
                                    <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-[#15201D]/50 border border-white/5 border-dashed rounded-[40px] text-center px-10">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-slate-600" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-2 tracking-tighter">Sin resultados para "{searchQuery}"</h4>
                    <p className="text-slate-500 max-w-xs text-sm font-medium">No encontramos documentos en la categoría {activeTab} que coincidan con tu búsqueda.</p>
                    <button 
                        onClick={() => { setSearchQuery(''); setActiveTab('Todos'); }}
                        className="mt-6 text-[#10B981] font-black text-xs uppercase tracking-widest hover:text-emerald-400 transition-colors"
                    >
                        Limpiar Búsqueda
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-md animate-in fade-in duration-300" 
                        onClick={() => !isUploading && setIsUploadOpen(false)}
                    />
                    
                    <div className="bg-[#15201D] border border-white/10 w-full max-w-xl rounded-[40px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="h-2 bg-gradient-to-r from-[#10B981] via-teal-500 to-[#10B981]" />
                        
                        <div className="p-10">
                            <button 
                                onClick={() => !isUploading && setIsUploadOpen(false)}
                                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {!uploadSuccess ? (
                                <>
                                    <div className="mb-10 text-center">
                                        <div className="w-20 h-20 rounded-[24px] bg-[#10B981]/10 flex items-center justify-center mb-6 mx-auto text-[#10B981]">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase tracking-widest">Cargar <span className="text-[#10B981]">Expediente</span></h2>
                                        <p className="text-slate-500 font-bold text-xs">ARCHIVOS HASTA 15MB (PDF, PNG, JPG)</p>
                                    </div>

                                    <form onSubmit={handleUpload} className="space-y-8">
                                        <div 
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                            className={`border-2 border-dashed rounded-[32px] p-10 flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 ${
                                                selectedFile 
                                                ? 'border-[#10B981] bg-[#10B981]/5' 
                                                : 'border-white/5 bg-[#0A110F]/50 hover:border-[#10B981]/30 hover:bg-white/[0.01]'
                                            }`}
                                        >
                                            <input 
                                                id="file-upload"
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            {selectedFile ? (
                                                <>
                                                    <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-4">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-white font-black text-sm mb-1 uppercase tracking-widest truncate max-w-xs">{selectedFile.name}</p>
                                                    <p className="text-[#10B981] font-bold text-xs">¡ARCHIVO LISTO PARA CARGA!</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-10 h-10 text-slate-700 mb-4 group-hover:text-[#10B981] transition-colors" />
                                                    <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-widest">Arrastra tus archivos aquí</p>
                                                    <p className="text-slate-600 font-medium text-xs">O haz clic para explorar tu equipo</p>
                                                </>
                                            )}
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isUploading || !selectedFile}
                                            className="w-full bg-[#10B981] hover:bg-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed text-[#0A110F] font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_15px_40px_rgba(16,185,129,0.2)]"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <RefreshCcw className="w-5 h-5 animate-spin" />
                                                    PROCESANDO EXTRACCIÓN...
                                                </>
                                            ) : (
                                                <>
                                                    {selectedFile ? 'INICIAR CARGA DIGITAL' : 'SELECCIONA UN ARCHIVO'}
                                                    <ChevronRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                                        <Check className="w-12 h-12 text-[#10B981]" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase tracking-widest">Documento <span className="text-[#10B981]">Digitalizado</span></h2>
                                    <p className="text-slate-400 font-medium max-w-sm mb-8">
                                        El archivo ha sido indexado correctamente en tu historial. Estará disponible en breve.
                                    </p>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#10B981] animate-progress-modal" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
