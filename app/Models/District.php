<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class District extends Model
{
    public $incrementing = false;

    protected $table = 'districts';

    protected $fillable = ['id','name'];

    public function village()
    {
        return $this->hasMany('App\Models\Village', 'id', 'id');
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
