<?php
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;
use App\Models\OffersAndRenewal;
use App\Models\NoticeAndEviction;
use App\Models\Notice;

// Other Schedule/Artisan definitions...

// Schedule::call(function () {
//     // Offers and Renewals expiry update
//     OffersAndRenewal::whereNotNull('how_many_days_left')->get()->each(function ($offer) {
//         if ($offer->how_many_days_left > 0) {
//             $offer->how_many_days_left -= 1;
//             $offer->expired = $offer->how_many_days_left <= 0 ? 'expired' : null;
//             $offer->save();
//         } elseif ($offer->how_many_days_left <= 0 && $offer->expired !== 'expired') {
//             $offer->expired = 'expired';
//             $offer->save();
//         }
//     });
//     OffersAndRenewal::whereNull('how_many_days_left')->whereNotNull('date_sent_lease')->get()->each(function ($offer) {
//         $offer->calculateExpiry();
//         $offer->save();
//     });

//     // NoticeAndEviction eviction logic update
//     $records = NoticeAndEviction::all();
//     foreach ($records as $record) {
//         if ($record->have_an_exception === 'Yes') {
//             $record->evictions = 'Have An Exception';
//         } elseif ($record->type_of_notice && $record->date) {
//             $notice = Notice::where('notice_name', $record->type_of_notice)->first();
//             if ($notice) {
//                 $days = $notice->days;
//                 $alertDate = \Carbon\Carbon::parse($record->date)->addDays($days);
//                 if ($alertDate->lessThanOrEqualTo(now())) {
//                     $record->evictions = 'Alert';
//                 } else {
//                     $record->evictions = '';
//                 }
//             }
//         }
//         $record->save();
//     }
// })->daily();

