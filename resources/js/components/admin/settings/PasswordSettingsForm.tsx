import { useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function PasswordSettingsForm(): JSX.Element {
    const { data, setData, patch, processing, errors, reset } = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        patch(route('admin.settings.password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="card border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="text-lg font-black uppercase tracking-wide">Keamanan Akun</h2>
                <p className="mb-3 text-xs font-medium text-base-content/60">Ubah password admin dengan verifikasi password saat ini.</p>

                <form className="grid grid-cols-1 gap-4" onSubmit={submit}>
                    <label className="form-control">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Password Saat Ini</span>
                        <input
                            type="password"
                            className={`input input-bordered rounded-xl ${errors.current_password ? 'input-error' : ''}`}
                            value={data.current_password}
                            onChange={(event) => setData('current_password', event.target.value)}
                        />
                        {errors.current_password && <span className="label-text-alt text-error">{errors.current_password}</span>}
                    </label>

                    <label className="form-control">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Password Baru</span>
                        <input
                            type="password"
                            className={`input input-bordered rounded-xl ${errors.password ? 'input-error' : ''}`}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                        />
                        {errors.password && <span className="label-text-alt text-error">{errors.password}</span>}
                    </label>

                    <label className="form-control">
                        <span className="label-text mb-1 text-xs font-bold uppercase">Konfirmasi Password Baru</span>
                        <input
                            type="password"
                            className="input input-bordered rounded-xl"
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                        />
                    </label>

                    <div>
                        <button type="submit" className="btn btn-secondary rounded-xl font-black" disabled={processing}>
                            <KeyRound className="h-4 w-4" />
                            {processing ? 'Memproses...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
