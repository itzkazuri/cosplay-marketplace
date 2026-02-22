<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShipmentRequest;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    /**
     * Display a listing of shipments.
     */
    public function index(Request $request): Response
    {
        $shipments = Shipment::with(['order.user'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('tracking_number', 'like', '%'.$request->search.'%')
                        ->orWhereHas('order', function ($q) use ($request) {
                            $q->where('order_number', 'like', '%'.$request->search.'%')
                                ->orWhere('recipient_name', 'like', '%'.$request->search.'%');
                        });
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('courier'), function ($query) use ($request) {
                $query->where('courier', $request->courier);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $orders = Order::whereDoesntHave('shipment')
            ->whereIn('status', ['paid', 'processing'])
            ->orderBy('order_number')
            ->get(['id', 'order_number', 'recipient_name']);

        // Stats
        $stats = [
            'total_shipments' => Shipment::count(),
            'pending_shipments' => Shipment::whereIn('status', ['pending', 'packed'])->count(),
            'in_transit_shipments' => Shipment::whereIn('status', ['shipped', 'in_transit'])->count(),
            'delivered_shipments' => Shipment::where('status', 'delivered')->count(),
        ];

        return Inertia::render('Admin/Shipments/Index', [
            'shipments' => $shipments,
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created shipment in storage.
     */
    public function store(StoreShipmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Shipment::create($validated);

        // Update order status to shipped
        if ($validated['status'] === 'shipped') {
            $order = Order::find($validated['order_id']);
            if ($order) {
                $order->update(['status' => 'shipped']);
            }
        }

        return redirect()->route('admin.shipments.index')
            ->with('success', 'Pengiriman berhasil ditambahkan!');
    }

    /**
     * Update the specified shipment in storage.
     */
    public function update(StoreShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        $validated = $request->validated();

        $shipment->update($validated);

        // Update order status if shipment is shipped
        if ($validated['status'] === 'shipped') {
            $shipment->order->update(['status' => 'shipped']);
        }

        return redirect()->route('admin.shipments.index')
            ->with('success', 'Pengiriman berhasil diperbarui!');
    }

    /**
     * Update shipment status.
     */
    public function updateStatus(Request $request, Shipment $shipment): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,packed,shipped,in_transit,delivered,returned,failed'],
        ]);

        $shipment->update([
            'status' => $request->status,
            'shipped_at' => $request->status === 'shipped' ? now() : $shipment->shipped_at,
            'delivered_at' => $request->status === 'delivered' ? now() : $shipment->delivered_at,
        ]);

        return redirect()->back()
            ->with('success', 'Status pengiriman berhasil diperbarui!');
    }

    /**
     * Remove the specified shipment from storage.
     */
    public function destroy(Shipment $shipment): RedirectResponse
    {
        $shipment->delete();

        return redirect()->route('admin.shipments.index')
            ->with('success', 'Pengiriman berhasil dihapus!');
    }
}
