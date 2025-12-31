import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, FileText } from 'lucide-react';
import React from 'react';

interface Props {
    stageInProgress: string;
    notes: string;
    attachments: File[];
    onStageInProgressChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onAttachmentsChange: (files: File[]) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    errors: {
        stage_in_progress?: string;
        notes?: string;
        attachments?: string;
        'attachments.*'?: string;
    };
}

export function AdditionalDetailsSection({
    stageInProgress,
    notes,
    attachments,
    onStageInProgressChange,
    onNotesChange,
    onAttachmentsChange,
    fileInputRef,
    errors,
}: Props) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            // Combine with existing attachments
            onAttachmentsChange([...attachments, ...fileArray]);
        }
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = attachments.filter((_, i) => i !== index);
        onAttachmentsChange(newFiles);
        
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <>
            {/* Stage in Progress */}
            <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="stage_in_progress" className="text-base font-semibold">
                        Stage in Progress
                    </Label>
                </div>
                <Input
                    id="stage_in_progress"
                    value={stageInProgress}
                    onChange={(e) => onStageInProgressChange(e.target.value)}
                    placeholder="e.g., Document Review, Background Check, etc."
                />
                {errors.stage_in_progress && <p className="mt-1 text-sm text-red-600">{errors.stage_in_progress}</p>}
            </div>

            {/* Notes */}
            <div className="rounded-lg border-l-4 border-l-red-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="notes" className="text-base font-semibold">
                        Notes
                    </Label>
                </div>
                <textarea
                    id="notes"
                    className="resize-vertical min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={4}
                />
                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
            </div>

            {/* Attachments */}
            <div className="rounded-lg border-l-4 border-l-yellow-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="attachments" className="text-base font-semibold">
                        Attachments
                    </Label>
                </div>
                <Input
                    id="attachments"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="cursor-pointer file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    Accepted formats: PDF, Word documents, and images (max 10MB per file, up to 10 files)
                </p>
                {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>}
                {errors['attachments.*'] && <p className="mt-1 text-sm text-red-600">{errors['attachments.*']}</p>}

                {/* Display selected files */}
                {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Selected files ({attachments.length}):</p>
                        <div className="space-y-2">
                            {attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-2"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(index)}
                                        className="flex-shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
