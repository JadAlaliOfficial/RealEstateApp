import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File, skipDuplicates: boolean) => void;
    isLoading: boolean;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [skipDuplicates, setSkipDuplicates] = useState(false);

    const handleFileSelect = (file: File) => {
        if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
            setSelectedFile(file);
        } else {
            alert('Please select a valid CSV file.');
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            onSubmit(selectedFile, skipDuplicates);
        }
    };

    const resetModal = () => {
        setSelectedFile(null);
        setDragOver(false);
        setSkipDuplicates(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const downloadTemplate = () => {
        window.location.href = route('tenants.import.template');
    };

    useEffect(() => {
        if (!isOpen) {
            resetModal();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md bg-background">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                            <CardTitle>Import Tenants from CSV</CardTitle>
                        </div>
                        <Button onClick={handleClose} variant="ghost" size="sm" disabled={isLoading}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>CSV File</Label>
                            <div
                                className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                    dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                                onDrop={handleDrop}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                            >
                                {selectedFile ? (
                                    <div className="space-y-2">
                                        <FileSpreadsheet className="mx-auto h-8 w-8 text-green-600" />
                                        <p className="font-medium text-green-700">{selectedFile.name}</p>
                                        <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            Drop your CSV file here or{' '}
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="h-auto p-0 text-primary"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                browse files
                                            </Button>
                                        </p>
                                        <p className="text-xs text-muted-foreground">CSV files only, max 10MB</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-sm font-medium">Required CSV Columns</h4>
                                <Button type="button" variant="link" size="sm" onClick={downloadTemplate} className="h-auto p-0 text-xs text-primary">
                                    Download Template
                                </Button>
                            </div>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                                <li>
                                    <strong>Property name</strong> - Name of the property
                                </li>
                                <li>
                                    <strong>Unit number</strong> - Unit number/name
                                </li>
                                <li>
                                    <strong>First name</strong> - Tenant's first name
                                </li>
                                <li>
                                    <strong>Last name</strong> - Tenant's last name
                                </li>
                                <li>
                                    <strong>Street address line 1</strong> - Street address (optional)
                                </li>
                                <li>
                                    <strong>Login email</strong> - Login email (optional)
                                </li>
                                <li>
                                    <strong>Alternate email</strong> - Alternate email (optional)
                                </li>
                                <li>
                                    <strong>Mobile</strong> - Mobile phone (optional)
                                </li>
                                <li>
                                    <strong>Emergency phone</strong> - Emergency contact (optional)
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                id="skip-duplicates"
                                type="checkbox"
                                checked={skipDuplicates}
                                onChange={(e) => setSkipDuplicates(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                disabled={isLoading}
                            />
                            <Label htmlFor="skip-duplicates" className="text-sm text-muted-foreground">
                                Skip duplicate tenants
                            </Label>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={!selectedFile || isLoading} className="flex-1">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Import CSV
                                    </>
                                )}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
