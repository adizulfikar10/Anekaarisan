<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Uuid;

class MasterImage extends Model
{
    use Uuid;
    public $incrementing = false;

    protected $table = 'master_images';
    
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'ext', 'size', 'path', 'uploaded_by'];
   
}