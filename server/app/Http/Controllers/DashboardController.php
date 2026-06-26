<?php

namespace App\Http\Controllers;

use App\Models\Checkin;
use App\Models\Member;
use App\Models\Payment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $totalMembers = Member::count();

        $activeMembers = Member::whereHas('subscriptions', function ($q) {
            $q->whereDate('end_date', '>=', today())
                ->whereRaw('end_date = (SELECT MAX(end_date) FROM subscriptions WHERE member_id = members.id)');
        })->count();

        $revenueThisMonth = Payment::whereYear('payment_date', today()->year)
            ->whereMonth('payment_date', today()->month)
            ->sum('amount');

        $checkinsToday = Checkin::whereDate('checked_in_at', today())->count();

        return [
            'total_members' => $totalMembers,
            'active_members' => $activeMembers,
            'expired_members' => $totalMembers - $activeMembers,
            'revenue_this_month' => (float) $revenueThisMonth,
            'checkins_today' => $checkinsToday,
        ];
    }
}
