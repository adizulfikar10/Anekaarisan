<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\ProductCategory;

class ProductCategoryController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $productcategory = $this->searchGenerator($request);
            return response()->json($productcategory, 200);
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
            'product_id' => 'required|exists:products,id',
            'category_id' => 'required|exists:categories,id',
        ]);

        try {
            $productcategory = ProductCategory::create($request->all());
            return response()->json($productcategory, 201);
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
            'productcategories' => 'required|array',
            'productcategories.*.product_id' => 'required|exists:products,id',
            'cproductcategories.*.ategory_id' => 'required|exists:categories,id',
        ]);

        try {
            foreach ($request->productcategories as $key => $value) {
               $productcategory = ProductCategory::create($value);
            }
            return response()->json($request->productcategories, 201);
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
            $productcategory = ProductCategory::findOrFail($request->id);
            return response()->json($productcategory, 200);
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
            'product_id' => 'required|exists:products,id',
            'category_id' => 'required|exists:categories,id',
        ]);

        try {
            $productcategory = ProductCategory::findOrFail($request->id);

            $productcategory->update($request->all());

            return response()->json($productcategory, 200);
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
            $productcategory = ProductCategory::findOrFail($request->id);

            ProductCategory::destroy($id);

            return response()->json($productcategory, 200);
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
       
        $productcategory = new ProductCategory;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $productcategory = $productcategory->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $productcategory = $productcategory->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $productcategory = $productcategory->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $productcategory = $productcategory->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $productcategory = $productcategory->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $productcategory = $productcategory->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $productcategory = $productcategory->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $productcategory = $productcategory->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $productcategory = $productcategory->paginate($per_page);
            }else{
                $productcategory = $productcategory->get();
            }
        }
        
        return $productcategory;
    }
}