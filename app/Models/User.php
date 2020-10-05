<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
// use Illuminate\Contracts\Auth\Access\Authorizable;
use Spatie\Permission\Traits\HasRoles;
use App\Traits\Uuid;

class User extends Authenticatable implements JWTSubject
{

    use Notifiable, HasRoles, Uuid;

    protected $primaryKey = 'id';
    public $incrementing = false;

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

     /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    protected $fillable = ['name', 'email', 'password', 'status', 'phone_number' , 'is_active', 'agent_code', 'referral_code', 'card_numbers', 'province', 'region', 'district', 'village', 'street'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'id' => 'string',
        'card_numbers' => 'json'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function wallet()
    {
        return $this->hasOne('App\Models\Wallet');
    }

    public function children()
    {
        return $this->hasMany('App\Models\User', 'referral_code', 'agent_code');
    }

    public function parent()
    {
        return $this->hasOne('App\Models\User', 'agent_code', 'referral_code');
    }
}
