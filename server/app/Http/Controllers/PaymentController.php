<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with('subscription');

        if ($request->user()->role === 'admin') {
            if ($memberId = $request->query('member_id')) {
                $query->where('member_id', $memberId);
            }
        } else {
            $member = $request->user()->member;

            if (! $member) {
                return collect();
            }

            $query->where('member_id', $member->id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'member_id' => 'required|exists:members,id',
            'plan_id' => 'required|exists:plans,id',
            'amount' => 'nullable|numeric|min:0',
            'payment_date' => 'nullable|date',
        ]);

        $plan = Plan::findOrFail($data['plan_id']);
        $paymentDate = isset($data['payment_date'])
            ? Carbon::parse($data['payment_date'])->toDateString()
            : today()->toDateString();
        $amount = $data['amount'] ?? $plan->price;

        $payment = DB::transaction(function () use ($data, $plan, $paymentDate, $amount) {
            $activeSubscription = Subscription::where('member_id', $data['member_id'])
                ->whereDate('end_date', '>=', today())
                ->orderByDesc('end_date')
                ->first();

            $startDate = $activeSubscription
                ? Carbon::parse($activeSubscription->end_date)
                : today();

            $endDate = $startDate->copy()->addDays($plan->duration_days);

            $subscription = Subscription::create([
                'member_id' => $data['member_id'],
                'plan_id' => $plan->id,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ]);

            return Payment::create([
                'member_id' => $data['member_id'],
                'subscription_id' => $subscription->id,
                'amount' => $amount,
                'payment_date' => $paymentDate,
            ]);
        });

        return response()->json($payment->load('subscription'), 201);
    }
}
