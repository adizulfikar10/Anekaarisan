<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\TransactionRepositoryInterface as Saldo;
use App\Repositories\NoticeRepositoryInterface as Notice;
use App\Models\Payment;
use App\Models\Arisan;
use App\Models\ArisanTransaction;
use App\Models\ReminderArisan;

class MidtransController extends Controller
{
    protected $transactionRI;
    protected $paymentWays;
    protected $noticeRI;

    public function __construct(Saldo $saldo, Notice $notice)
    {
        $this->middleware('auth:api', ['except' => ['midtransCallback']]);
        $this->transactionRI = $saldo;
        $this->noticeRI = $notice;
        $this->paymentWays = env('MIDTRANS_PAYMENTS');
    }

    public function snapToken(Request $request)
    {
        $validatedData = $request->validate([
            'arisan_transaction_id' => 'required|uuid|exists:arisan_transactions,id',
            'midtrans_detail' => 'required',
        ]);

        try {
            $date = strtotime(date('Y-m-d'));
            $orderId = 'ANEKA' . $date . $this->generateRandomString();

            $arisanTransaction = ArisanTransaction::where('id', $request->arisan_transaction_id)->first();
            $arisanTransaction->update([
                'order_id' => $orderId
            ]);

            $detailMidtrans = $request->midtrans_detail;

            $detailMidtrans['transaction_details']['order_id'] = $orderId;

            $paymentWays = explode(",", $this->paymentWays);
            $detailMidtrans['enabled_payments'] = $paymentWays;

            $tokenID =  $this->transactionRI->checkout($detailMidtrans);
            return response()->json(array(
                'order_id' => $orderId,
                'token' => $tokenID,
                "redirect_url" => "https://app.sandbox.midtrans.com/snap/v2/vtweb/" . $tokenID
            ), 200);
        } catch (\Throwable $th) {
            $baseErrorCode = $this->get_string_between($th->getMessage(), '(', ')');
            $baseErrorMessage = $this->get_string_between($th->getMessage(), '[', ']');
            $this->content['statusCode'] = (int)$baseErrorCode;
            $this->content['message'] = $baseErrorMessage;
            return response()->json($this->content, $baseErrorCode);
        }
    }

    function checkStatusMidtrans($order_id)
    {
        try {
            //masih error
            $status = $this->transactionRI->status($order_id);

            return response()->json($status, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = '500';
            $this->content['message'] = 'Internal server Error';
            return response()->json($this->content, 500);
        }
    }

    function get_string_between($string, $start, $end)
    {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

    function generateRandomString($length = 3)
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function midtransCallback(Request $request)
    {
        try {
            $arisanTransaction = ArisanTransaction::where('order_id', $request->order_id)->with('payments')->first();
            $request->merge([
                'meta' => $request->all(),
                'arisan_transaction_id' => $arisanTransaction->id
            ]);

            $checkPayments = Payment::where([
                ['order_id', $request->order_id],
                ['arisan_transaction_id', $arisanTransaction->id],
                ['fraud_status', $request->fraud_status],
                ['transaction_status', $request->transaction_status],
                ['transaction_id', $request->transaction_id],
            ])->get();

            if (count($checkPayments) <= 0) {
                Payment::create($request->all());
            }

            $notif = new \Midtrans\Notification();

            $transaction = $notif->transaction_status;
            $type = $notif->payment_type;
            $order_id = $notif->order_id;
            $fraud = $notif->fraud_status;


            if ($transaction == 'capture') {
                // For credit card transaction, we need to check whether transaction is challenge by FDS or not
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        // TODO set payment status in merchant's database to 'Challenge by FDS'
                        // TODO merchant should decide whether this transaction is authorized or not in MAP
                        // echo "Transaction order_id: " . $order_id . " is challenged by FDS";
                    } else {
                        // TODO set payment status in merchant's database to 'Success'
                        // echo "Transaction order_id: " . $order_id . " successfully captured using " . $type;
                    }
                }
            } else if ($transaction == 'settlement') {
                $arisan = Arisan::where('id', $arisanTransaction->arisan_id)->first();
                $product = $arisanTransaction->meta_product;
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
                }

                $reminders = ReminderArisan::where('arisan_id', $arisanTransaction->arisan_id)->where('status', 'WAIT_PAYMENT')->orderBy('reminder_date', 'ASC')->get();
                var_dump($reminders);
                

                if(count($reminders) > 0){
                    $reminder = ReminderArisan::where('id', $reminders[0]->id)->update([
                        'status' => 'PAID'
                    ]);
                }

                $arisanTransaction->update([
                    'status' => 'PAID'
                ]);
            } else if ($transaction == 'pending') {
                // TODO set payment status in merchant's database to 'Pending'
                $checkDoublePayment = Payment::where([
                    ['arisan_transaction_id', $arisanTransaction->id],
                ])->whereNotIn('order_id', [$order_id])->orderBy('created_at', 'DESC')->get();

                if (count($checkDoublePayment) > 0 && $checkDoublePayment[0]['transaction_status'] === 'pending') {
                    //canceling order before
                    $cancel = \Midtrans\Transaction::cancel($checkDoublePayment[0]['order_id']);
                }

                  $arisanTransaction->update([
                    'status' => 'PENDING'
                   ]);
                

                // echo "Waiting customer to finish transaction order_id: " . $order_id . " using " . $type;
            } else if ($transaction == 'deny') {
                // TODO set payment status in merchant's database to 'Denied'
                // echo "Payment using " . $type . " for transaction order_id: " . $order_id . " is denied.";
            } else if ($transaction == 'expire') {
                // TODO set payment status in merchant's database to 'expire'
                // echo "Payment using " . $type . " for transaction order_id: " . $order_id . " is expired.";
            } else if ($transaction == 'cancel') {
                // TODO set payment status in merchant's database to 'Denied'
                // echo "Payment using " . $type . " for transaction order_id: " . $order_id . " is canceled.";
            }

            $this->noticeRI->createNoticeMidtrans($request->all());

            return response()->json($transaction, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = '500';
            $this->content['message'] = 'Internal server Error';
            return response()->json($this->content, 500);
        }
    }
}
