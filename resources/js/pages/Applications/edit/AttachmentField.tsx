import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, FileText, RotateCcw } from 'lucide-react';
import React from 'react';
import { Attachment } from '@/types/application';

interface Props {
    currentAttachments?: Attachment[];
    allAttachments?: Attachment[];
    removedAttachmentIndices: number[];
    newAttachments: File[];
    onRemoveAttachment: (index: number) => void;
    onUndoRemoveAttachment: (index: number) => void;
    onAddAttachments: (files: File[]) => void;
    onRemoveNewAttachment: (index: number) => void;
    errors: Record<string, string>;
}

export function AttachmentField({
    currentAttachments = [],
    allAttachments = [],
    removedAttachmentIndices,
    newAttachments,
    onRemoveAttachment,
    onUndoRemoveAttachment,
    onAddAttachments,
    onRemoveNewAttachment,
    errors,
}: Props) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            onAddAttachments(fileArray);
            // Reset the input value so users can upload the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="rounded-lg border-l-4 border-l-yellow-500 p-4">
            <div className="mb-2">
                <Label htmlFor="attachments" className="text-base font-semibold">
                    Attachments
                </Label>
            </div>

            {/* Current attachments - Active */}
            {currentAttachments && currentAttachments.length > 0 && (
                <div className="mb-4 space-y-2">
                    <p className="text-sm font-medium">Current attachments ({currentAttachments.length}):</p>
                    <div className="space-y-2">
                        {currentAttachments.map((attachment) => (
                            <div
                                key={attachment.index}
                                className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-2"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{attachment.name}</p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveAttachment(attachment.index)}
                                    className="flex-shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Removed attachments - Show undo option */}
            {removedAttachmentIndices.length > 0 && (
                <div className="mb-4 space-y-2">
                    <p className="text-sm font-medium text-amber-600">Removed attachments ({removedAttachmentIndices.length}) - will be deleted:</p>
                    <div className="space-y-2">
                        {allAttachments?.map((attachment) => {
                            if (removedAttachmentIndices.includes(attachment.index)) {
                                return (
                                    <div
                                        key={attachment.index}
                                        className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/30"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileText className="h-4 w-4 flex-shrink-0 text-amber-600" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-amber-900 dark:text-amber-100">{attachment.name}</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onUndoRemoveAttachment(attachment.index)}
                                            className="flex-shrink-0 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/50"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}

            {/* New attachments - Not yet saved */}
            {newAttachments && newAttachments.length > 0 && (
                <div className="mb-4 space-y-2">
                    <p className="text-sm font-medium text-green-600">New attachments to add ({newAttachments.length}):</p>
                    <div className="space-y-2">
                        {newAttachments.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-950/30"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="h-4 w-4 flex-shrink-0 text-green-600" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-green-900 dark:text-green-100">{file.name}</p>
                                        <p className="text-xs text-green-700 dark:text-green-200">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveNewAttachment(index)}
                                    className="flex-shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* File upload input */}
            <div className="mb-3 space-y-2">
                <p className="text-sm font-medium">Add new attachments:</p>
                <Input
                    id="attachments"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
            </div>

            <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, Word documents, and images (max 10MB per file, up to 10 files)
            </p>
            {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>}
            {errors['attachments.*'] && <p className="mt-1 text-sm text-red-600">{errors['attachments.*']}</p>}
        </div>
    );
}
