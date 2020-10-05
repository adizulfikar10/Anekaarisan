<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class BackendServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            'App\Repositories\TransactionRepositoryInterface',
            'App\Repositories\TransactionRepository',
            'App\Repositories\NoticeRepositoryInterface',
            'App\Repositories\NoticeRepository'
        );

        $this->app->bind(
            'App\Repositories\NoticeRepositoryInterface',
            'App\Repositories\NoticeRepository'
        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
