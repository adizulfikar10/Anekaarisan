<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class MasterSaldo extends Model
{
    use Uuid;
    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'master_saldos';

    protected $fillable = ['user_id', 'saldo'];


    public function user()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }
}