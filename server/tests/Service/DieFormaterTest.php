<?php

namespace App\tests\Service;

use App\Entity\Project;
use App\Service\DieFormater;
use DateTime;
use PHPUnit\Framework\TestCase;

class DieFormaterTest extends TestCase
{
  public function testFormatOneProject()
  {
    $die = new DieFormater();
    $project = new Project();
    $project->setTitle("Title")
      ->setDescription("Description")
      ->setDeadline(new DateTime())
      ->setStatus("done");

    $expectedResult = [
      'id' => null,
      'title' => 'Title',
      'status' => 'done',
      'description' => 'Description',
      'deadline' => '2024-08-28'
    ];

    $result = $die->formatOneProject($project);

    $this->assertEquals($expectedResult, $result);
  }
}