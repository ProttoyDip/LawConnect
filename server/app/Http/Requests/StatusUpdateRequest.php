<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\CrimeReport;

class StatusUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:' . implode(',', CrimeReport::STATUSES)],
            'remark' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
