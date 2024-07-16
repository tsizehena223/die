<?php

namespace App\Service;

use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

class GenerateToken
{
    function generateToken($userId)
        {
            $key = 'hiG8DlOKvtih6AxlZn5XKImZ06yu8I3mkOzaJrEuW8yAv8Jnkw330uMt8AEqQ5LB';

            $configuration = Configuration::forSymmetricSigner(
                new Sha256(),
                InMemory::plainText($key)
            );

            $issuedAt = new \DateTimeImmutable("now", new \DateTimeZone("Indian/Antananarivo"));
            $builder = $configuration->builder()
                ->issuedBy('http://localhost:8000')
                ->permittedFor('http://localhost:3000')
                ->expiresAt($issuedAt->modify('+1 hour'))
                ->withClaim('id', $userId);

            $token = $builder->getToken($configuration->signer(), $configuration->signingKey());

            return $token->toString();
        }
}