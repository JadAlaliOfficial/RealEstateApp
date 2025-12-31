import { Label } from '@/components/ui/label';
import React from 'react';

interface AssignedTasksSectionProps {
    assignedTasks: string;
    onAssignedTasksChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    assignedTasksRef: React.RefObject<HTMLTextAreaElement>;
   errors: Partial<Record<string, string>>; // Changed from Record<string, string>

    validationError: string;
}

export default function AssignedTasksSection({
    assignedTasks,
    onAssignedTasksChange,
    assignedTasksRef,
    errors,
    validationError
}: AssignedTasksSectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
            <div className="mb-2">
                <Label htmlFor="assigned_tasks" className="text-base font-semibold">
                    Assigned Tasks *
                </Label>
            </div>
            <textarea
                ref={assignedTasksRef}
                id="assigned_tasks"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={assignedTasks}
                onChange={onAssignedTasksChange}
                rows={3}
                placeholder="Describe the assigned tasks..."
            />
            {errors.assigned_tasks && <p className="mt-1 text-sm text-red-600">{errors.assigned_tasks}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
