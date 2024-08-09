<?php

namespace App\Service;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;

class VerifyAuthentication
{
  public function __construct(private DecodeJwt $decodeJwt, private UserRepository $userRepository) {
  }

  public function verify(Request $request)
  {
    $token = $request->headers->get('X-Authorization');
    $userId = $this->decodeJwt->getIdToken($token);
    if (!$userId) {
      return null;
    }
    $user = $this->userRepository->find($userId);
    if(!$user) {
      return null;
    }
    return $user;
  }
}