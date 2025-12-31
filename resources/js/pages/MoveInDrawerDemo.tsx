// import React, { useState } from 'react';
// import { Head } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import MoveInCreateDrawer from '@/pages/MoveIn/MoveInCreateDrawer';
// import { SingleDatePicker } from '@/components/ui/singleDatePicker';
// import { Plus, Calendar } from 'lucide-react';

// interface Props {
//     units: string[];
// }

// export default function MoveInDrawerDemo({ units = ['Unit 101', 'Unit 102', 'Unit 201', 'Unit 202', 'Unit 301'] }: Props) {
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

//     const handleSuccess = () => {
//         // Handle successful creation - could show a toast, refresh data, etc.
//         console.log('Move-in record created successfully!');
//     };

//     const handleDateChange = (date: Date | undefined) => {
//         setSelectedDate(date);
//         console.log('Selected date:', date);
//     };

//     return (
//         <AppLayout>
//             <Head title="Move-In Drawer Demo" />

//             <div className="py-12">
//                 <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="text-2xl">Move-In Drawer Component Demo</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-4">
//                                 <p className="text-muted-foreground">
//                                     This demo page showcases the MoveInCreateDrawer component that replicates 
//                                     all functionality from the original Create component in a drawer format.
//                                 </p>
                                
//                                 <div className="flex gap-4">
//                                     <Button onClick={() => setIsDrawerOpen(true)}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Open Move-In Drawer
//                                     </Button>
//                                 </div>

//                                 <div className="mt-8 p-6 border rounded-lg bg-muted/50">
//                                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                         <Calendar className="h-5 w-5" />
//                                         Calendar Input Demo
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div className="max-w-sm">
//                                             <Label htmlFor="demo-date">Select a Date</Label>
//                                             <SingleDatePicker
//                                                 value={selectedDate}
//                                                 onChange={handleDateChange}
//                                                 placeholder="Choose a date..."
//                                                 className="w-full mt-2"
//                                             />
//                                         </div>
//                                         {selectedDate && (
//                                             <div className="text-sm text-muted-foreground">
//                                                 Selected date: {selectedDate.toLocaleDateString('en-US', {
//                                                     weekday: 'long',
//                                                     year: 'numeric',
//                                                     month: 'long',
//                                                     day: 'numeric'
//                                                 })}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="mt-8">
//                                     <h3 className="text-lg font-semibold mb-4">Features Included:</h3>
//                                     <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
//                                         <li>All form fields from the original Create component</li>
//                                         <li>Complete form validation and error handling</li>
//                                         <li>Unit dropdown with dynamic data</li>
//                                         <li>Date inputs for all date fields</li>
//                                         <li>Yes/No select dropdowns for boolean fields</li>
//                                         <li>Form submission with loading states</li>
//                                         <li>Proper drawer header with title and close button</li>
//                                         <li>Drawer footer with Cancel and Submit buttons</li>
//                                         <li>Form reset on successful submission</li>
//                                         <li>Responsive design that works on all screen sizes</li>
//                                         <li>Full-width drawer for optimal form viewing</li>
//                                         <li>Scrollable content area for long forms</li>
//                                         <li>Interactive calendar input with date picker functionality</li>
//                                         <li>Real-time date selection and display</li>
//                                     </ul>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             <MoveInCreateDrawer
//                 units={units}
//                 open={isDrawerOpen}
//                 onOpenChange={setIsDrawerOpen}
//                 onSuccess={handleSuccess}
//             />
//         </AppLayout>
//     );
// }