<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function __construct(

    ) {
        $this->middleware('permission:roles.index')->only('index');
        $this->middleware('permission:roles.create')->only('create');
        $this->middleware('permission:roles.store')->only('store');
        $this->middleware('permission:roles.show')->only('show');
        $this->middleware('permission:roles.edit')->only('edit');
        $this->middleware('permission:roles.update')->only('update');
        $this->middleware('permission:roles.destroy')->only('destroy');

    }
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles',
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully');
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'array'
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully');
    }
    public function show(Role $role)
    {
        return Inertia::render('Roles/Show', [
            'role' => $role->load('permissions')
        ]);
    }

    public function destroy(Role $role)
    {
        // Prevent deleting Super-Admin role
        if ($role->name === 'Super-Admin') {
            return back()->with('error', 'Cannot delete Super-Admin role');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully');
    }
}
