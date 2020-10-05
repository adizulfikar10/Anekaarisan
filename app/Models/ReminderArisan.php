<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class ReminderArisan extends Model
{
    use Uuid;
    
    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'reminder_arisans';

    protected $fillable = ['meta', 'arisan_id', 'reminder_date', 'status'];

    protected $casts = [
        "meta" => "json"
    ];
}