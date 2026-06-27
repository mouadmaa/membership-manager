<?php

namespace App\Http\Controllers;

use App\Models\Checkin;
use App\Models\Member;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $startMonth = today()->subMonths(5)->startOfMonth();

        $revenueRows = Payment::query()
            ->select(
                DB::raw('YEAR(payment_date) as year'),
                DB::raw('MONTH(payment_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->whereDate('payment_date', '>=', $startMonth)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->keyBy(fn ($row) => sprintf('%04d-%02d', $row->year, $row->month));

        $revenueByMonth = collect(range(0, 5))->map(function ($offset) use ($startMonth, $revenueRows) {
            $date = $startMonth->copy()->addMonths($offset);
            $key = $date->format('Y-m');

            return [
                'month' => $date->format('M Y'),
                'total' => (float) ($revenueRows[$key]->total ?? 0),
            ];
        })->values();

        $startDay = today()->subDays(6);

        $checkinRows = Checkin::query()
            ->select(DB::raw('DATE(checked_in_at) as day'), DB::raw('COUNT(*) as total'))
            ->whereDate('checked_in_at', '>=', $startDay)
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy(fn ($row) => Carbon::parse($row->day)->toDateString());

        $checkinsByDay = collect(range(0, 6))->map(function ($offset) use ($startDay, $checkinRows) {
            $date = $startDay->copy()->addDays($offset);
            $key = $date->toDateString();

            return [
                'day' => $date->format('D'),
                'total' => (int) ($checkinRows[$key]->total ?? 0),
            ];
        })->values();

        $recentPayments = Payment::with(['member.user'])
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($payment) => [
                'id' => $payment->id,
                'member_name' => $payment->member?->user?->name,
                'amount' => (float) $payment->amount,
                'payment_date' => $payment->payment_date->toDateString(),
                'updated_at' => $payment->updated_at?->toISOString(),
            ])
            ->values();

        $recentCheckins = Checkin::with(['member.user'])
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($checkin) => [
                'id' => $checkin->id,
                'member_name' => $checkin->member?->user?->name,
                'checked_in_at' => $checkin->checked_in_at?->toISOString(),
                'updated_at' => $checkin->updated_at?->toISOString(),
            ])
            ->values();

        return [
            'total_members' => $totalMembers,
            'active_members' => $activeMembers,
            'expired_members' => $totalMembers - $activeMembers,
            'revenue_this_month' => (float) $revenueThisMonth,
            'checkins_today' => $checkinsToday,
            'revenue_by_month' => $revenueByMonth,
            'checkins_by_day' => $checkinsByDay,
            'recent_payments' => $recentPayments,
            'recent_checkins' => $recentCheckins,
        ];
    }
}
