<?php

namespace App\Http\Controllers;

use App\Models\Checkin;
use App\Models\Subscription;
use Illuminate\Http\Request;

class CheckinController extends Controller
{
    public function index(Request $request)
    {
        $query = Checkin::query()->orderByDesc('updated_at');

        if ($request->user()->role === 'admin') {
            if ($memberId = $request->query('member_id')) {
                $query->where('member_id', $memberId);
            }

            $query->with('member.user');
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
        if ($request->user()->role === 'admin') {
            $data = $request->validate([
                'member_id' => 'required|exists:members,id',
            ]);
            $memberId = $data['member_id'];
        } else {
            $member = $request->user()->member;

            if (! $member) {
                abort(404);
            }

            $memberId = $member->id;
        }

        $latestSubscription = Subscription::where('member_id', $memberId)
            ->orderByDesc('end_date')
            ->first();

        if (! $latestSubscription || $latestSubscription->end_date->lt(today())) {
            return response()->json([
                'message' => 'Member has no active subscription.',
            ], 422);
        }

        $checkin = Checkin::create([
            'member_id' => $memberId,
            'checked_in_at' => now(),
        ]);

        return response()->json($checkin, 201);
    }
}
