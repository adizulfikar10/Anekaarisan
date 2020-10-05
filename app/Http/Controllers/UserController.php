<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Role;
use App\Models\MasterSaldo;
use App\Models\Province;
use Illuminate\Support\Facades\Auth;
use App\Rules\matchOldPassword;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['register']]);
    }

    public function index(Request $request)
    {
        try {
            $user = $this->searchGenerator($request);
            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'something went wrong';
            return response()->json($this->content, 500);
        }
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'phone_number' => 'required|string|min:9|unique:users,phone_number',
            'status' => 'required|in:WAIT,APPROVED,REJECT,',
            'role' => 'required|in:admin,agent',
            'is_active' => 'required|boolean',
            'province' => 'required_if:role,==,agent|string',
            'province_id' => 'required_if:role,==,agent|string',
            'referral_code' => 'exists:users,agent_code',
            'card_numbers' => 'array',
        ]);

         try {
            $referral = $this->getAgentCode($request->province_id);

           if($request->role === 'admin') {
            $request->merge([
                'password' => Hash::make($request->password),
                'agent_code' => (string) Str::uuid()
            ]);
           } else {
            $request->merge([
                'password' => Hash::make($request->password),
                'agent_code' => $referral
            ]);
           }

            $user = User::create($request->all());

            $role = Role::findByName($request->role);


            //assign role and wallet
            if($role){
                $user->assignRole($role);

                if($request->role == 'agent') {
                    MasterSaldo::create([
                        "user_id" => $user->id,
                        "saldo" => 0,
                    ]);
                }
            }
            return response()->json($user, 201);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'email|unique:users,email',
            // 'password' => 'required|string|min:6|confirmed',
            'phone_number' => 'required|string|min:9|unique:users,phone_number',
            'status' => 'required|in:WAIT,APPROVED,REJECT,',
            'is_active' => 'required|boolean',
            'province_id' => 'required|string',
            'province' => 'required|string',
            'referral_code' => 'exists:users,agent_code',
            'card_numbers' => 'array',
        ]);


       try {
            $referral = $this->getAgentCode($request->province_id);

            $password = '12345';

            $request->merge([
                'password' => Hash::make($password),
                'agent_code' => $referral
            ]);
            $user = User::create($request->all());

            $role = Role::findByName('agent');


            //assign role and inject wallet
            if($role){
                $user->assignRole($role);

                MasterSaldo::create([
                    "user_id" => $user->id,
                    "saldo" => 0,
                ]);

            }
            return response()->json($user, 201);
       } catch (\Throwable $th) {
           $this->content['statusCode'] = 500;
           $this->content['error'] = 'Internal Server Error';
           $this->content['message'] = 'Failed to create';
           return response()->json($this->content, 500);
       }
    }

    public function bulk(Request $request)
    {
        $validatedData = $request->validate([
            'users' => 'required|array',
            'users.*.name' => 'required|string|max:30',
            'users.*.email' => 'required|email||unique:users,email',
            'users.*.password' => 'required|string|min:5',
        ]);

        try {
            foreach ($request->users as $key => $value) {
                $userValue = [
                    'name' => $value['name'],
                    'email' => $value['email'],
                    'password' => Hash::make($value['password']),
                ];

                    $user = User::create($userValue);
            }

            return response()->json($request->users, 201);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function show(Request $request)
    {

        try {
            $user = User::where('id', $request->id)->with(['roles', 'wallet'])->get();
            if(count($user) > 0) {
                return response()->json($user, 200);
            }

            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            return response()->json($this->content, 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'string|max:30',
            'email' => 'email|unique:users,email,'.$id,
            'phone_number' => 'required|string|min:9|unique:users,phone_number,'.$id,
            'status' => 'required|in:WAIT,APPROVED,REJECT,',
            'is_active' => 'boolean',
            'referral_code' => 'exists:users,agent_code',
            'card_numbers' => 'array',
        ]);

        try {
            $user = User::findOrFail($request->id);

            $user->update($request->except(['password']));

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $user = User::findOrFail($request->id);

            User::destroy($id);

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function changePassword(Request $request, $id)
    {
        $validatedData = $request->validate([
            'current_password' => ['required', new matchOldPassword],
            'password' => 'required|string|min:6|confirmed',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['password' => Hash::make($request->password)]);

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to update password';
            return response()->json($this->content, 500);
        }
    }

    public function resetPassword(Request $request, $id)
    {
        $validatedData = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['password' => Hash::make($request->password)]);

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function changeStatusUser(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|in:WAIT,APPROVED,REJECT,',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['status' =>$request->status]);

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function changeActivationUser(Request $request, $id)
    {
        $validatedData = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['is_active' =>$request->is_active]);

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function searchGenerator($request) {
        $per_page = $request->per_page ?  $request->per_page : 'all';
        $filter = $request->filter ? $request->filter : [];
        $sort = $request->sort ? $request->sort : 'created_at,ASC';
        $join = $request->join ? $request->join : '';
        $count = $request->count ? $request->count : '';
        $whereHas = $request->where_has ? $request->where_has : [];
        $limit = $request->limit ? $request->limit : '';
        $whereRoles = $request->where_roles ? $request->where_roles : '';

        $user = new User;

       if($whereRoles) {
            $role = Role::findByName($whereRoles);
            $user = $user->role($role);
       }

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $user = $user->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $user = $user->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $user = $user->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $user = $user->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $user = $user->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $user = $user->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $user = $user->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $user = $user->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $user = $user->paginate($per_page);
            }else{
                $user = $user->get();
            }
        }

        return $user;
    }

    public function getAgentCode($id) {
        // $referral = strtoupper(Str::random(6));
        // TODO: get province Id by province name
        // $id = Province::Select("id")->Where("name",strtoupper($name))->first();
        $faceOfReferral = $id.'-'.date("Y");

        $countUser = User::where('agent_code', 'LIKE', $faceOfReferral.'%')->count() + 1;

        if($countUser < 10) {
            $countUser = '000'.$countUser;
        }else if($countUser < 100) {
            $countUser = '00'.$countUser;
        }else if($countUser < 1000) {
            $countUser = '0'.$countUser;
        }else{
            $countUser = $countUser;
        }

        return $faceOfReferral."-".$countUser;
    }
}
