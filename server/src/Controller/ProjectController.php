<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\User;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use App\Service\DieFormater;
use App\Service\ValidateField as ServiceValidateField;
use App\Service\VerifyAuthentication;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ProjectController extends AbstractController
{
    #[Route('/api/project/all', name: 'app_project_all', methods: ['GET'])]
    public function getAllProject(
        Request $request,
        ProjectRepository $projectRepository,
        VerifyAuthentication $verifyAuthentification,
        DieFormater $projectFormater
    ): JsonResponse
    {
        $user = $verifyAuthentification->verify($request);
        if (!$user instanceof User) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        $projects = $projectRepository->findBy(['owner' => $user]);

        $data = $projectFormater->formatProjects($projects);
        return new JsonResponse($data, 200);
    }

    #[Route('/api/project/add', name: 'app_project_add', methods: ['POST'])]
    public function addProject(
        Request $request,
        ObjectManager $objectManager,
        ServiceValidateField $validateField,
        UserRepository $userRepository,
        VerifyAuthentication $verifyAuthentication
    ): JsonResponse
    {
        $user = $verifyAuthentication->verify($request);
        if(!$user instanceof User) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (
            !$validateField->isFieldValid($data, 'title') || 
            !$validateField->isFieldValid($data, 'description') || 
            !$validateField->isFieldValid($data, 'status') ||
            !$validateField->isFieldValid($data, 'deadline')
        ) {
            return new JsonResponse(['errorMessage' => 'title, description, deadline and status are required'], 400);
        }

        $deadline = new \DateTime(($data['deadline']));

        $project = new Project();
        $project->setTitle($data['title'])
            ->setDescription($data['description'])
            ->setDeadline($deadline)
            ->setStatus($data['status'])
            ->setOwner($user);

        $participants = $userRepository->findAll();
        foreach ($participants as $participant) {
            if ($participant == $user) continue;
            $project->addParticipant($participant);
        }

        $objectManager->persist($project);
        $objectManager->flush();
        
        return new JsonResponse("Success");
    }
}
