<?php

namespace App\Services;

use App\Models\Notice;

class NoticeService
{
    public function create(array $data): Notice
    {
        return Notice::create($data);
    }

    public function update(Notice $notice, array $data): Notice
    {
        $notice->fill($data);
        $notice->save();
        return $notice;
    }

    public function delete(Notice $notice): void
    {
        // Soft delete by setting is_archived to true
        $notice->update(['is_archived' => true]);
    }

    public function listAll()
    {
        // Only return active (non-archived) notices
        return Notice::active()->get();
    }

    public function findById(int $id)
    {
        // Only find active notices
        return Notice::active()->findOrFail($id);
    }

    public function restore(Notice $notice): void
    {
        // Restore archived notice
        $notice->update(['is_archived' => false]);
    }

    public function listArchived()
    {
        // Return only archived notices
        return Notice::archived()->get();
    }
}
