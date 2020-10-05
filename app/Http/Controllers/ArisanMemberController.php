<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\ArisanMember;

class ArisanMemberController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $arisanmember = $this->searchGenerator($request);
            return response()->json($arisanmember, 200);
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
            'name' => 'required|max:30',
            'product_id' => 'required|uuid|exists:products,id',
            'arisan_id' => 'required|uuid|exists:arisans,id',
            'status' => 'required|boolean',
            'meta_product' => 'json|nullable',
        ]);

        try {
            $arisanmember = ArisanMember::create($request->all());
            return response()->json($arisanmember, 201);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = $th;
            return response()->json($this->content, 500);
        }
    }

    public function bulk(Request $request)
    {
        $validatedData = $request->validate([
            'arisanmembers' => 'required|array',
            'arisanmembers.*.name' => 'required|max:30',
            'arisanmembers.*.arisan_id' => 'required|uuid|exists:arisans,id',
            'arisanmembers.*.product_id' => 'required|uuid|exists:products,id',
            'arisanmembers.*.status' => 'required|boolean',
            'arisanmembers.*.meta_product' => 'json|nullable',
        ]);

        try {
            foreach ($request->arisanmembers as $key => $value) {
               $arisanmember = ArisanMember::create($value);
            }
            return response()->json($request->arisanmembers, 201);
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
            $arisanmember = ArisanMember::findOrFail($request->id);
            return response()->json($arisanmember, 200);
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
            'name' => 'max:30',
            'product_id' => 'uuid|exists:products,id',
            'arisan_id' => 'uuid|exists:arisans,id',
            'status' => 'boolean',
            'meta_product' => 'json|nullable',
        ]);

        try {
            $arisanmember = ArisanMember::findOrFail($request->id);

            $arisanmember->update($request->all());

            return response()->json($arisanmember, 200);
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
            $arisanmember = ArisanMember::findOrFail($request->id);

            ArisanMember::destroy($id);

            return response()->json($arisanmember, 200);
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
       
        $arisanmember = new ArisanMember;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $arisanmember = $arisanmember->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $arisanmember = $arisanmember->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $arisanmember = $arisanmember->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $arisanmember = $arisanmember->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $arisanmember = $arisanmember->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $arisanmember = $arisanmember->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $arisanmember = $arisanmember->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $arisanmember = $arisanmember->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $arisanmember = $arisanmember->paginate($per_page);
            }else{
                $arisanmember = $arisanmember->get();
            }
        }
        
        return $arisanmember;
    }
}