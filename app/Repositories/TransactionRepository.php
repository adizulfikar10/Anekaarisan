<?php

namespace App\Repositories;

use App\Models\Wallet;
use App\Models\MasterSaldo;

\Midtrans\Config::$serverKey =  env('MIDTRANS_KEY');
\Midtrans\Config::$isProduction = filter_var(env('MIDTRANS_IS_PRODUCTION'), FILTER_VALIDATE_BOOLEAN);
\Midtrans\Config::$isSanitized = filter_var(env('MIDTRANS_IS_SANITIZED'), FILTER_VALIDATE_BOOLEAN);
\Midtrans\Config::$is3ds = filter_var(env('MIDTRANS_IS_3DS'), FILTER_VALIDATE_BOOLEAN);

class TransactionRepository implements TransactionRepositoryInterface
{
    public function addSaldo($ID, $DATA)
    {
        Wallet::create($DATA);

        $saldoAwal = MasterSaldo::where('user_id', $ID)->first();

        $saldoAwal->update([
            'saldo' => $saldoAwal->saldo + $DATA['amount'],
        ]);
    }

    public function reduceSaldo($ID, $DATA)
    {
        $saldoAwal = MasterSaldo::where('user_id', $ID)->first();
        if ($saldoAwal->saldo >=  $DATA['amount']) {
            Wallet::create($DATA);

            $saldoAwal->update([
                'saldo' => $saldoAwal->saldo - $DATA['amount'],
            ]);
        }
    }

    public function mySaldo($ID)
    {
        $saldo = MasterSaldo::where('user_id', $ID)->first();

        return $saldo->saldo;
    }

    public function checkout($DATA)
    {
        $snapToken = \Midtrans\Snap::getSnapToken($DATA);

        return $snapToken;
    }

    public function status($ORDER_ID)
    {
        $status = \Midtrans\Transaction::status($ORDER_ID);
        return $status;
    }
}
