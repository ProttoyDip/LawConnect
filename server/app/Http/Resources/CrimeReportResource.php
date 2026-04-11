<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CrimeReportResource extends JsonResource
{
	public function toArray($request)
	{
		$latestAssignment = null;
		if ($this->relationLoaded('policeAssignments')) {
			$latestAssignment = $this->policeAssignments
				->sortByDesc('assigned_at')
				->first();
		}

		return [
			'id' => $this->id,
			'case_id' => $this->case_id,
			'caseId' => $this->case_id,
			'title' => $this->title,
			'description' => $this->description,
			'category' => $this->category,
			'location' => $this->location,
			'occurred_at' => $this->occurred_at?->toIso8601String(),
			'occurredAt' => $this->occurred_at?->toIso8601String(),
			'status' => $this->status,
			'priority' => $this->priority,
			'user_id' => $this->user_id,
			'userId' => $this->user_id,
			'created_at' => $this->created_at?->toIso8601String(),
			'createdAt' => $this->created_at?->toIso8601String(),
			'updated_at' => $this->updated_at?->toIso8601String(),
			'updatedAt' => $this->updated_at?->toIso8601String(),
			'status_updates' => StatusUpdateResource::collection($this->whenLoaded('statusUpdates')),
			'statusUpdates' => StatusUpdateResource::collection($this->whenLoaded('statusUpdates')),
			'police_assignment' => $latestAssignment ? [
				'id' => $latestAssignment->id,
				'officer_id' => $latestAssignment->officer_id,
				'assigned_at' => optional($latestAssignment->assigned_at)?->toIso8601String(),
			] : null,
			'assigned_to' => $latestAssignment && $latestAssignment->relationLoaded('officer') && $latestAssignment->officer ? [
				'id' => $latestAssignment->officer->id,
				'name' => $latestAssignment->officer->name,
				'email' => $latestAssignment->officer->email,
			] : null,
			'assignedTo' => $latestAssignment && $latestAssignment->relationLoaded('officer') && $latestAssignment->officer ? [
				'id' => $latestAssignment->officer->id,
				'name' => $latestAssignment->officer->name,
				'email' => $latestAssignment->officer->email,
			] : null,
		];
	}
}
