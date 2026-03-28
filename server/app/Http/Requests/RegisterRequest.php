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
            'badge_number' => 'required_if:role,police|nullable|string|max:50|unique:users,badge_number',
            'police_station' => 'required_if:role,police|nullable|string|max:255',
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
            'badge_number.required_if' => 'Badge number is required for police',
            'badge_number.unique' => 'This badge number is already registered',
            'police_station.required_if' => 'Police station is required for police',
            'password.confirmed' => 'Passwords do not match',
        ];
    }

}
