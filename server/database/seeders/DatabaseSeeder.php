<?php

namespace Database\Seeders;

use App\Models\Checkin;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $monthly = Plan::create([
            'name' => 'Monthly',
            'price' => 300,
            'duration_days' => 30,
        ]);

        $quarterly = Plan::create([
            'name' => 'Quarterly',
            'price' => 800,
            'duration_days' => 90,
        ]);

        $annual = Plan::create([
            'name' => 'Annual',
            'price' => 3000,
            'duration_days' => 365,
        ]);

        $membersData = [
            [
                'name' => 'Alice Martin',
                'email' => 'alice@example.com',
                'national_id' => 'NAT100001',
                'phone' => '0611111111',
                'subscriptions' => [
                    [
                        'plan' => $monthly,
                        'start_date' => Carbon::today()->subDays(10),
                        'end_date' => Carbon::today()->addDays(20),
                        'payment_date' => Carbon::today()->subDays(10),
                    ],
                ],
                'checkins' => [
                    Carbon::today()->subDays(2)->setTime(9, 15),
                    Carbon::today()->subDays(5)->setTime(18, 30),
                ],
            ],
            [
                'name' => 'Bob Dupont',
                'email' => 'bob@example.com',
                'national_id' => 'NAT100002',
                'phone' => '0622222222',
                'subscriptions' => [
                    [
                        'plan' => $annual,
                        'start_date' => Carbon::today()->subMonths(2),
                        'end_date' => Carbon::today()->addMonths(10),
                        'payment_date' => Carbon::today()->subMonths(2),
                    ],
                ],
                'checkins' => [
                    Carbon::today()->subDays(1)->setTime(10, 0),
                    Carbon::today()->subDays(4)->setTime(11, 45),
                    Carbon::today()->subDays(6)->setTime(8, 20),
                ],
            ],
            [
                'name' => 'Claire Bernard',
                'email' => 'claire@example.com',
                'national_id' => 'NAT100003',
                'phone' => '0633333333',
                'subscriptions' => [
                    [
                        'plan' => $quarterly,
                        'start_date' => Carbon::today()->subDays(120),
                        'end_date' => Carbon::today()->subDays(30),
                        'payment_date' => Carbon::today()->subDays(120),
                    ],
                ],
                'checkins' => [],
            ],
            [
                'name' => 'David Leroy',
                'email' => 'david@example.com',
                'national_id' => 'NAT100004',
                'phone' => '0644444444',
                'subscriptions' => [
                    [
                        'plan' => $monthly,
                        'start_date' => Carbon::today()->subDays(60),
                        'end_date' => Carbon::today()->subDays(30),
                        'payment_date' => Carbon::today()->subDays(60),
                    ],
                    [
                        'plan' => $monthly,
                        'start_date' => Carbon::today()->subDays(5),
                        'end_date' => Carbon::today()->addDays(25),
                        'payment_date' => Carbon::today()->subDays(5),
                    ],
                ],
                'checkins' => [
                    Carbon::today()->subDays(3)->setTime(7, 50),
                    Carbon::today()->subHours(2)->subMinutes(30),
                ],
            ],
            [
                'name' => 'Emma Petit',
                'email' => 'emma@example.com',
                'national_id' => 'NAT100005',
                'phone' => null,
                'subscriptions' => [
                    [
                        'plan' => $monthly,
                        'start_date' => Carbon::today()->subDays(45),
                        'end_date' => Carbon::today()->subDays(15),
                        'payment_date' => Carbon::today()->subDays(45),
                    ],
                ],
                'checkins' => [
                    Carbon::today()->subDays(7)->setTime(16, 10),
                ],
            ],
        ];

        foreach ($membersData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => 'password',
                'role' => 'member',
            ]);

            $member = Member::create([
                'user_id' => $user->id,
                'national_id' => $data['national_id'],
                'phone' => $data['phone'],
            ]);

            foreach ($data['subscriptions'] as $sub) {
                $subscription = Subscription::create([
                    'member_id' => $member->id,
                    'plan_id' => $sub['plan']->id,
                    'start_date' => $sub['start_date'],
                    'end_date' => $sub['end_date'],
                ]);

                Payment::create([
                    'member_id' => $member->id,
                    'subscription_id' => $subscription->id,
                    'amount' => $sub['plan']->price,
                    'payment_date' => $sub['payment_date'],
                ]);
            }

            foreach ($data['checkins'] as $checkedInAt) {
                Checkin::create([
                    'member_id' => $member->id,
                    'checked_in_at' => $checkedInAt,
                ]);
            }
        }
    }
}
