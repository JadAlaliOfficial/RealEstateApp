import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Notice {
    id: number;
    notice_name: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    notices: Notice[];
}

export default function TypeOfNoticeField({ value, onChange, error, notices }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
            <div className="mb-2">
                <Label htmlFor="type_of_notice" className="text-base font-semibold">
                    Type of Notice
                </Label>
            </div>
            <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    {notices.map((notice) => (
                        <SelectItem key={notice.id} value={notice.notice_name}>
                            {notice.notice_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
