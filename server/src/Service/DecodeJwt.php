<?php

namespace App\Service;

use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;

class DecodeJwt
{
    private function decodeIt($jwtToken)
    {
        $j = explode(" ", $jwtToken);
        if ($j[0] == "Bearer") {
            return $j[1];
        } else {
            return null;
        }
    }

    public function getIdToken($jwt): ?int
    {
        $jwtdecoded = $this->decodeIt($jwt);

        if ($jwtdecoded != null) {
            $parser = new Parser(new JoseEncoder());
            $token = $parser->parse($jwtdecoded);
            $id = $token->claims()->get("id");
            return $id;
        } else {
            return null;
        }
    }
}