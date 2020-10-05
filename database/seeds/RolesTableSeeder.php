<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //https://docs.spatie.be/laravel-permission/v3/basic-usage/basic-usage/
        $role = Role::create(['name' => 'admin']);
        $role = Role::create(['name' => 'agent']);

        //to add permission
        // $permission = Permission::create(['name' => 'edit articles']);
    }
}
