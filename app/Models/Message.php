<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';
    protected $primaryKey = 'id';

    protected $guarded = [];
    // Not using below line because weird bug with laravel:
    // https://github.com/spatie/laravel-permission/issues/1569
    // protected $guarded = ['id'];
}
