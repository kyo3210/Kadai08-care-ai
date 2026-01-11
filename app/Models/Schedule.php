<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'type',
        'client_id',
        'title',
        'description',
        'start',
        'end',
        'color'
    ];
    /**
 * この予定に紐づくケア記録を取得
 */
public function careRecord()
{
    // schedule_id をキーにして CareRecord と 1対1 で紐付ける
    return $this->hasOne(CareRecord::class, 'schedule_id');
}
}

