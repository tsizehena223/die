<?php

namespace App\Service;

use App\Entity\Project;
use App\Entity\Task;

class DieFormater
{
  public function formatOneProject(Project $project): Array
  {
    $data = [
      'id' => $project->getId(),
      'title' => $project->getTitle(),
      'status' => $project->getStatus(),
      'description' => $project->getDescription(),
      'deadline' => $project->getDeadline()->format('Y-m-d')
    ];
    
    return $data;
  }

  public function formatProjects($projects): Array
  {
    $data = [];
    foreach ($projects as $project) {
        $data[] = [
            'id' => $project->getId(),
            'title' => $project->getTitle(),
            'description' => $project->getDescription(),
            'status' => $project->getStatus(),
            'deadline' => $project->getDeadline()->format('Y-m-d'),
        ];
    }

    return $data;
  }

  public function formatOneTask(Task $task): Array
  {
    $data = [
      'id' => $task->getId(),
      'title' => $task->getTitle(),
      'status' => $task->getStatus(),
      'assignedTo' => $task->getAssignedTo()->getUsername(),
      'deadline' => $task->getDeadline()->format('Y-m-d'),
      'project' => $task->getProject()->getTitle()
    ];
    
    return $data;
  }

  public function formatTasks($tasks): Array
  {
    $data = [];
    foreach ($tasks as $task) {
      $data[] = [
        'id' => $task->getId(),
        'title' => $task->getTitle(),
        'status' => $task->getStatus(),
        'assignedTo' => $task->getAssignedTo()->getUsername(),
        'deadline' => $task->getDeadline()->format('Y-m-d'),
        'project' => $task->getProject()->getTitle()
      ];
    }
    
    return $data;
  }
}