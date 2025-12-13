<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'issue_id',
        'file_path',
        'original_name',
        'file_size',
    ];

    public function issue()
    {
        return $this->belongsTo(Issue::class);
    }
}
