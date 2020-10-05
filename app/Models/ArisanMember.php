<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class ArisanMember extends Model
{
    use Uuid;

    public $incrementing = false;

    protected $table = 'arisan_members';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'product_id', 'status', 'meta_product', 'arisan_id', 'arisan_transaction_id'];

    protected $casts = [
        'meta_product' => 'json',
    ];
}
