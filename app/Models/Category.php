<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Category extends Model
{
    use Uuid;

    public $incrementing = false;
    protected $primaryKey = 'id';

    protected $table = 'categories';

    protected $fillable = ['name', 'parent_id', 'image_ids', 'icon_name'];

    protected $casts = [
        'image_ids' => 'array',
    ];

    public function parent()
    {
        return $this->hasOne('App\Models\Category', 'id', 'parent_id');
    }

    public function subcategories()
    {
        return $this->hasMany('App\Models\Category', 'parent_id', 'id');
    }
}