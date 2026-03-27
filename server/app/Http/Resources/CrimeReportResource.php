<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CrimeReportResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'caseId' => $this->case_id,
			'title' => $this->title,
			'description' => $this->description,
			'category' => $this->category,
			'location' => $this->location,
			'occurredAt' => $this->occurred_at?->toIso8601String(),
			'status' => $this->status,
			'priority' => $this->priority,
			'userId' => $this->user_id,
			'createdAt' => $this->created_at?->toIso8601String(),
			'updatedAt' => $this->updated_at?->toIso8601String(),
		];
	}
}
