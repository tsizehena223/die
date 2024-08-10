<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Task;
use App\Entity\User;
use App\Repository\ProjectRepository;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use App\Service\DieFormater;
use App\Service\ValidateField;
use App\Service\VerifyAuthentication;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TaskController extends AbstractController
{
    #[Route('/api/{projectId}/tasks/', name: 'get_tasks_of_project', methods: ['GET'], requirements: ['projectId' => '\d+'])]
    public function getTasksFromProject(
        Request $request,
        ProjectRepository $projectRepository,
        VerifyAuthentication $verifyAuthentication,
        TaskRepository $taskRepository,
        DieFormater $taskFormater,
        $projectId
    ): JsonResponse
    {
        if (!$verifyAuthentication->verify($request) instanceof User) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        if (!(int)$projectId) {
            return new JsonResponse(['errorMessage' => 'Project Id invalid'], 400);
        }

        $project = $projectRepository->find((int)$projectId);
        if (!$project) {
            return new JsonResponse(['errorMessage' => 'Project not found'], 404);
        }

        $tasks = $taskRepository->findBy(['project' => $project]);

        $data = $taskFormater->formatTasks($tasks);

        return new JsonResponse($data);
    }

    #[Route('/api/task/update/status', name: 'update_status_task', methods: ['POST'])]
    public function updateTaskStatus(
        TaskRepository $taskRepository,
        Request $request,
        VerifyAuthentication $verifyAuthentication,
        ObjectManager $objectManager
    ): JsonResponse
    {
        if (!$verifyAuthentication->verify($request)) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        $data = json_decode($request->getContent(), true);

        $taskId = $data['taskId'];
        $newStatus = $data['newStatus'];
        if (!$newStatus || !$taskId) {
            return new JsonResponse(['errorMessage' => 'No status or id found'], 400);
        }

        $task = $taskRepository->find($taskId);
        if (!$task instanceof Task) {
            return new JsonResponse(['errorMessage' => 'No task found'], 400);
        }
        
        $task->setStatus($newStatus);
        $objectManager->persist($task);
        $objectManager->flush();

        return new JsonResponse(['successMessage' => 'Updated successfully']);
    }

    #[Route('/api/task/add', name: 'add_task', methods: ['POST'])]
    public function addTask(
        Request $request,
        VerifyAuthentication $verifyAuthentication,
        ValidateField $validateField,
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        ObjectManager $objectManager
    ): JsonResponse
    {
        $user = $verifyAuthentication->verify($request);
        if (!$user || !$user instanceof User) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (
            !$validateField->isFieldValid($data, 'title') || 
            !$validateField->isFieldValid($data, 'assignTo') || 
            !$validateField->isFieldValid($data, 'project') ||
            !$validateField->isFieldValid($data, 'deadline') ||
            !$validateField->isFieldValid($data, 'status')
        ) {
            return new JsonResponse(['errorMessage' => 'title, assignTo, deadline, status and project are required'], 400);
        }

        $deadline = new \DateTime(($data['deadline']));
        $assignedTo = $userRepository->find($data['assignTo']);
        if (!$assignedTo instanceof User) {
            return new JsonResponse(['errorMessage' => 'Invalid user to assign'], 400);
        }
        $formProject = $projectRepository->find($data['project']);
        if (!$formProject instanceof Project) {
            return new JsonResponse(['errorMessage' => 'Invalid project'], 400);
        }

        $task = new Task();
        $task->setTitle($data['title'])
            ->setAssignedTo($assignedTo)
            ->setDeadline($deadline)
            ->setStatus($data['status'])
            ->setProject($formProject);

        $objectManager->persist($task);
        $objectManager->flush();
        
        return new JsonResponse("Success");
    }
}
