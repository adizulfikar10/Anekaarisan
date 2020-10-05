<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Notification;

class NotificationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $notification = $this->searchGenerator($request);
            return response()->json($notification, 200);
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
            'recipient_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'date' => 'required|date',
            'is_read' => 'required|boolean',
            'category' => 'required|in:COMMISSION,WITHDRAW',
        ]);

        try {
            $notification = Notification::create($request->all());
            return response()->json($notification, 201);
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
            'notifications' => 'required|array',
        ]);

        try {
            foreach ($request->notifications as $key => $value) {
               $notification = Notification::create($value);
            }
            return response()->json($request->notifications, 201);
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
            $notification = Notification::findOrFail($request->id);
            return response()->json($notification, 200);
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
            'recipient_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'date' => 'required|date',
            'is_read' => 'required|boolean',
            'category' => 'required|in:COMMISSION,WITHDRAW',
        ]);

        try {
            $notification = Notification::findOrFail($request->id);

            $notification->update($request->all());

            return response()->json($notification, 200);
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
            $notification = Notification::findOrFail($request->id);

            Notification::destroy($id);

            return response()->json($notification, 200);
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
       
        $notification = new Notification;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $notification = $notification->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $notification = $notification->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $notification = $notification->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $notification = $notification->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $notification = $notification->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $notification = $notification->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $notification = $notification->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $notification = $notification->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $notification = $notification->paginate($per_page);
            }else{
                $notification = $notification->get();
            }
        }
        
        return $notification;
    }
}