<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'email'    => 'required|email',
            'password' => 'required|min:6',
            'role_type' => 'nullable|in:general,investigator,admin',
            'admin_id'  => 'nullable|string|required_if:role_type,admin',
            'security_code' => 'nullable|string|required_if:role_type,admin',
            'badge_number'  => 'nullable|string|required_if:role_type,investigator',
            'police_station' => 'nullable|string|required_if:role_type,investigator',
            'national_id'   => 'nullable|string',
        ];
    }

    public function messages(): array {
        return [
            'email.required' => 'Email is required',
            'password.required' => 'Password is required',
        ];
    }
}
