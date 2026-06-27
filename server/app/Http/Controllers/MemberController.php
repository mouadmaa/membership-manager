<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $query = Member::with(['user', 'subscriptions']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('national_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->query('status')) {
            if ($status === 'active') {
                $query->whereHas('subscriptions', function ($q) {
                    $q->whereDate('end_date', '>=', today())
                        ->whereRaw('end_date = (SELECT MAX(end_date) FROM subscriptions WHERE member_id = members.id)');
                });
            } elseif ($status === 'expired') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('subscriptions')
                        ->orWhereHas('subscriptions', function ($sq) {
                            $sq->whereRaw('end_date = (SELECT MAX(end_date) FROM subscriptions WHERE member_id = members.id)')
                                ->whereDate('end_date', '<', today());
                        });
                });
            }
        }

        return $query->orderByDesc('updated_at')->get();
    }

    public function show(Request $request, Member $member)
    {
        if ($request->user()->role !== 'admin' && $request->user()->member?->id !== $member->id) {
            abort(403);
        }

        return $member->load([
            'user',
            'subscriptions' => fn ($q) => $q->orderByDesc('updated_at'),
            'payments' => fn ($q) => $q->orderByDesc('updated_at'),
            'checkins' => fn ($q) => $q->orderByDesc('updated_at'),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'national_id' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $member = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => 'member',
            ]);

            return Member::create([
                'user_id' => $user->id,
                'national_id' => $data['national_id'],
                'phone' => $data['phone'] ?? null,
            ]);
        });

        return response()->json($member->load('user'), 201);
    }

    public function update(Request $request, Member $member)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$member->user_id,
            'national_id' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $member->user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        $member->update([
            'national_id' => $data['national_id'],
            'phone' => $data['phone'] ?? null,
        ]);

        return $member->load('user');
    }

    public function destroy(Request $request, Member $member)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $member->user->delete();

        return response()->json(['message' => 'Member deleted']);
    }

    public function me(Request $request)
    {
        $member = $request->user()->member;

        if (! $member) {
            abort(404);
        }

        return $member->load([
            'subscriptions' => fn ($q) => $q->orderByDesc('updated_at'),
            'payments' => fn ($q) => $q->orderByDesc('updated_at'),
            'checkins' => fn ($q) => $q->orderByDesc('updated_at'),
        ]);
    }
}
