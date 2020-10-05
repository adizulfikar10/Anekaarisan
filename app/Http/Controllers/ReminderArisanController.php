<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\ReminderArisan;

class ReminderArisanController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $reminderarisan = $this->searchGenerator($request);
            return response()->json($reminderarisan, 200);
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
            'name' => 'required',
        ]);

        try {
            $reminderarisan = ReminderArisan::create($request->all());
            return response()->json($reminderarisan, 201);
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
            'reminderarisans' => 'required|array',
        ]);

        try {
            foreach ($request->reminderarisans as $key => $value) {
               $reminderarisan = ReminderArisan::create($value);
            }
            return response()->json($request->reminderarisans, 201);
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
            $reminderarisan = ReminderArisan::findOrFail($request->id);
            return response()->json($reminderarisan, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required',
        ]);

        try {
            $reminderarisan = ReminderArisan::findOrFail($request->id);

            $reminderarisan->update($request->all());

            return response()->json($reminderarisan, 200);
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
            $reminderarisan = ReminderArisan::findOrFail($request->id);

            ReminderArisan::destroy($id);

            return response()->json($reminderarisan, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
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
       
        $reminderarisan = new ReminderArisan;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $reminderarisan = $reminderarisan->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $reminderarisan = $reminderarisan->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $reminderarisan = $reminderarisan->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $reminderarisan = $reminderarisan->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $reminderarisan = $reminderarisan->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $reminderarisan = $reminderarisan->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $reminderarisan = $reminderarisan->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $reminderarisan = $reminderarisan->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $reminderarisan = $reminderarisan->paginate($per_page);
            }else{
                $reminderarisan = $reminderarisan->get();
            }
        }
        
        return $reminderarisan;
    }
}