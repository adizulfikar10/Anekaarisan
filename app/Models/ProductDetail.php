<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Uuid;

class ProductDetail extends Model
{
    use Uuid;
    
    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'product_details';

    protected $fillable = ['product_id', 'price', 'periode'];
}