import { Unit } from '@/types/unit';

interface CalculatedValuesDisplayProps {
    unit: Unit;
}

export default function CalculatedValuesDisplay({ unit }: CalculatedValuesDisplayProps) {
    return (
        <div className="p-4 bg-muted border border-border rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3">Current Calculated Values:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span className="font-medium text-muted-foreground">Vacant:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        unit.vacant === 'Yes' ? 'bg-destructive text-destructive-foreground' : 'bg-chart-1 text-primary-foreground'
                    }`}>
                        {unit.vacant}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-muted-foreground">Listed:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        unit.listed === 'Yes' ? 'bg-chart-1 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                        {unit.listed}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-muted-foreground">Applications:</span>
                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-chart-2 text-primary-foreground">
                        {unit.total_applications || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
