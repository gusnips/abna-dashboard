import { formatNumber, formatCurrency } from '../utils';

interface SummaryCardProps {
    title: string;
    value: number | string;
    format?: 'number' | 'currency';
    icon?: React.ReactNode;
}

/**
 * SummaryCard component displays a single summary statistic
 * 
 * @param title - The label/title for the statistic
 * @param value - The numeric or string value to display
 * @param format - Optional format type: 'number' (with thousand separators) or 'currency' (R$)
 * @param icon - Optional icon element to display
 * 
 * Requirements: 4.8, 4.9
 */
export function SummaryCard({ title, value, format, icon }: SummaryCardProps) {
    // Format the value based on the format prop
    const formattedValue = (() => {
        if (typeof value === 'string') {
            return value;
        }

        switch (format) {
            case 'currency':
                return formatCurrency(value);
            case 'number':
                return formatNumber(value);
            default:
                return value.toString();
        }
    })();

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                        {title}
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {formattedValue}
                    </p>
                </div>
                {icon && (
                    <div className="ml-4 text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
