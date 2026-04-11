<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignPoliceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'crime_report_id' => ['required', 'exists:crime_reports,id'],
            'officer_id' => ['required', 'exists:users,id', Rule::exists('users')->where('role_id', 2)], // assuming role_id 2 = police
            'notes' => 'nullable|string|max:1000',
        ];
    }
}

