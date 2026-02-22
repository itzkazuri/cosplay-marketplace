import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, UserCircle2 } from 'lucide-react';

export interface AdminProfileData {
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    recipient_name: string | null;
    recipient_phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
}

interface ProfileSettingsFormProps {
    profile: AdminProfileData;
}

interface ProfileFormData {
    name: string;
    email: string;
    avatar: File | null;
    phone: string;
    recipient_name: string;
    recipient_phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
}

export default function ProfileSettingsForm({ profile }: ProfileSettingsFormProps): JSX.Element {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar);

    const { data, setData, post, processing, errors, transform } = useForm<ProfileFormData>({
        name: profile.name,
        email: profile.email,
        avatar: null,
        phone: profile.phone ?? '',
        recipient_name: profile.recipient_name ?? '',
        recipient_phone: profile.recipient_phone ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
        province: profile.province ?? '',
        postal_code: profile.postal_code ?? '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        transform((formData) => {
            const payload: Record<string, unknown> = {
                _method: 'patch',
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                recipient_name: formData.recipient_name,
                recipient_phone: formData.recipient_phone,
                address: formData.address,
                city: formData.city,
                province: formData.province,
                postal_code: formData.postal_code,
            };

            if (formData.avatar instanceof File) {
                payload.avatar = formData.avatar;
            }

            return payload;
        });

        post(route('admin.settings.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => transform((formData) => formData),
        });
    };

    return (
        <div className="card border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="text-lg font-black uppercase tracking-wide">Profil Admin</h2>
                <p className="mb-3 text-xs font-medium text-base-content/60">Update email, nama, foto, dan data kontak admin.</p>

                <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={submit}>
                    <div className="form-control md:col-span-2">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Foto Profil</span>
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="h-16 w-16 rounded-full bg-base-200">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar admin" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <UserCircle2 className="h-8 w-8 text-base-content/30" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className={`file-input file-input-bordered w-full rounded-xl ${errors.avatar ? 'file-input-error' : ''}`}
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    setData('avatar', file);
                                    setAvatarPreview(file ? URL.createObjectURL(file) : profile.avatar);
                                }}
                            />
                        </div>
                        {errors.avatar && <span className="label-text-alt text-error">{errors.avatar}</span>}
                    </div>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Nama</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.name ? 'input-error' : ''}`}
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                        />
                        {errors.name && <span className="label-text-alt text-error">{errors.name}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Email</span>
                        <input
                            type="email"
                            className={`input input-bordered rounded-xl ${errors.email ? 'input-error' : ''}`}
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                        />
                        {errors.email && <span className="label-text-alt text-error">{errors.email}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">No. HP</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.phone ? 'input-error' : ''}`}
                            value={data.phone}
                            onChange={(event) => setData('phone', event.target.value)}
                        />
                        {errors.phone && <span className="label-text-alt text-error">{errors.phone}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Nama Penerima Default</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.recipient_name ? 'input-error' : ''}`}
                            value={data.recipient_name}
                            onChange={(event) => setData('recipient_name', event.target.value)}
                        />
                        {errors.recipient_name && <span className="label-text-alt text-error">{errors.recipient_name}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">No. HP Penerima</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.recipient_phone ? 'input-error' : ''}`}
                            value={data.recipient_phone}
                            onChange={(event) => setData('recipient_phone', event.target.value)}
                        />
                        {errors.recipient_phone && <span className="label-text-alt text-error">{errors.recipient_phone}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Kota</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.city ? 'input-error' : ''}`}
                            value={data.city}
                            onChange={(event) => setData('city', event.target.value)}
                        />
                        {errors.city && <span className="label-text-alt text-error">{errors.city}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Provinsi</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.province ? 'input-error' : ''}`}
                            value={data.province}
                            onChange={(event) => setData('province', event.target.value)}
                        />
                        {errors.province && <span className="label-text-alt text-error">{errors.province}</span>}
                    </label>

                    <label className="form-control md:col-span-1">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Kode Pos</span>
                        <input
                            type="text"
                            className={`input input-bordered rounded-xl ${errors.postal_code ? 'input-error' : ''}`}
                            value={data.postal_code}
                            onChange={(event) => setData('postal_code', event.target.value)}
                        />
                        {errors.postal_code && <span className="label-text-alt text-error">{errors.postal_code}</span>}
                    </label>

                    <label className="form-control md:col-span-2">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Alamat Default</span>
                        <textarea
                            className={`textarea textarea-bordered rounded-xl ${errors.address ? 'textarea-error' : ''}`}
                            rows={3}
                            value={data.address}
                            onChange={(event) => setData('address', event.target.value)}
                        />
                        {errors.address && <span className="label-text-alt text-error">{errors.address}</span>}
                    </label>

                    <div className="md:col-span-2">
                        <button type="submit" className="btn btn-primary rounded-xl font-black" disabled={processing}>
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Profil'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
