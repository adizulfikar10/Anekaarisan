<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Arisan;
use App\Models\ArisanMember;
use App\Models\ArisanTransaction;
use App\Models\ReminderArisan;
use App\Models\Wallet;
use App\Models\MasterSaldo;

class ArisanController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $arisan = $this->searchGenerator($request);
            return response()->json($arisan, 200);
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
            // 'sequence_code' => 'required|string|unique:arisans,sequence_code',
            'duration' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'total_funds' => 'required',
            'average_funds' => 'required',
            'status' => 'required|in:PROGRESS,SUCCESS,REQUEST_CANCEL,CANCELED',
            // 'user_id' => 'required|string|exists:users,id',
            'arisanmembers' => 'required|array|between:5,10',
            'arisanmembers.*.name' => 'required|max:30',
            'arisanmembers.*.product_id' => 'required|uuid|exists:products,id',
            'arisanmembers.*.status' => 'required|boolean',
            'arisanmembers.*.meta_product' => 'nullable',
        ]);

        try {
            $request->merge([
                'sequence_code' => $this->getSequenceCode(),
                'user_id' => auth()->user()->id,
            ]);

            $arisan = Arisan::create($request->all());
            $time = strtotime(date($request->start_date));
            $index = 0;
            foreach ($request->arisanmembers as $key => $value) {

                $arisanTransaction = ArisanTransaction::create([
                    "meta_arisan" => $arisan,
                    "meta_product" => $value["meta_product"],
                    "status" => "WAIT_PAYMENT",
                    // "payment_id" => NULL,
                    "arisan_id" => $arisan->id,
                ]);

                $arisanmember = ArisanMember::create([
                    "name" => $value["name"],
                    "arisan_id" => $arisan->id,
                    "product_id" => $value["product_id"],
                    "arisan_transaction_id" => $arisanTransaction->id,
                    "status" => $value["status"],
                    "meta_product" => $value["meta_product"],
                ]);


                if ($index == 0) {
                    $date = date($request->start_date);
                } else {
                    $date = date("Y-m-d", strtotime("+1 month", $time));
                }

                $reminderArisan = ReminderArisan::create([
                    "arisan_id" => $arisan->id,
                    "reminder_date" => $date,
                ]);

                //declare new time after adding 1 month
                $time = strtotime($date);
                $index++;
            }


            return response()->json($arisan, 201);
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
            'arisans' => 'required|array',
        ]);

        try {
            foreach ($request->arisans as $key => $value) {
                $arisan = Arisan::create($value);
            }
            return response()->json($request->arisans, 201);
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
            $arisan = Arisan::findOrFail($request->id);
            return response()->json($arisan, 200);
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
            'sequence_code' => 'string|unique:arisans,sequence_code,' . $id,
            'duration' => 'digits_between:1,13',
            'start_date' => 'date',
            'end_date' => 'date',
            'total_funds' => 'digits_between:1,13',
            'average_funds' => 'digits_between:1,13',
            'status' => 'in:PROGRESS,SUCCESS,REQUEST_CANCEL,CANCELED',
            'user_id' => 'string|exists:users,id',
        ]);

        try {
            $arisan = Arisan::findOrFail($request->id);

            if ($request->status == 'CANCELED' && $arisan->status != 'CANCELED' && $arisan->funds > 0) {


                Wallet::create([
                    'user_id' => $arisan->user_id,
                    'amount' => $arisan->funds,
                    'status' => 'IN',
                    'meta' => array(
                        'description' => 'pengembalian dana dari arisan yang dibatalkan',
                        'arisan_id' => $arisan->id
                    )
                ]);

                //added saldo
                $saldoAwal = MasterSaldo::where('user_id', $arisan->user_id)->first();
                $saldoAwal->update([
                    'saldo' => $saldoAwal->saldo + $arisan->funds,
                ]);

                //insert 0 saldo
                $request->merge([
                    'funds' => 0
                ]);
            }

            //harus bikin api update status sendiri
            $arisan->update($request->all());

            return response()->json($arisan, 200);
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
            $arisan = Arisan::findOrFail($request->id);

            Arisan::destroy($id);

            return response()->json($arisan, 200);
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

        $arisan = new Arisan;

        if (is_array($whereHas)) {
            foreach ($whereHas as $item => $value) {
                $words = explode(",", $value);
                $arisan = $arisan->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }

        if ($join !== '') {
            $join = Str::lower($join);
            $words = explode(",", $join);
            $arisan = $arisan->with($words);
        }

        if ($count !== '') {
            $count = Str::lower($count);
            $words = explode(",", $count);
            $arisan = $arisan->withCount($words);
        }

        if (is_array($filter)) {
            foreach ($filter as $item => $value) {
                $words = explode(",", $value);
                if (array_key_exists(2, $words)) {
                    if ($words[2] || $words[2] == 'AND') {
                        $arisan = $arisan->orWhere($words[0], 'LIKE', '%' . $words[1] . '%');
                    } else {
                        $arisan = $arisan->where($words[0], 'LIKE', '%' . $words[1] . '%');
                    }
                } else {
                    $arisan = $arisan->where($words[0], 'LIKE', '%' . $words[1] . '%');
                }
            }
        }

        $sortItem = explode(",", $sort);
        if (strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC') {
            $arisan = $arisan->orderBy($sortItem[0], $sortItem[1]);
        }

        if ($limit != '') {
            $arisan = $arisan->limit($limit)->get();
        } else {
            if ($per_page !== 'all') {
                $arisan = $arisan->paginate($per_page);
            } else {
                $arisan = $arisan->get();
            }
        }

        return $arisan;
    }

    public function getSequenceCode()
    {
        $faceOfReferral = date("Y");

        $countCode = Arisan::where('sequence_code', 'LIKE', $faceOfReferral . '%')->count() + 1;

        if ($countCode < 10) {
            $countCode = '000' . $countCode;
        } else if ($countCode < 100) {
            $countCode = '00' . $countCode;
        } else if ($countCode < 1000) {
            $countCode = '0' . $countCode;
        } else {
            $countCode = $countCode;
        }

        return $faceOfReferral . "-" . $countCode;
    }

    public function reminder(Request $request)
    {
        $id = auth()->user()->id;

        try {
            $time = strtotime(date('Y-m-d'));
            $to = date("Y-m-d", strtotime("+7 day", $time));
            $from = date("Y-m-d", strtotime("-7 day", $time));

            $arisantransaction = Arisan::with([
                'arisantransactions' => function ($query) {
                    $query->where('status', 'WAIT_PAYMENT');
                },
                'reminders' => function ($query) use ($from, $to) {
                    $query->where('status', 'WAIT_PAYMENT')
                        ->whereBetween('reminder_date', [$from, $to])
                        ->orderBy('reminder_date', 'ASC');
                },
            ])
                ->whereHas('arisantransactions', function ($query) {
                    $query->where('status', 'WAIT_PAYMENT');
                })
                ->whereHas('reminders', function ($query) use ($from, $to) {
                    $query->where('status', 'WAIT_PAYMENT')
                        ->whereBetween('reminder_date', [$from, $to]);
                })
                ->where('status', 'PROGRESS')
                ->where('user_id', $id)
                ->whereDate('end_date', '>=', date("Y-m-d"))
                ->orderBy('created_at', 'ASC')
                ->get();

            return response()->json($arisantransaction, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }
}
