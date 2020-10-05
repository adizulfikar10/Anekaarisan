<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Region extends Model
{
    public $incrementing = false;

    protected $table = 'regions';

    protected $fillable = ['id','name'];

    public function district()
    {
        return $this->hasMany('App\Models\District', 'id', 'id');
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function($model){
            $model->id = self::generateUuid();
        });
    }
    public static function generateUuid()
    {
        return (string) Str::uuid();
    }
}
