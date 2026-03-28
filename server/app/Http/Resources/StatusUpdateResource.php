<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StatusUpdateResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'crime_report_id' => $this->crime_report_id,
			'crimeReportId' => $this->crime_report_id,
			'status' => $this->status,
			'remarks' => $this->remark,
			'notes' => $this->remark,
			'created_by' => $this->created_by,
			'createdBy' => $this->created_by,
			'created_at' => $this->created_at?->toIso8601String(),
			'createdAt' => $this->created_at?->toIso8601String(),
		];
	}
}
