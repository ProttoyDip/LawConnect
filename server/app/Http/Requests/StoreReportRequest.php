<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest {
    public function authorize(): bool { return true; }
    
    public function rules(): array {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category'    => 'required|in:theft,assault,fraud,vandalism,cyber,other',
            'location'    => 'nullable|string|max:255',
            'occurred_at' => 'nullable|date|before_or_equal:now',
            'priority'    => 'nullable|in:low,medium,high,critical',
        ];
    }
}

