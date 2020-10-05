<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\MasterImage;
use Illuminate\Support\Facades\Storage;

class MasterImageController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api',  ['except' => ['index']]);
    }

    public function index(Request $request)
    {
        try {
            $masterimage = $this->searchGenerator($request);
            return response()->json($masterimage, 200);
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
            'file' => 'required|file|mimes:jpg,jpeg',
        ]);

        try {
            $storage = Storage::disk('public')->put('images/', $request->file);
            $name = $request->file->getClientOriginalName();
            $info = pathinfo($storage);
            $size = $request->file->getClientSize();


            $data = [
                "name" => $name,
                "ext" => $info["extension"],
                "path" => '/storage/'.$info["dirname"].'/'.$info["basename"],
                "size" => $size,
                "uploaded_by" => auth()->user()->id
            ];

            $masterimage = masterimage::create($data);

            return response()->json($masterimage, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'something went wrong';
            return response()->json($this->content, 500);
        }
    }

    public function bulk(Request $request)
    {
        $validatedData = $request->validate([
            'file' => 'required|array|max:4',
            'file.*' => 'required|file|mimes:jpg,jpeg|dimensions:ratio=1/1',
        ]);

        try {
            foreach ($request->file as $key => $value) {
                $storage = Storage::put('images/', $value);
                $name = $value->getClientOriginalName();
                $info = pathinfo($storage);
                $size = $value->getClientSize();
    
                $data = [
                    "name" => $name,
                    "ext" => $info["extension"],
                    "path" => $info["dirname"].'/'.$info["basename"],
                    "size" => $size,
                    "uploaded_by" => auth()->user()->id
                ];

               $masterimage = MasterImage::create($data);
            }
            return response()->json($value, 201);
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
            $masterimage = MasterImage::findOrFail($request->id);
            return response()->json($masterimage, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    // public function update(Request $request, $id)
    // {
    //     $validatedData = $request->validate([
    //         'name' => 'required',
    //     ]);

    //     try {
    //         $masterimage = MasterImage::findOrFail($request->id);

    //         $masterimage->update($request->all());

    //         return response()->json($masterimage, 200);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 404;
    //         $this->content['error'] = 'Not Found';
    //         $this->content['message'] = 'Data Not Found';
    //         return response()->json($this->content, 404);
    //     }
    // }

    public function delete(Request $request, $id)
    {
        try {
            $masterimage = MasterImage::findOrFail($request->id);
            $exists = Storage::exists($masterimage->path);

            if($exists){
                Storage::delete($masterimage->path);
            }

            MasterImage::destroy($id);

            return response()->json($masterimage, 200);
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
        $whereIn = $request->where_in ? $request->where_in : [];
        $limit = $request->limit ? $request->limit : '';
       
        $masterimage = new MasterImage;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $masterimage = $masterimage->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if(is_array($whereIn) && count($whereIn) > 0){
            $masterimage = $masterimage->whereIn('id', $whereIn);
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $masterimage = $masterimage->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $masterimage = $masterimage->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $masterimage = $masterimage->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $masterimage = $masterimage->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $masterimage = $masterimage->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $masterimage = $masterimage->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $masterimage = $masterimage->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $masterimage = $masterimage->paginate($per_page);
            }else{
                $masterimage = $masterimage->get();
            }
        }
        
        return $masterimage;
    }
}