<?php

namespace App\Service;

use App\Entity\Project;

class ProjectFormater
{
  public function formatOne(Project $project): Array
  {
    $data = [
      'title' => $project->getTitle(),
      'status' => $project->getStatus(),
      'description' => $project->getDescription(),
      'deadline' => $project->getDeadline()->format('Y-m-d'),
    ];
    
    return $data;
  }

  public function formatAll($projects): Array
  {
    $data = [];
    foreach ($projects as $project) {
        $data[] = [
            'title' => $project->getTitle(),
            'description' => $project->getDescription(),
            'status' => $project->getStatus(),
            'deadline' => $project->getDeadline()->format('Y-m-d'),
        ];
    }

    return $data;
  }
}