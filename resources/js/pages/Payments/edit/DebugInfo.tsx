import { Payment } from '@/types/payments';

interface DebugInfoProps {
    payment: Payment;
    data: any;
    selectedCity: string;
    selectedProperty: string;
    selectedUnit: string;
}

export default function DebugInfo({
    payment,
    data,
    selectedCity,
    selectedProperty,
    selectedUnit,
}: DebugInfoProps) {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
            <p>Original Payment Unit ID: {payment.unit_id}</p>
            <p>Form Unit ID: {data.unit_id}</p>
            <p>City: {selectedCity}</p>
            <p>Property: {selectedProperty}</p>
            <p>Unit: {selectedUnit}</p>
        </div>
    );
}
