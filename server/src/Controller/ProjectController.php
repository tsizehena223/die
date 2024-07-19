<?php

namespace App\Controller;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use App\Service\DecodeJwt;
use App\Service\ProjectFormater;
use App\Service\ValidateField as ServiceValidateField;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ProjectController extends AbstractController
{
    #[Route('/api/project/all', name: 'app_project_all', methods: ['GET'])]
    public function getAllProject(
        ProjectRepository $projectRepository,
        Request $request,
        DecodeJwt $decodeJwt,
        UserRepository $userRepository,
        ProjectFormater $projectFormater
    ): JsonResponse
    {
        $token = $request->headers->get('X-Authorization');
        $userId = $decodeJwt->getIdToken($token);
        if (!$userId) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }
        $user = $userRepository->find($userId);
        if(!$user) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        $projects = $projectRepository->findBy(['owner' => $user]);

        $data = $projectFormater->formatAll($projects);
        return new JsonResponse($data, 200);
    }

    #[Route('api/project/{id}', name: 'app_project_one', methods: ['GET'])]
    public function getOneProject(
        Request $request,
        ProjectRepository $projectRepository,
        UserRepository $userRepository,
        ProjectFormater $projectFormater,
        DecodeJwt $decodeJwt,
        $id
    ): JsonResponse
    {
        if (!(int)$id) {
            return new JsonResponse(['errorMessage' => 'Id not valid'], 400);
        }

        $token = $request->headers->get('X-Authorization');
        $userId = $decodeJwt->getIdToken($token);
        if (!$userId) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }
        $user = $userRepository->find($userId);
        if(!$user) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }

        $project = $projectRepository->findOneBy(['id' => (int)$id, 'owner' => $user]);
        if (!$project) {
            return new JsonResponse();
        }

        $data = $projectFormater->formatOne($project);
        return new JsonResponse($data);
    }

    #[Route('/api/project/add', name: 'app_project_add', methods: ['POST'])]
    public function addProject(
        Request $request,
        ObjectManager $objectManager,
        ServiceValidateField $validateField,
        UserRepository $userRepository,
        DecodeJwt $decodeJwt,
    ): JsonResponse
    {
        $token = $request->headers->get('X-Authorization');
        $userId = $decodeJwt->getIdToken($token);
        if (!$userId) {
            return new JsonResponse(['errorMessage' => 'User not connected'], 401);
        }
        $user = $userRepository->find($userId);
        if(!$user) {
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
        
        return new JsonResponse($project->getId());
    }
}
