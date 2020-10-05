<?php

namespace App\Repositories;

interface TransactionRepositoryInterface
{
    public function addSaldo($ID, $DATA);
    public function reduceSaldo($ID, $DATA);
    public function mySaldo($ID);
    public function checkout($DATA);
    public function status($ORDER_ID);
}
