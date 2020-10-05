<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Payment extends Model
{
    use Uuid;

    public $incrementing = false;

    protected $table = 'payments';

    protected $fillable = [
        'id', 'meta', 'arisan_transaction_id',
        'currency',
        'order_id',
        'status_code',
        'fraud_status',
        'gross_amount',
        'payment_type',
        'signature_key',
        'status_message',
        'transaction_id',
        'transaction_time',
        'transaction_status'
    ];


    protected $casts = [
        'meta' => 'json',
    ];
}
