<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\GenerateToken;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    public function __construct(private UserPasswordHasherInterface $hasher)
    {
    }

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, GenerateToken $generateToken): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isFieldValid($data, 'email') || !isFieldValid($data, 'password')) {
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

        $token = $generateToken->generateToken($user->getId(), 'http://127.0.0.1:8000', '');
        return new JsonResponse([
            'token' => $token,
        ]);
    }
}
