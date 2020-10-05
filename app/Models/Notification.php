<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Notification extends Model
{
    use Uuid;

    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'notifications';

    protected $fillable = ['recipient_id', 'content', 'date', 'is_read', 'category'];
}