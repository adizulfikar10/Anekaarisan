<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\ArisanTransaction;
use App\Models\User;
use App\Models\ArisanMember;
use App\Models\Arisan;
use App\Models\ReminderArisan;
use App\Repositories\TransactionRepositoryInterface as Saldo;
use App\Repositories\NoticeRepositoryInterface as Notice;

class ArisanTransactionController extends Controller
{

    protected $transactionRI;
    protected $noticeRI;
    public function __construct(Saldo $saldo, Notice $notice)
    {
        $this->middleware('auth:api');
        $this->transactionRI = $saldo;
        $this->noticeRI = $notice;
    }


    public function index(Request $request)
    {
        try {
            $arisantransaction = $this->searchGenerator($request);
            return response()->json($arisantransaction, 200);
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
            'arisan_id' => 'required|exists:arisans,id',
            // 'payment_id' => 'required|exists:payments,id',
            'meta_arisan' => 'json|nullable',
            'meta_product' => 'json|nullable',
            'status' => 'in:WAIT_PAYMENT,PAID,SENDING,FINISH,PENDING,REFUND',
        ]);



        try {
            $arisantransaction = ArisanTransaction::create($request->all());
            return response()->json($arisantransaction, 201);
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
            'arisantransactions' => 'required|array',
        ]);

        try {
            foreach ($request->arisantransactions as $key => $value) {
                $arisantransaction = ArisanTransaction::create($value);
            }
            return response()->json($request->arisantransactions, 201);
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
            $arisantransaction = ArisanTransaction::findOrFail($request->id);
            return response()->json($arisantransaction, 200);
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
            'arisan_id' => 'required|exists:arisans,id',
            // 'payment_id' => 'exists:payments,id',
            'meta_arisan' => 'json|nullable',
            'meta_product' => 'json|nullable',
            'status' => 'in:WAIT_PAYMENT,PAID,SENDING,FINISH,REFUND,PENDING',
            'shipping_number' => 'required_if:status,==,SENDING|string',
            'courier' => 'required_if:status,==,SENDING|string',
        ]);

        try {
            $arisantransaction = ArisanTransaction::findOrFail($request->id);

            if ($request->status == 'PAID' && $arisantransaction->status != 'PAID') {
                $arisan = Arisan::where('id', $arisantransaction->arisan_id)->first();
                $product = $arisantransaction->meta_product;
                $productPrice = $product['base_price'];
                $averageFunds = $arisan->average_funds;
                $fundsBefore = $arisan->funds;
                $funds = ($averageFunds + $fundsBefore) - $productPrice;

                if ($funds < 0) {
                    $this->content['statusCode'] = 500;
                    $this->content['error'] = 'Saldo not enough';
                    $this->content['message'] = 'Saldo not enough';
                    return response()->json($this->content, 500);
                } else {
                    $arisan->update([
                        'funds' => $funds
                    ]);

                    //change Reminder status
                    if ($request->reminder_id) {
                        ReminderArisan::where('id', $request->reminder_id)->update([
                            'status' => $request->status
                        ]);
                    }
                }
            } else if ($request->status == 'FINISH' && $arisantransaction->status != 'FINISH') {

                $transaksiCountFinish = ArisanTransaction::where('arisan_id', $arisantransaction->arisan_id)->where('status', 'FINISH')->count();

                $referral = auth()->user()->referral_code;
                $userID = auth()->user()->id;

                $arisanMemberCount = ArisanMember::where('arisan_id', $arisantransaction->arisan_id)->count();

                if ($userID) {
                    $getCommisionProduct = $arisantransaction->meta_product['commission'];
                    $getHargaProduct = $arisantransaction->meta_product['base_price'];

                    $addedCommissionAgent = ($getCommisionProduct / 100) * $getHargaProduct;

                    $data = [
                        'user_id' => $userID,
                        'amount' => $addedCommissionAgent,
                        'status' => 'IN',
                        'meta' => array(
                            'description' => 'bonus komisi agen',
                            'arisan_transaction_id' => $arisantransaction->id,
                            'arisan_id' => $arisantransaction->arisan_id
                        )
                    ];

                    $this->transactionRI->addSaldo($userID, $data);
                }


                if ($referral && $transaksiCountFinish === 1) {
                    $parentAgent = User::where('agent_code', $referral)->first();

                    //jumlah saldo yang diberikan
                    $addedCommission = $arisanMemberCount * 5000;
                    $data = [
                        'user_id' => $parentAgent->id,
                        'amount' => $addedCommission,
                        'status' => 'IN',
                        'meta' => array(
                            'description' => 'bonus referral komisi agen',
                            'arisan_transaction_id' => $arisantransaction->id,
                            'arisan_id' => $arisantransaction->arisan_id
                        )
                    ];

                    $this->transactionRI->addSaldo($parentAgent->id, $data);
                }

                //check if transakso arisan terakhir
                if ($arisanMemberCount == $transaksiCountFinish + 1) {
                    $arisan = Arisan::where('id', $arisantransaction->arisan_id)->update(
                        ['status' => 'SUCCESS']
                    );
                }
            }



            $arisantransaction->update($request->all());

            $this->noticeRI->createNoticeArisanTransaction($arisantransaction);

            return response()->json($arisantransaction, 200);
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
            $arisantransaction = ArisanTransaction::findOrFail($request->id);

            ArisanTransaction::destroy($id);

            return response()->json($arisantransaction, 200);
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

        $arisantransaction = new ArisanTransaction;

        if (is_array($whereHas)) {
            foreach ($whereHas as $item => $value) {
                $words = explode(",", $value);
                $arisantransaction = $arisantransaction->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }

        if ($join !== '') {
            $join = Str::lower($join);
            $words = explode(",", $join);
            $arisantransaction = $arisantransaction->with($words);
        }

        if ($count !== '') {
            $count = Str::lower($count);
            $words = explode(",", $count);
            $arisantransaction = $arisantransaction->withCount($words);
        }

        if (is_array($filter)) {
            foreach ($filter as $item => $value) {
                $words = explode(",", $value);
                if (array_key_exists(2, $words)) {
                    if ($words[2] || $words[2] == 'AND') {
                        $arisantransaction = $arisantransaction->orWhere($words[0], 'LIKE', '%' . $words[1] . '%');
                    } else {
                        $arisantransaction = $arisantransaction->where($words[0], 'LIKE', '%' . $words[1] . '%');
                    }
                } else {
                    $arisantransaction = $arisantransaction->where($words[0], 'LIKE', '%' . $words[1] . '%');
                }
            }
        }

        $sortItem = explode(",", $sort);
        if (strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC') {
            $arisantransaction = $arisantransaction->orderBy($sortItem[0], $sortItem[1]);
        }

        if ($limit != '') {
            $arisantransaction = $arisantransaction->limit($limit)->get();
        } else {
            if ($per_page !== 'all') {
                $arisantransaction = $arisantransaction->paginate($per_page);
            } else {
                $arisantransaction = $arisantransaction->get();
            }
        }

        return $arisantransaction;
    }
}
