<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Uuid;

class Promo extends Model
{
    use Uuid;
    
    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'promos';

    protected $fillable = ['name', 'status', 'banner_status', 'date_start', 'date_end', 'promo_percent', 'image_ids'];

    protected $casts = [
        'image_ids' => 'json',
    ];

    public function products()
    {
        return $this->hasMany('App\Models\ProductPromo', 'promo_id', 'id');
    }

}