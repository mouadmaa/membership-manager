<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        return Plan::all();
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
        ]);

        return Plan::create($data);
    }

    public function update(Request $request, Plan $plan)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
        ]);

        $plan->update($data);

        return $plan;
    }

    public function destroy(Request $request, Plan $plan)
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $plan->delete();

        return response()->json(['message' => 'Plan deleted']);
    }
}
