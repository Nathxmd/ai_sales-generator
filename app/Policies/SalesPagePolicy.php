<?php

namespace App\Policies;

use App\Models\SalesPage;
use App\Models\User;

class SalesPagePolicy
{
    public function view(User $user, SalesPage $page): bool
    {
        return $user->id === $page->user_id;
    }

    public function update(User $user, SalesPage $page): bool
    {
        return $user->id === $page->user_id;
    }

    public function delete(User $user, SalesPage $page): bool
    {
        return $user->id === $page->user_id;
    }
}
