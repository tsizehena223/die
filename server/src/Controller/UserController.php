<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\UserAuthenticator;
use App\Service\GenerateToken;
use App\Service\ValidateField as ServiceValidateField;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use ValidateField;

class UserController extends AbstractController
{
    public function __construct(private UserPasswordHasherInterface $hasher)
    {
    }

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, GenerateToken $generateToken, ServiceValidateField $validateField): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$validateField->isFieldValid($data, 'email') || !$validateField->isFieldValid($data, 'password')) {
            return new JsonResponse(['errorMessage' => 'Email and Password required'], 400);
        }

        $user = $userRepository->findOneByEmail($data['email']);
        if (!$user) {
            return new JsonResponse(["errorMessage" => "This email doesn't have an account"], 401);
        }

        $isPasswordCorrect = ($this->hasher->isPasswordValid($user, $data['password'])) ? true : false;
        if (!$isPasswordCorrect) {
            return new JsonResponse(["errorMessage" => "Incorrect password"], 401);
        }

        $token = $generateToken->generateToken($user->getId());
        return new JsonResponse([
            'token' => $token,
            'userData'=> [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
            ]
        ]);
    }

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, UserRepository $userRepository, ObjectManager $objectManager, ServiceValidateField $validateField): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$validateField->isFieldValid($data, 'email') || !$validateField->isFieldValid($data, 'password') || !$validateField->isFieldValid($data, 'username')) {
            return new JsonResponse(['errorMessage' => 'Email, Username, and Password required'], 400);
        }

        if ($userRepository->findOneByEmail($data['email'])) {
            return new JsonResponse(['errorMessage' => 'Email already taken'], 400);
        }

        $user = new User();
        $hashedPassword = $this->hasher->hashPassword($user, $data['password']);
        $user->setUsername($data["username"])
            ->setEmail($data['email'])
            ->setPassword($hashedPassword)
            ->setRoles(["ROLE_USER"]);

        $objectManager->persist($user);
        $objectManager->flush();

        return new JsonResponse(['message' => 'Account created successfully'], 201);
    }

    #[Route('/api/profile/update', name: 'app_profile_update', methods: ['POST'])]
    public function update(
        Request $request,
        UserAuthenticator $userAuthenticator,
        ObjectManager $objectManager,
        UserRepository $userRepository,
        ServiceValidateField $validateField
    ): JsonResponse
    {
        if (!$userAuthenticator->supports($request)) {
            return new JsonResponse(['errorMessage' => 'User not authenticated'], 401);
        }

        $badge = $userAuthenticator->authenticate($request);
        $userEmail = $badge->getUser()->getUserIdentifier();
        if (!$userEmail) {
            return new JsonResponse(['errorMessage' => 'User not authenticated'], 401);
        }

        $user = $userRepository->findOneBy(["email" => $userEmail]);
        if (!$user) {
            return new JsonResponse(['errorMessage' => 'User not authenticated'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!$validateField->isFieldValid($data, 'newEmail') || !$validateField->isFieldValid($data, 'newUsername')) {
            return new JsonResponse(['errorMessage' => 'Email and Username are required'], 400);
        }

        $user->setEmail($data['newEmail']);
        $user->setUsername($data['newUsername']);
        $objectManager->persist($user);
        $objectManager->flush();

        $userUpdated = [
            'email' => $user->getEmail(),
            'username' => $user->getUsername()
        ];

        return new JsonResponse($userUpdated);
    }

    #[Route('/api/users/all', name: 'app_users', methods: ['GET'])]
    public function getUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        if (!$users) {
            return new JsonResponse(['errorMessage' => 'No user found']);
        }

        $data = [];
        foreach ($users as $user) {
            $data[] = [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "username" => $user->getUserName()
            ];
        }

        return new JsonResponse($data);
    }
}
