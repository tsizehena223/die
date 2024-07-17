<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\User;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use App\Service\DecodeJwt;
use App\Service\ValidateField as ServiceValidateField;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
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
        UserRepository $userRepository
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

        $data = [];
        foreach ($projects as $project) {
            $data[] = [
                'title' => $project->getTitle(),
                'description' => $project->getDescription(),
                'status' => $project->getStatus(),
                'deadline' => $project->getDeadline()->format('Y-m-d'),
            ];
        }
        return new JsonResponse($data, 200);
    }

    #[Route('/api/project/add', name: 'app_project_add', methods: ['POST'])]
    public function addProject(
        Request $request,
        Security $security,
        ObjectManager $objectManager,
        ServiceValidateField $validateField,
        UserRepository $userRepository
    ): JsonResponse
    {
        if (!$security->getUser()) {
            return new JsonResponse(['errorMessage' => 'User not authenticated'], 401);
        }
        $user = $security->getUser();

        $data = json_decode($request->getContent(), true);
        if (
            !$validateField->isFieldValid($data, 'title') || 
            !$validateField->isFieldValid($data, 'description') || 
            !$validateField->isFieldValid($data, 'status')
        ) {
            return new JsonResponse(['errorMessage' => 'title, description, status are required'], 400);
        }

        $project = new Project();
        $project->setTitle($data['title'])
            ->setDescription($data['description'])
            ->setDeadline(new \DateTime("now", new \DateTimeZone("Indian/Antananarivo")))
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
