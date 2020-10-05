<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Arisan extends Model
{
    use Uuid;

    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'arisans';

    protected $fillable = ['sequence_code', 'duration', 'start_date', 'end_date', 'total_funds', 'average_funds', 'status', 'user_id', 'funds'];

    public function arisantransactions()
    {
        return $this->hasMany('App\Models\ArisanTransaction', 'arisan_id', 'id');
    }

    public function reminders()
    {
        return $this->hasMany('App\Models\ReminderArisan', 'arisan_id', 'id');
    }

    public function arisanmembers()
    {
        return $this->hasMany('App\Models\ArisanMember', 'arisan_id', 'id');
    }

    public function user()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }
}
