'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import GeneralTab from './forms/GeneralTab';
import TrimsAndSpecsTab from './forms/TrimsAndSpecsTab';
import GalleryTab from './forms/GalleryTab';

interface ModelSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: VehicleModel | null;
}

type TabType = 'general' | 'trims' | 'gallery';

export default function ModelSlideOver({ isOpen, onClose, mode, initialData }: ModelSlideOverProps) {
    const [activeTab, setActiveTab] = useState<TabType>('general');

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[800px] bg-[#0f172a] shadow-2xl border-l border-slate-800/60 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">

                {/* Header */}
                <div className="flex-shrink-0 px-6 py-5 border-b border-slate-800/60 bg-slate-950/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">
                                {mode === 'add' ? 'Add New Model' : `Edit Model: ${initialData?.name}`}
                            </h2>
                            {mode === 'add' ? (
                                <p className="text-sm text-slate-500 mt-0.5">Fill in the details for the new vehicle model</p>
                            ) : (
                                <p className="text-sm text-slate-500 mt-0.5">Last updated 2 hours ago</p>
                            )}
                        </div>
                    </div>

                    <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm shadow-lg shadow-cyan-500/20">
                        {mode === 'add' ? 'Create Model' : 'Save Changes'}
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex-shrink-0 px-6 border-b border-slate-800/60 bg-slate-950/20">
                    <div className="flex gap-6 -mb-px">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general'
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('trims')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'trims'
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
                                }`}
                        >
                            Trims & Specs
                        </button>
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'gallery'
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
                                }`}
                        >
                            Gallery
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {activeTab === 'general' && <GeneralTab initialData={initialData} />}
                    {activeTab === 'trims' && <TrimsAndSpecsTab />}
                    {activeTab === 'gallery' && <GalleryTab />}
                </div>

            </div>
        </>
    );
}
