<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Task;
use App\Entity\User;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use App\Service\ValidateField;
use App\Service\VerifyAuthentication;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TaskController extends AbstractController
{
    #[Route('/api/tasks/', name: 'get_tasks_of_project', methods: ['GET'])]
    public function getTasksFromProject(
        Request $request,
        ProjectRepository $projectRepository,
        VerifyAuthentication $verifyAuthentication,
    ): JsonResponse
    {
        if (!$verifyAuthentication->verify($request) instanceof User) {
            return new JsonResponse('User not connected', 401);
        }

        $projectId = $request->query->get('project');
        if (!(int)$projectId) {
            return new JsonResponse('Project not found', 400);
        }

        $project = $projectRepository->find((int)$projectId);
        if (!$project) {
            return new JsonResponse('Project not found', 400);
        }

        return new JsonResponse($project);
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
            return new JsonResponse('User not connected', 401);
        }

        $data = json_decode($request->getContent(), true);
        if (
            !$validateField->isFieldValid($data, 'title') || 
            !$validateField->isFieldValid($data, 'assignedTo') || 
            !$validateField->isFieldValid($data, 'project') ||
            !$validateField->isFieldValid($data, 'deadline')
        ) {
            return new JsonResponse(['errorMessage' => 'title, assignedTo, deadline and project are required'], 400);
        }

        $deadline = new \DateTime(($data['deadline']));
        $assignedTo = $userRepository->find($data['assignedTo']);
        if (!$assignedTo instanceof User) {
            return new JsonResponse('The user to assign the task isn\'t an user', 400);
        }
        $formProject = $projectRepository->find($data['project']);
        if (!$formProject instanceof Project) {
            return new JsonResponse('The project isn\'t a project', 400);
        }

        $task = new Task();
        $task->setTitle($data['title'])
            ->setAssignedTo($assignedTo)
            ->setDeadline($deadline)
            ->setProject($formProject);

        $objectManager->persist($task);
        $objectManager->flush();
        
        return new JsonResponse("Success");
    }
}
