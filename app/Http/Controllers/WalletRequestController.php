<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\WalletRequest;
use App\Models\Wallet;
use App\Models\MasterSaldo;
use App\Repositories\TransactionRepositoryInterface as Saldo;

class WalletRequestController extends Controller
{

    protected $transactionRI;

    public function __construct(Saldo $saldo)
    {
        $this->middleware('auth:api');
        $this->transactionRI = $saldo;
    }

    public function index(Request $request)
    {
        try {
            $walletrequest = $this->searchGenerator($request);
            return response()->json($walletrequest, 200);
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
            'amount' => 'required|digits_between:1,13',
            // 'status' => 'required|in:WAITING,APPROVED,REJECTED',
            'status' => 'required|in:WAITING,APPROVED',
            'category' => 'required|in:COMMISSION,WITHDRAWAL',
            'bank_account' => 'required_if:category,==,WITHDRAWAL',
            'meta_transaction' => 'required_if:category,==,COMMISSION|json',
        ]);

        try {
            // $request->merge(['meta_transaction' => json_encode($request->meta_transaction)]);
            $walletrequest = WalletRequest::create($request->all());
            return response()->json($walletrequest, 201);
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
            'walletrequests' => 'required|array',
        ]);

        try {
            foreach ($request->walletrequests as $key => $value) {
                $walletrequest = WalletRequest::create($value);
            }
            return response()->json($request->walletrequests, 201);
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
            $walletrequest = WalletRequest::findOrFail($request->id);
            return response()->json($walletrequest, 200);
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
            'user_id' => 'exists:users,id',
            'amount' => 'digits_between:1,13',
            'status' => 'in:WAITING,APPROVED,REJECTED',
            'category' => 'in:COMMISSION,WITHDRAWAL',
        ]);

        try {
            $walletrequest = WalletRequest::findOrFail($request->id);
            $saldo = MasterSaldo::where('user_id', $walletrequest->user_id)->first();

            //CHECK DATA IF REQUEST HAS BEEN APPROVED
            if ($walletrequest->status === 'APPROVED') {
                $this->content['error'] = 'cannot change data';
                $this->content['message'] = 'data has been approved';

                return response()->json($this->content, 400);
            }

            //CHECK SALDO BIGGER THAN AMOUNT
            if ($saldo->saldo < $walletrequest->amount && $request->status === 'APPROVED') {
                $this->content['error'] = 'saldo tidak cukup';
                $this->content['message'] = 'saldo tidak cukup';

                return response()->json($this->content, 400);
            }

            $walletrequest->update($request->all());

            if ($request->status === 'APPROVED' && $walletrequest->category === 'WITHDRAWAL') {
                $data = [
                    'user_id' => $walletrequest->user_id,
                    'amount' => $walletrequest->amount,
                    'status' => 'OUT',
                    'meta' => array(
                        'description' => 'pencairan dana',
                        'arisan_transaction_id' => null,
                        'arisan_id' => null
                    )
                ];

                $this->transactionRI->reduceSaldo($walletrequest->user_id, $data);
            }

            if ($request->status === 'APPROVED' && $walletrequest->category === 'COMMISSION') {
                $data = [
                    'user_id' => $walletrequest->user_id,
                    'amount' => $walletrequest->amount,
                    'status' => 'IN',
                    'meta' => array(
                        'description' => 'pemberian komisi',
                        'arisan_transaction_id' => null,
                        'arisan_id' => null
                    )
                ];
                $this->transactionRI->addSaldo($walletrequest->user_id, $data);
            }

            return response()->json($walletrequest, 200);
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
            $walletrequest = WalletRequest::findOrFail($request->id);

            WalletRequest::destroy($id);

            return response()->json($walletrequest, 200);
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

        $walletrequest = new WalletRequest;

        if (is_array($whereHas)) {
            foreach ($whereHas as $item => $value) {
                $words = explode(",", $value);
                $walletrequest = $walletrequest->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }

        if ($join !== '') {
            $join = Str::lower($join);
            $words = explode(",", $join);
            $walletrequest = $walletrequest->with($words);
        }

        if ($count !== '') {
            $count = Str::lower($count);
            $words = explode(",", $count);
            $walletrequest = $walletrequest->withCount($words);
        }

        if (is_array($filter)) {
            foreach ($filter as $item => $value) {
                $words = explode(",", $value);
                if (array_key_exists(2, $words)) {
                    if ($words[2] || $words[2] == 'AND') {
                        $walletrequest = $walletrequest->orWhere($words[0], 'LIKE', '%' . $words[1] . '%');
                    } else {
                        $walletrequest = $walletrequest->where($words[0], 'LIKE', '%' . $words[1] . '%');
                    }
                } else {
                    $walletrequest = $walletrequest->where($words[0], 'LIKE', '%' . $words[1] . '%');
                }
            }
        }

        $sortItem = explode(",", $sort);
        if (strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC') {
            $walletrequest = $walletrequest->orderBy($sortItem[0], $sortItem[1]);
        }

        if ($limit != '') {
            $walletrequest = $walletrequest->limit($limit)->get();
        } else {
            if ($per_page !== 'all') {
                $walletrequest = $walletrequest->paginate($per_page);
            } else {
                $walletrequest = $walletrequest->get();
            }
        }

        return $walletrequest;
    }
}
