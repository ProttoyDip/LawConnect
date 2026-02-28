<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'crime_report_id' => ['required', 'integer', 'exists:crime_reports,id'],
            'officer_id'      => ['required', 'integer', 'exists:users,id'],
            'notes'           => ['nullable', 'string', 'max:1000'],
        ];
    }
}
