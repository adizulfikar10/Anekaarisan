<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Notice;

class NoticeController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $notice = $this->searchGenerator($request);
            return response()->json($notice, 200);
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
            'user_id' => 'required|exists:users,id',
            'message' => 'string|nullable',
        ]);

        try {
            $notice = Notice::create($request->all());
            return response()->json($notice, 201);
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
            'notices' => 'required|array',
            'notices.*.user_id' => 'required|exists:users,id',
            'notices.*.message' => 'string|nullable',
        ]);

        try {
            foreach ($request->notices as $key => $value) {
                $notice = Notice::create($value);
            }
            return response()->json($request->notices, 201);
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
            $notice = Notice::findOrFail($request->id);
            return response()->json($notice, 200);
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
            'user_id' => 'required|exists:users,id',
            'message' => 'string|nullable',
            'is_read' => 'boolean',
        ]);

        try {
            $notice = Notice::findOrFail($request->id);

            $notice->update($request->all());

            return response()->json($notice, 200);
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
            $notice = Notice::findOrFail($request->id);

            Notice::destroy($id);

            return response()->json($notice, 200);
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

        $notice = new Notice;

        if (is_array($whereHas)) {
            foreach ($whereHas as $item => $value) {
                $words = explode(",", $value);
                $notice = $notice->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }

        if ($join !== '') {
            $join = Str::lower($join);
            $words = explode(",", $join);
            $notice = $notice->with($words);
        }

        if ($count !== '') {
            $count = Str::lower($count);
            $words = explode(",", $count);
            $notice = $notice->withCount($words);
        }

        if (is_array($filter)) {
            foreach ($filter as $item => $value) {
                $words = explode(",", $value);
                if (array_key_exists(2, $words)) {
                    if ($words[2] || $words[2] == 'AND') {
                        $notice = $notice->orWhere($words[0], 'LIKE', '%' . $words[1] . '%');
                    } else {
                        $notice = $notice->where($words[0], 'LIKE', '%' . $words[1] . '%');
                    }
                } else {
                    $notice = $notice->where($words[0], 'LIKE', '%' . $words[1] . '%');
                }
            }
        }

        $sortItem = explode(",", $sort);
        if (strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC') {
            $notice = $notice->orderBy($sortItem[0], $sortItem[1]);
        }

        if ($limit != '') {
            $notice = $notice->limit($limit)->get();
        } else {
            if ($per_page !== 'all') {
                $notice = $notice->paginate($per_page);
            } else {
                $notice = $notice->get();
            }
        }

        return $notice;
    }

    public function myNotice(Request $request)
    {
        try {
            $id =  auth()->user()->id;
            $notices = Notice::where([
                ['user_id', $id],
                // ['is_read', false],
            ])
                ->orderBy('created_at', 'DESC')
                ->paginate(30);
            // $unreadMessage = Notice::where([
            //     ['user_id', $id],
            //     ['is_read', false],
            // ])->count();

            // $notices['unread_messages'] = $unreadMessage;

            return response()->json($notices, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function readMyNotice()
    {
        try {
            $id =  auth()->user()->id;
            $notices = Notice::where([
                ['user_id', $id],
                ['is_read', false],
            ])->update(
                [
                    'is_read' => true
                ]
            );

            return response()->json($notices, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }
}
