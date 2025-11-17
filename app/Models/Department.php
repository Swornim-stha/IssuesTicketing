<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'head_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function issues()
    {
        return $this->hasMany(Issue::class);
    }

    public function head()
    {
        return $this->belongsTo(User::class, 'head_id');
    }
}
