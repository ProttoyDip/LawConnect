<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvestigationNoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'note' => $this->note,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->toISOString(),
            'is_owner' => $this->user_id === $request->user()->id,
        ];
    }
}

