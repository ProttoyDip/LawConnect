<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\CrimeReport;

class CrimeReportUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'category'    => ['sometimes', 'string', 'in:' . implode(',', CrimeReport::CATEGORIES)],
            'location'    => ['nullable', 'string', 'max:255'],
            'occurred_at' => ['nullable', 'date', 'before_or_equal:now'],
            'priority'    => ['nullable', 'string', 'in:' . implode(',', CrimeReport::PRIORITIES)],
        ];
    }
}
