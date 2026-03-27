<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:users,email',
            'national_id' => 'required_if:role,citizen|nullable|string|max:20|unique:users,national_id',
            'password' => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
            'role'    => 'nullable|in:citizen,police,admin',
            'phone'   => 'nullable|string',
            'address' => 'nullable|string',
        ];
    }

    public function messages(): array {
        return [
            'email.unique' => 'This email already exists',
            'national_id.unique' => 'This National ID is already registered',
            'national_id.required_if' => 'National ID is required for citizens',
            'password.confirmed' => 'Passwords do not match',
        ];
    }

}
