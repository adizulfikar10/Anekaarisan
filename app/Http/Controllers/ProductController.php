<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\MasterImage;
use App\Models\ProductDetail;

class ProductController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api',  ['except' => ['index', 'show','productCatalogue']]);
    }

    public function index(Request $request)
    {
        try {
            $product = $this->searchGenerator($request);


            if ($request->per_page) {

                $pagination = json_decode($product->toJson());
                $index = 0;
                $dataProduct = $pagination->data;
                foreach ($dataProduct as $pro) {
                    if (count($pro->image_ids) > 0) {
                        $masterimage = MasterImage::whereIn('id', $pro->image_ids)->get();
                        $mis = array();
                        foreach ($masterimage as $mi) {
                            $mi->url = env('APP_URL') . $mi->path;
                            array_push($mis, $mi);
                        }

                        $dataProduct[$index]->images = $mis;
                    }
                    $index++;
                }

                $product = $pagination;
            } else {
                $index = 0;
                foreach ($product as $pro) {
                    if (count($pro->image_ids) > 0) {
                        $masterimage = MasterImage::whereIn('id', $pro->image_ids)->get();
                        $product[$index]->images = $masterimage;
                    }
                    $index++;
                }
            }

            return response()->json($product, 200);
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
            'base_price' => 'required',
            'commission' => 'required',
            'image_ids' => 'array',
            'image_ids.*' => 'uuid|exists:master_images,id',
            'productdetails' => 'array',
            'productdetails.*.price' => 'required_if:productdetails,min:1|numeric',
            'productdetails.*.periode' => 'required_if:productdetails,min:1|numeric',
        ]);

        try {
            $product = Product::create($request->all());

            if (count($request->productdetails) > 0) {
                foreach ($request->productdetails as $key => $value) {
                    $value['product_id'] = $product->id;
                    ProductDetail::create($value);
                }
            }

            return response()->json($product, 201);
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
            'products' => 'required|array',
        ]);

        try {
            foreach ($request->products as $key => $value) {
                $product = Product::create($value);
            }
            return response()->json($request->products, 201);
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
            $product = Product::where('id', $request->id)->with(['productpromos', 'productpromos.promo', 'productdetails'])->first();
            if (count($product->image_ids) > 0) {
                $masterimage = MasterImage::whereIn('id', $product->image_ids)->get();
                $product->images = $masterimage;
            }
            return response()->json($product, 200);
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
            'name' => 'required|string|max:30',
            'base_price' => 'required|digits_between:1,13',
            'commission' => 'required|digits_between:1,3',
            'image_ids' => 'array',
            'image_ids.*' => 'string|exists:master_images,id',
            'productdetails' => 'array',
            'productdetails.*.price' => 'required_if:productdetails,min:1|numeric',
            'productdetails.*.periode' => 'required_if:productdetails,min:1|numeric',
        ]);

        try {
            $product = Product::findOrFail($request->id);

            $product->update($request->all());

            if (count($request->productdetails)) {
                ProductDetail::where('product_id', $product->id)->delete();
                foreach ($request->productdetails as $key => $value) {
                    $value['product_id'] = $product->id;
                    ProductDetail::create($value);
                }
            }

            return response()->json($product, 200);
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
            $product = Product::findOrFail($request->id);

            Product::destroy($id);

            return response()->json($product, 200);
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
        $whereCategories = $request->where_categories ? $request->where_categories : [];
        $limit = $request->limit ? $request->limit : '';
        $between = $request->between ? $request->between : '';

        $product = new Product;


        if ($between) {
            $words = explode(",", $between);
            $product = $product->whereBetween($words[0], [$words[1], $words[2]]);
        }



        if (is_array($whereHas)) {
            foreach ($whereHas as $item => $value) {
                $words = explode(",", $value);
                $product = $product->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }

        if (is_array($whereCategories) && count($whereCategories) > 0) {
            $product = $product->whereHas('productcategories', function ($query) use ($whereCategories) {
                $query->whereIn('category_id', $whereCategories);
            });
        }

        if ($join !== '') {
            $join = Str::lower($join);
            $words = explode(",", $join);
            $product = $product->with($words);
        }

        if ($count !== '') {
            $count = Str::lower($count);
            $words = explode(",", $count);
            $product = $product->withCount($words);
        }

        if (is_array($filter)) {
            foreach ($filter as $item => $value) {
                $words = explode(",", $value);
                if (array_key_exists(2, $words)) {
                    if ($words[2] || $words[2] == 'AND') {
                        $product = $product->orWhere($words[0], 'LIKE', '%' . $words[1] . '%');
                    } else {
                        $product = $product->where($words[0], 'LIKE', '%' . $words[1] . '%');
                    }
                } else {
                    $product = $product->where($words[0], 'LIKE', '%' . $words[1] . '%');
                }
            }
        }

        $sortItem = explode(",", $sort);
        if (strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC') {
            $product = $product->orderBy($sortItem[0], $sortItem[1]);
        }

        if ($limit != '') {
            $product = $product->limit($limit)->get();
        } else {
            if ($per_page !== 'all') {
                $product = $product->paginate($per_page);
            } else {
                $product = $product->get();
            }
        }

        return $product;
    }

    public function productCatalogue()
    {
        try {
            $time = strtotime(date('Y-m-d'));
            $start = date("Y-m-d", strtotime("-6 month", $time));
            
            $product = Product::whereDate('created_at', '<=', date("Y-m-d"))
            ->with(['productdetails', 'productpromos', 'productcategories'])
            ->get();

            $index = 0;
                foreach ($product as $pro) {
                    if (count($pro->image_ids) > 0) {
                        $masterimage = MasterImage::whereIn('id', $pro->image_ids)->get();

                        $mis = array();
                        foreach ($masterimage as $mi) {
                            $mi->url = env('APP_URL') . $mi->path;
                            array_push($mis, $mi);
                        }

                        // $dataProduct[$index]->images = $mis;
                        $product[$index]->images = $mis;
                    }
                    $index++;
                }

            return response()->json($product, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }
}
