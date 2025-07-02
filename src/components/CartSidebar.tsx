import React from 'react';
import { ShoppingCart, X, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

export function CartSidebar() {
  const { cartItems, getCartCount, getCartTotal, updateQuantity, removeFromCart, clearCart, formatCurrency } = useCart();

  const emptyCart = cartItems.length === 0;
  const cartCount = getCartCount();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="relative inline-block cursor-pointer">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-8 w-8" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-500 text-base">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="px-4">
            <DrawerTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
              {cartCount > 0 && <Badge variant="outline" className="ml-2">{cartCount} items</Badge>}
            </DrawerTitle>
            <DrawerDescription>
              {emptyCart ? "Your cart is empty" : `Total: ${formatCurrency(getCartTotal())}`}
            </DrawerDescription>
            <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>

          <div className="px-4 pb-0">
            <Separator />
          </div>

          <div className="flex-1 overflow-auto p-4">
            {emptyCart ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <DrawerClose asChild>
                  <Button variant="default" size="sm" asChild>
                    <Link to="/market">Start Shopping</Link>
                  </Button>
                </DrawerClose>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{item.category.replace(/-/g, ' ')}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full border text-xs"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full border text-xs"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!emptyCart && (
            <>
              <div className="px-4 pb-0">
                <Separator />
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{getCartTotal() > 1000 ? "Free" : formatCurrency(99)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(getCartTotal() + (getCartTotal() > 1000 ? 0 : 99))}</span>
                  </div>
                </div>
              </div>

              <DrawerFooter className="px-4 py-4">
                <Button asChild className="bg-foliage hover:bg-foliage-dark">
                  <Link to="/checkout">
                    Proceed to Checkout <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
