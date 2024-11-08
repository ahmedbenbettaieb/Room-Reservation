<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateOrUpdateUser extends Command
{
    protected $signature = 'user:create-or-update
                            {email : The email of the user}
                            {name : The name of the user}
                            {password : The password of the user}
                            {role : The role of the user}'
                            ;

    protected $description = 'Create or update a user based on email';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->argument('name');
        $password = $this->argument('password');
        $role = $this->argument('role');

        $this->info('Creating or updating user with role ' . $role . '...');
        $user =New User();
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->role = $role;
        $user->save();

        if ($user->wasRecentlyCreated) {
            $this->info('User created successfully.');
        } else {
            $this->info('User updated successfully.');
        }

        return Command::SUCCESS;
    }
}
