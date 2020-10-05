<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Village extends Model
{
    public $incrementing = false;

    protected $table = 'villages';

    protected $fillable = ['id','name'];

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
