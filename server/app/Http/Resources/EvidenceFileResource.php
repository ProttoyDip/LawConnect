<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EvidenceFileResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'crimeReportId' => $this->crime_report_id,
			'filePath' => $this->file_path,
			'fileType' => $this->file_type,
			'originalName' => $this->original_name,
			'fileSize' => $this->file_size,
			'uploadedBy' => $this->uploaded_by,
			'createdAt' => $this->created_at?->toIso8601String(),
			'updatedAt' => $this->updated_at?->toIso8601String(),
		];
	}
}
