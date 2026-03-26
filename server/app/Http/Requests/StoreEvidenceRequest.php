<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvidenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'crime_report_id' => 'required|exists:crime_reports,id',
            'files' => ['required', 'array', 'max:5'],
            'files.*' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi'], // 10MB max
        ];
    }
}

