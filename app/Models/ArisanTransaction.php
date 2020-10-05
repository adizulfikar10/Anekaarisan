<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class ArisanTransaction extends Model
{
    use Uuid;
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $table = 'arisan_transactions';

    protected $fillable = ['arisan_id', 'meta_arisan', 'meta_product', 'status', 'remaining_funds', 'shipping_number', 'courier', 'order_id'];

    protected $casts = [
        "meta_arisan" => 'json',
        "meta_product" => 'json'
    ];

    public function payments()
    {
        return $this->hasMany('App\Models\Payment', 'arisan_transaction_id', 'id')->orderBy('created_at', 'DESC');
    }

    public function arisan()
    {
        return $this->hasOne('App\Models\Arisan', 'id', 'arisan_id');
    }

    public function arisanmember()
    {
        return $this->hasOne('App\Models\ArisanMember', 'arisan_transaction_id', 'id');
    }
}
