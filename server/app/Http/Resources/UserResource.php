<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'national_id' => $this->national_id,
            'role' => $this->role->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'created_at' => $this->created_at,
        ];
    }
}

