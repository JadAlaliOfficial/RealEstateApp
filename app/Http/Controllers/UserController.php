<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:users.index')->only('index');
        $this->middleware('permission:users.create')->only(['create', 'store']);
        $this->middleware('permission:users.edit')->only(['edit', 'update']);
        $this->middleware('permission:users.destroy')->only('destroy');
    }

    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with(['roles', 'permissions'])->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->roles->map(function ($role) {
                        return ['id' => $role->id, 'name' => $role->name];
                    }),
                    'permissions' => $user->permissions->map(function ($permission) {
                        return ['id' => $permission->id, 'name' => $permission->name];
                    }),
                ];
            })
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
            'permissions' => Permission::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|exists:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role (single role from dropdown)
        if ($request->role) {
            $user->assignRole($request->role);
        }

        // Assign direct permissions (array from checkboxes)
        if ($request->permissions) {
            $user->givePermissionTo($request->permissions);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user->load('roles', 'permissions')
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user->load(['roles', 'permissions']),
            'roles' => Role::all(),
            'permissions' => Permission::all(),
            'userRoles' => $user->roles->pluck('name')->toArray(),
            'userPermissions' => $user->permissions->pluck('name')->toArray()
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|exists:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        // Sync role (single role)
        if ($request->has('role')) {
            if ($request->role) {
                $user->syncRoles([$request->role]);
            } else {
                $user->syncRoles([]);
            }
        }

        // Sync permissions (array)
        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions ?? []);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent deleting users with Super-Admin role
        if ($user->hasRole('Super-Admin')) {
            return redirect()->route('users.index')->with('error', 'Cannot delete Super-Admin user.');
        }

        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
