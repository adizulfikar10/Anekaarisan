<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class ProductPromo extends Model
{
    use Uuid;
    
    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'product_promos';

    protected $fillable = ['product_id', 'promo_id'];

    public function promo()
    {
        return $this->hasOne('App\Models\Promo', 'id', 'promo_id');
    }

    public function product()
    {
        return $this->hasOne('App\Models\Product', 'id', 'product_id');
    }
}