'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, Hash, Save, Camera } from 'lucide-react';
import { Button } from '@/components/Button';
import { UserProfile, userService } from '@/services/user.service';
import { uploadService } from '@/services/upload.service';
import { useSWRConfig } from 'swr';

const profileSchema = z.object({
    name: z.string().min(3, 'Mínimo 3 caracteres').max(60, 'Máximo 60 caracteres'),
    email: z.string().email('Correo inválido'),
    phone: z.string().regex(/^\d{10}$/, 'Debe tener exactamente 10 dígitos numéricos'),
    document: z.string().regex(/^\d{10}$/, 'Debe tener exactamente 10 dígitos numéricos'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    user: UserProfile;
    onUserUpdate: (user: UserProfile) => void;
}

export function ProfileForm({ user, onUserUpdate }: ProfileFormProps) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [savedSuccess, setSavedSuccess] = React.useState(false);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const [avatarToDelete, setAvatarToDelete] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { mutate } = useSWRConfig();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        defaultValues: {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            document: user.cedula || '',
        },
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarToDelete(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        setSavedSuccess(false);

        try {
            let newUrl: string | undefined | null = user.avatarUrl;
            let newPublicId: string | undefined | null = user.avatarPublicId;

            // 1. Si seleccionó un archivo nuevo, lo sube
            if (fileInputRef.current?.files?.[0]) {
                const uploadRes = await uploadService.uploadImage(fileInputRef.current.files[0], 'avatars');
                newUrl = uploadRes.publicUrl;
                newPublicId = uploadRes.publicId;
            } else if (avatarToDelete) {
                // 2. Si eligió usar el botón "Eliminar foto" explícitamente sin subir otra.
                newUrl = null;
                newPublicId = null;
            }

            // 3. Envía el update, el Backend se encargará silenciosamente de cazar los huérfanos.
            const updatedProfile = await userService.updateProfile({
                name: data.name,
                phone: data.phone,
                cedula: data.document,
                avatarUrl: newUrl,
                avatarPublicId: newPublicId
            });

            // Update parent state
            onUserUpdate(updatedProfile);
            mutate('/api/users/me');

            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Hubo un error al actualizar el perfil.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center sm:items-start gap-4 pb-8 border-b border-white/5">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                    Foto de Perfil
                </label>
                <div className="flex items-center gap-6">
                    <div 
                        onClick={handleAvatarClick}
                        className="relative w-20 h-20 rounded-full bg-[#15201D] border-2 border-white/10 flex items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-[#10B981]/50"
                    >
                        {avatarPreview || (user.avatarUrl && !avatarToDelete) ? (
                            <img src={avatarPreview || user.avatarUrl || ''} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-black text-[#10B981]">
                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Button 
                                type="button" 
                                onClick={handleAvatarClick}
                                variant="ghost" 
                                className="text-xs font-bold border border-white/10 hover:bg-white/5 text-slate-300 rounded-lg h-9"
                            >
                                Cambiar imagen
                            </Button>
                            {(user.avatarUrl && !avatarToDelete) || avatarPreview ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAvatarToDelete(true);
                                        setAvatarPreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Eliminar foto
                                </button>
                            ) : null}
                        </div>
                        <p className="text-[10px] text-slate-500">JPG, GIF o PNG. Máx 2MB.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Nombre Completo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <User className="h-4 w-4" />
                        </div>
                        <input
                            {...register('name')}
                            className={`w-full bg-[#15201D] border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#10B981]'} text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-slate-600 focus:bg-[#0A110F]`}
                            placeholder="Tu nombre"
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <Mail className="h-4 w-4" />
                        </div>
                        <input
                            {...register('email')}
                            disabled={true}
                            className={`w-full bg-[#15201D] border border-white/10 text-white/50 cursor-not-allowed rounded-xl py-3 pl-11 pr-4 outline-none transition-all`}
                            placeholder="tu@correo.com"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Teléfono Móvil
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <Phone className="h-4 w-4" />
                        </div>
                        <input
                            {...register('phone')}
                            className={`w-full bg-[#15201D] border ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#10B981]'} text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-slate-600 focus:bg-[#0A110F]`}
                            placeholder="+57 300..."
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 ml-1">{errors.phone.message}</p>}
                </div>

                {/* Document */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Documento Identidad
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <Hash className="h-4 w-4" />
                        </div>
                        <input
                            {...register('document')}
                            className={`w-full bg-[#15201D] border ${errors.document ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#10B981]'} text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-slate-600 focus:bg-[#0A110F]`}
                            placeholder="C.C o NIT"
                        />
                    </div>
                    {errors.document && <p className="text-xs text-red-400 ml-1">{errors.document.message}</p>}
                </div>
            </div>

            <div className="pt-6 flex items-center justify-end gap-4 border-t border-white/5">
                {savedSuccess && (
                    <span className="text-sm font-bold text-[#10B981] animate-in fade-in slide-in-from-right-2">
                        ¡Cambios guardados exitosamente!
                    </span>
                )}
                
                <Button 
                    type="submit" 
                    disabled={(!isDirty && !avatarPreview && !avatarToDelete) || isSaving}
                    className="bg-[#10B981] hover:bg-[#0E9F6E] disabled:bg-[#10B981]/50 text-slate-900 font-bold px-8 py-3 h-auto"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            Guardando...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}
