<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\ProductDetail;

class ProductDetailController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api',  ['except' => ['index']]);
    }

    public function index(Request $request)
    {
        try {
            $productdetail = $this->searchGenerator($request);
            return response()->json($productdetail, 200);
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
            'price' => 'required|digits_between:1,13',
            'periode' => 'required|digits_between:1,2',
        ]);

        try {
            $productdetail = ProductDetail::create($request->all());
            return response()->json($productdetail, 201);
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
            'productdetails' => 'required|array',
            'productdetails.*.product_id' => 'required|exists:products,id',
            'productdetails.*.price' => 'required',
            // 'productdetails.*.price' => 'required|digits_between:1,13',
            'productdetails.*.periode' => 'required|digits_between:1,2',
        ]);

        try {
            foreach ($request->productdetails as $key => $value) {
                $productdetail = ProductDetail::create($value);
            }
            return response()->json($request->productdetails, 201);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function updateBulk(Request $request, $idproduct)
    {
        $validatedData = $request->validate([
            'productdetails' => 'required|array',
            'productdetails.*.product_id' => 'required|exists:products,id',
            'productdetails.*.price' => 'required',
            // 'productdetails.*.price' => 'required|digits_between:1,13',
            'productdetails.*.periode' => 'required|digits_between:1,2',
        ]);

        try {

            ProductDetail::where('product_id', $idproduct)->delete();

            foreach ($request->productdetails as $key => $value) {
                $productdetail = ProductDetail::create($value);
            }

            return response()->json($request->productdetails, 201);
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
            $productdetail = ProductDetail::findOrFail($request->id);
            return response()->json($productdetail, 200);
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
            'price' => 'required|digits_between:1,13',
            'periode' => 'required|digits_between:1,2',
        ]);

        try {
            $productdetail = ProductDetail::findOrFail($request->id);

            $productdetail->update($request->all());

            return response()->json($productdetail, 200);
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
            $productdetail = ProductDetail::findOrFail($request->id);

            ProductDetail::destroy($id);

            return response()->json($productdetail, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function searchGenerator($request)
    {
        $per_page = $request->per_page ?  $request->per_page : 'all';
        $filter = $request->filter ? $request->filter : [];
        $sort = $request->sort ? $request->sort : 'created_at,ASC';
        $join = $request->join ? $request->join : '';
        $count = $request->count ? $request->count : '';
        $whereHas = $request->where_has ? $request->where_has : [];
        $limit = $request->limit ? $request->limit : '';

        $productdetail = new ProductDetail;

        if (is_array($whereHas)) {
            foreach ($whereHas as $item => $value) {
                $words = explode(",", $value);
                $productdetail = $productdetail->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }

        if ($join !== '') {
            $join = Str::lower($join);
            $words = explode(",", $join);
            $productdetail = $productdetail->with($words);
        }

        if ($count !== '') {
            $count = Str::lower($count);
            $words = explode(",", $count);
            $productdetail = $productdetail->withCount($words);
        }

        if (is_array($filter)) {
            foreach ($filter as $item => $value) {
                $words = explode(",", $value);
                if (array_key_exists(2, $words)) {
                    if ($words[2] || $words[2] == 'AND') {
                        $productdetail = $productdetail->orWhere($words[0], 'LIKE', '%' . $words[1] . '%');
                    } else {
                        $productdetail = $productdetail->where($words[0], 'LIKE', '%' . $words[1] . '%');
                    }
                } else {
                    $productdetail = $productdetail->where($words[0], 'LIKE', '%' . $words[1] . '%');
                }
            }
        }

        $sortItem = explode(",", $sort);
        if (strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC') {
            $productdetail = $productdetail->orderBy($sortItem[0], $sortItem[1]);
        }

        if ($limit != '') {
            $productdetail = $productdetail->limit($limit)->get();
        } else {
            if ($per_page !== 'all') {
                $productdetail = $productdetail->paginate($per_page);
            } else {
                $productdetail = $productdetail->get();
            }
        }

        return $productdetail;
    }
}
