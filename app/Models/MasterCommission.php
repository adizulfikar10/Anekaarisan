<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MasterCommission extends Model
{
    use Uuid;
    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'master_commissions';

    protected $fillable = ['commission_percent'];

}
