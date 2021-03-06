<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Category;

class CategoryController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api',  ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        try {
            $category = $this->searchGenerator($request);
            return response()->json($category, 200);
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
            'name' => 'required|max:100',
            'parent_id' => 'exists:categories,id',
            'icon_name' => 'string|max:100',
            'image_ids' => 'array',
            'image_ids.*' => 'uuid|exists:master_images,id',
        ]);

        try {
            $category = Category::create($request->all());
            return response()->json($category, 201);
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
            'categories' => 'required|array',
            'categories.*.name' => 'required|max:100',
            'categories.*.parent_id' => 'exists:categories,id',
            'categories.*.icon_name' => 'string|max:100',
            'categories.*.image_ids' => 'array',
            'categories.*.image_ids.*' => 'uuid|exists:master_images,id',
        ]);

        try {
            foreach ($request->categories as $key => $value) {
               $category = Category::create($value);
            }
            return response()->json($request->categories, 201);
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
            $category = Category::findOrFail($request->id);
            return response()->json($category, 200);
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
            'name' => 'required|max:100',
            'parent_id' => 'exists:categories,id|nullable',
            'icon_name' => 'string|max:100',
            'image_ids' => 'array',
            'image_ids.*' => 'uuid|exists:master_images,id',
        ]);

        try {
            $category = Category::findOrFail($request->id);

            $category->update($request->all());

            return response()->json($category, 200);
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
            $category = Category::findOrFail($request->id);

            Category::destroy($id);

            return response()->json($category, 200);
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
       
        $category = new Category;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $category = $category->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $category = $category->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $category = $category->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $category = $category->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $category = $category->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    if($words[1] === 'null' || $words[1] === NULL){
                        $category = $category->where($words[0], NULL);
                    }else{
                        $category = $category->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $category = $category->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $category = $category->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $category = $category->paginate($per_page);
            }else{
                $category = $category->get();
            }
        }
        
        return $category;
    }
}