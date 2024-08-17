<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\MessageBuffer;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // use the same message buffer throughout the app.
        // and everywhere on the app, the same buffer is shared
        $this->app->singleton(MessageBuffer::class, function () {
            return new MessageBuffer();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
