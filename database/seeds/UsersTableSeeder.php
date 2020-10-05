<?php

use App\Models\Role;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MasterSaldo;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //        factory(User::class, 10)->create();
        $randomReferral = strtoupper(Str::random(6));
        $randomReferral2 = strtoupper(Str::random(6));
        $randomReferral3 = strtoupper(Str::random(6));

        $admin = [
            'name' => 'admin',
            'email' => 'admin@anekaarisan.com',
            'email_verified_at' => now(),
            'phone_number' => '09876543211',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'is_active' => true,
            'agent_code' => $randomReferral3,
            'status' => 'APPROVED',
        ];
        $agent1 = [
            'name' => 'agent1',
            'email' => 'agent1@anekaarisan.com',
            'email_verified_at' => now(),
            'phone_number' => '09876543212',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'is_active' => true,
            'agent_code' => $randomReferral,
            'status' => 'APPROVED',
        ];
        $agent2 = [
            'name' => 'agent2',
            'email' => 'agent2@anekaarisan.com',
            'email_verified_at' => now(),
            'phone_number' => '09876543213',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'is_active' => false,
            'referral_code' => $randomReferral,
            'agent_code' => $randomReferral2,
            'status' => 'WAIT',
        ];
        $users = array($admin, $agent1, $agent2);
        for ($i = 0; $i < count($users); $i++) {
            $user = User::create($users[$i]);

            if ($i == 0) {
                $user->assignRole(Role::findByName('admin'));
            } else {
                $user->assignRole(Role::findByName('agent'));

                //init saldo on agent
                MasterSaldo::create([
                    "user_id" => $user->id,
                    "saldo" => 0,
                ]);
            }
        }
    }
}
