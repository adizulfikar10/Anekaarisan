<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Province extends Model
{
    public $incrementing = false;

    protected $table = 'provinces';

    protected $fillable = ['id','name'];

    public function region()
    {
        return $this->hasMany('App\Models\Region', 'id', 'id');
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
