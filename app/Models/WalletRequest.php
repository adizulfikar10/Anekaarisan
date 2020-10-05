<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class WalletRequest extends Model
{
    use Uuid;

    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'wallet_requests';

    protected $fillable = ['id','user_id','amount','status','category','bank_account','notes','meta_transaction'];

    protected $casts = [
        'meta_transaction' => 'json',
    ];

    public function user()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }
}
