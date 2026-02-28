<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\CrimeReport;

class CrimeReportStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // auth is handled by middleware
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category'    => ['required', 'string', 'in:' . implode(',', CrimeReport::CATEGORIES)],
            'location'    => ['nullable', 'string', 'max:255'],
            'occurred_at' => ['nullable', 'date', 'before_or_equal:now'],
            'priority'    => ['nullable', 'string', 'in:' . implode(',', CrimeReport::PRIORITIES)],
            'evidence'    => ['nullable', 'array', 'max:5'],
            'evidence.*'  => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi'],
        ];
    }
}
