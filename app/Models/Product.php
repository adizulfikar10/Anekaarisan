<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Product extends Model
{
    use Uuid;

    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'products';

    protected $fillable = ['name', 'base_price', 'commission', 'image_ids', 'description'];

    protected $casts = [
        'image_ids' => 'array',
    ];

    public function productdetails()
    {
        return $this->hasMany('App\Models\ProductDetail', 'product_id', 'id');
    }

    public function productpromos()
    {
        return $this->hasMany('App\Models\ProductPromo');
    }

    public function productcategories()
    {
        return $this->hasMany('App\Models\ProductCategory');
    }
}
