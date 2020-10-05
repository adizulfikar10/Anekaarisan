<?php

namespace App\Repositories;

use App\Models\Notice;
use App\Models\ArisanTransaction;

class NoticeRepository implements NoticeRepositoryInterface
{
    public function createNoticeMidtrans($DATA)
    {
        $ArisanTransaction = ArisanTransaction::where('order_id', $DATA['order_id'])->first();
        $message = '';
        $user_id = $ArisanTransaction->meta_arisan['user_id'];
        $title = 'STATUS BARANG';

        if ($DATA['transaction_status'] === 'pending') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' sedang menunggu pembayaran';
        } else if ($DATA['transaction_status'] === 'settlement') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' sudah terbayar';
        } else if ($DATA['transaction_status'] === 'deny') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' ditolak';
        } else if ($DATA['transaction_status'] === 'cancel') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' dibatalkan';
        } else if ($DATA['transaction_status'] === 'deny') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' ditolak';
        } else if ($DATA['transaction_status'] === 'expired') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' kadaluarsa';
        } else if ($DATA['transaction_status'] === 'capture') {
            $message = 'Pesanan anda dengan order id ' . $DATA['order_id'] . ' menggunakan CC menunggu validasi';
        }

        $notice = Notice::create([
            'title' => $title,
            'message' => $message,
            'user_id' => $user_id
        ]);

        return $notice;
    }

    public function createNoticeArisanTransaction($DATA)
    {
        $message = '';
        $user_id = $DATA->meta_arisan['user_id'];
        $produk_name = $DATA->meta_product['name'];
        $title = 'STATUS PEMBAYARAN';

        if ($DATA['status'] === 'WAIT_PAYMENT') {
            $message = 'Transaksi anda dengan barang ' . $produk_name . ' sedang menunggu pembayaran';
        } else if ($DATA['status'] === 'PAID') {
            $message = 'Transaksi anda dengan barang ' . $produk_name . ' sudah terbayar';
        } else if ($DATA['status'] === 'SENDING') {
            $message = 'Transaksi anda dengan barang ' . $produk_name . ' sudah dikirim';
        } else if ($DATA['status'] === 'FINISH') {
            $message = 'Transaksi anda dengan barang ' . $produk_name . ' telah selesai';
        } else if ($DATA['status'] === 'REFUND') {
            $message = 'Transaksi anda dengan barang ' . $produk_name . ' telah dikembalikan';
        } else if ($DATA['status'] === 'PENDING') {
            $message = 'Transaksi anda dengan barang ' . $produk_name . ' menunggu persetujuan';
        }

        $notice = Notice::create([
            'title' => $title,
            'message' => $message,
            'user_id' => $user_id
        ]);

        return $notice;
    }
}
