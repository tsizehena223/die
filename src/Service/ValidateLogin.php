<?php

function isFieldValid($data, String $field) : bool {
   if (isset($data[$field])) {
    if ($data[$field] != null)
        return true;
   }
   return false;
}