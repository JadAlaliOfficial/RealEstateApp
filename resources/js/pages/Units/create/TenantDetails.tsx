import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    tenants: string;
    onTenantsChange: (value: string) => void;
    error?: string;
}

export default function TenantDetails({ tenants, onTenantsChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
            <div className="mb-2">
                <Label htmlFor="tenants" className="text-base font-semibold">
                    Tenants
                </Label>
            </div>
            <Input
                id="tenants"
                value={tenants}
                onChange={(e) => onTenantsChange(e.target.value)}
                placeholder="Enter tenant names"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
