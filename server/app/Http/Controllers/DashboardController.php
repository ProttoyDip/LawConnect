<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Route the user to the correct dashboard based on role.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return match ($user->role?->name) {
            Role::ADMIN   => $this->admin(),
            Role::POLICE  => $this->police($request),
            default       => $this->citizen($request),
        };
    }

    private function citizen(Request $request)
    {
        return view('archive.dashboard.citizen');
    }

    private function police(Request $request)
    {
        return view('archive.dashboard.citizen');
    }

    private function admin()
    {
        return view('archive.dashboard.citizen');
    }
}
