import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';


interface AssistanceFieldProps {
    data: any;
    setData: (data: any) => void;
    errors: any;
}


export default function AssistanceField({ data, setData, errors }: AssistanceFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-cyan-500 p-4">
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="has_assistance"
                        checked={data.has_assistance}
                        onCheckedChange={(checked) => setData((prev: any) => ({ ...prev, has_assistance: checked as boolean }))}
                    />
                    <Label htmlFor="has_assistance" className="text-base font-semibold cursor-pointer">
                        Has Assistance
                    </Label>
                </div>
            </div>

            {data.has_assistance && (
                <>
                    <div className="mb-3">
                        <Label htmlFor="assistance_amount" className="text-sm font-medium">
                            Assistance Amount
                        </Label>
                        <Input
                            id="assistance_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.assistance_amount}
                            onChange={(e) => setData((prev: any) => ({ ...prev, assistance_amount: e.target.value }))}
                            placeholder="Enter assistance amount"
                        />
                        {errors.assistance_amount && <p className="mt-1 text-sm text-red-600">{errors.assistance_amount}</p>}
                    </div>

                    <div>
                        <Label htmlFor="assistance_company" className="text-sm font-medium">
                            Assistance Company
                        </Label>
                        <Input
                            id="assistance_company"
                            type="text"
                            value={data.assistance_company}
                            onChange={(e) => setData((prev: any) => ({ ...prev, assistance_company: e.target.value }))}
                            placeholder="Enter assistance company name"
                        />
                        {errors.assistance_company && <p className="mt-1 text-sm text-red-600">{errors.assistance_company}</p>}
                    </div>
                </>
            )}
        </div>
    );
}
