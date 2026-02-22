<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $orders = Order::with(['user', 'items'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('order_number', 'like', '%'.$request->search.'%')
                        ->orWhere('recipient_name', 'like', '%'.$request->search.'%');
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('user_id'), function ($query) use ($request) {
                $query->where('user_id', $request->user_id);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $users = User::where('role', 'user')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        // Stats
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::whereIn('status', ['paid', 'processing', 'shipped'])->count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'users' => $users,
            'stats' => $stats,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load(['user', 'items.productSku', 'shipment', 'payment']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,paid,processing,shipped,delivered,cancelled,refunded'],
            'cancel_reason' => ['nullable', 'required_if:status,cancelled', 'in:payment_expired,out_of_stock,buyer_request,seller_request,fraud_suspected'],
        ]);

        $order->update([
            'status' => $request->status,
            'cancel_reason' => $request->cancel_reason,
            'shipped_at' => $request->status === 'shipped' ? now() : $order->shipped_at,
            'delivered_at' => $request->status === 'delivered' ? now() : $order->delivered_at,
        ]);

        return redirect()->back()
            ->with('success', 'Status order berhasil diperbarui!');
    }
}
