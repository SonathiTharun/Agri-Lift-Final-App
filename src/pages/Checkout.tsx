
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, CreditCard, ShoppingCart, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
};

// Combined product catalog
const allProducts: Record<string, any> = {
  "lg-plant-1": { name: "High-Yield Rice Seedling", price: 199, image: "https://images.unsplash.com/photo-1628684582941-abfbf5732f0e?q=80&w=2080&auto=format&fit=crop", category: "lab-grown-plants" },
  "lg-plant-2": { name: "Disease-Resistant Wheat", price: 249, image: "https://images.unsplash.com/photo-1536704515403-0b54f32be3aa?q=80&w=2069&auto=format&fit=crop", category: "lab-grown-plants" },
  "lg-plant-3": { name: "Drought-Tolerant Corn", price: 279, image: "https://images.unsplash.com/photo-1601329378636-b2f48bb6de76?q=80&w=2078&auto=format&fit=crop", category: "lab-grown-plants" },
  "lg-plant-4": { name: "Fast-Growing Vegetable Set", price: 349, image: "https://images.unsplash.com/photo-1528825539566-2bcb5882445c?q=80&w=2070&auto=format&fit=crop", category: "lab-grown-plants" },
  "seeds-1": { name: "Premium Hybrid Tomato Seeds", price: 89, image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=2070&auto=format&fit=crop", category: "seeds" },
  "seeds-2": { name: "Organic Carrot Seeds", price: 59, image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=2070&auto=format&fit=crop", category: "seeds" },
  "seeds-3": { name: "Watermelon Seed Mix", price: 99, image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=2070&auto=format&fit=crop", category: "seeds" },
  "seeds-4": { name: "Herb Garden Seed Kit", price: 129, image: "https://images.unsplash.com/photo-1619542402805-a6fff4407b9f?q=80&w=1932&auto=format&fit=crop", category: "seeds" },
  "fert-1": { name: "All-Purpose Organic Fertilizer", price: 299, image: "https://images.unsplash.com/photo-1615412704911-55d589229864?q=80&w=2070&auto=format&fit=crop", category: "fertilizers" },
  "fert-2": { name: "Slow-Release Granular Fertilizer", price: 399, image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop", category: "fertilizers" },
  "fert-3": { name: "Liquid Seaweed Fertilizer", price: 179, image: "https://images.unsplash.com/photo-1576158114254-3b8ac9df9adf?q=80&w=2080&auto=format&fit=crop", category: "fertilizers" },
  "fert-4": { name: "Specialized Fruit Tree Fertilizer", price: 349, image: "https://images.unsplash.com/photo-1658490858699-ea28503c7d4b?q=80&w=2069&auto=format&fit=crop", category: "fertilizers" },
  "pest-1": { name: "Organic Insect Spray", price: 159, image: "https://images.unsplash.com/photo-1527367888476-abf53aaf7bf1?q=80&w=2070&auto=format&fit=crop", category: "pesticides" },
  "pest-2": { name: "Fungicide Solution", price: 219, image: "https://images.unsplash.com/photo-1603256811365-19a4ccc3beb0?q=80&w=2071&auto=format&fit=crop", category: "pesticides" },
  "pest-3": { name: "Weed Control Concentrate", price: 289, image: "https://images.unsplash.com/photo-1560806853-c492a5d166b4?q=80&w=2017&auto=format&fit=crop", category: "pesticides" },
  "pest-4": { name: "Rodent Repellent", price: 199, image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop", category: "pesticides" },
};

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: ""
  });
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: ""
  });
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('agrilift-cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      
      // Convert cart object to array of items with product details
      const items: CartItem[] = Object.entries(parsedCart).map(([id, quantity]) => {
        const product = allProducts[id];
        return {
          id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity as number,
          category: product.category
        };
      });
      
      setCartItems(items);
    }
  }, []);
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    setCart(prevCart => {
      const newCart = { ...prevCart, [id]: newQuantity };
      localStorage.setItem('agrilift-cart', JSON.stringify(newCart));
      return newCart;
    });
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const removeItem = (id: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[id];
      localStorage.setItem('agrilift-cart', JSON.stringify(newCart));
      return newCart;
    });
    
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setCart({});
    setCartItems([]);
    localStorage.removeItem('agrilift-cart');
  };
  
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const getShipping = () => {
    return getSubtotal() > 1000 ? 0 : 99;
  };
  
  const getTotal = () => {
    return getSubtotal() + getShipping();
  };
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContinue = () => {
    if (step === "cart") {
      setStep("shipping");
    } else if (step === "shipping") {
      // Validate shipping details
      const { fullName, address, city, state, pincode, phoneNumber } = shippingDetails;
      if (!fullName || !address || !city || !state || !pincode || !phoneNumber) {
        toast({
          title: "Missing information",
          description: "Please fill in all shipping details to continue",
          variant: "destructive"
        });
        return;
      }
      setStep("payment");
    }
  };
  
  const handleBack = () => {
    if (step === "shipping") {
      setStep("cart");
    } else if (step === "payment") {
      setStep("shipping");
    }
  };
  
  const processPayment = () => {
    // Validate payment details
    const { cardNumber, cardholderName, expiryDate, cvv } = paymentDetails;
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details to complete your purchase",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: `Thank you for your purchase. Your order #${Math.floor(Math.random() * 10000)} has been placed.`,
      });
      
      // Clear cart and navigate to home
      clearCart();
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-20 px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <h1 className="text-3xl font-bold text-soil-dark mb-6">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "cart" ? "bg-foliage text-white" : "bg-foliage/50 text-white"}`}>
                1
              </div>
              <span className="text-sm font-medium">Cart</span>
              <div className="h-1 w-10 bg-gray-200">
                <div className={`h-full ${step !== "cart" ? "bg-foliage" : "bg-gray-200"}`}></div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-foliage text-white" : step === "payment" ? "bg-foliage/50 text-white" : "bg-gray-200 text-gray-600"}`}>
                2
              </div>
              <span className="text-sm font-medium">Shipping</span>
              <div className="h-1 w-10 bg-gray-200">
                <div className={`h-full ${step === "payment" ? "bg-foliage" : "bg-gray-200"}`}></div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-foliage text-white" : "bg-gray-200 text-gray-600"}`}>
                3
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
          
          {cartItems.length === 0 ? (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center gap-4">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
                <CardTitle>Your cart is empty</CardTitle>
                <p className="text-gray-500">Add some products to your cart from our market</p>
                <Button onClick={() => navigate('/market')}>
                  Continue Shopping
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2">
                {step === "cart" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Cart ({cartItems.length} items)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex gap-4 pb-4 border-b">
                            <div className="h-20 w-20 overflow-hidden rounded-md">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500 mb-2">Category: {item.category.replace(/-/g, ' ')}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="h-6 w-6 flex items-center justify-center rounded-full border"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button 
                                    className="h-6 w-6 flex items-center justify-center rounded-full border"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">₹{item.price * item.quantity}</span>
                                  <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={clearCart}>
                        Clear Cart
                      </Button>
                      <Button onClick={handleContinue}>
                        Continue to Shipping
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {step === "shipping" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={shippingDetails.fullName} 
                            onChange={handleShippingChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            value={shippingDetails.phoneNumber} 
                            onChange={handleShippingChange}
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={shippingDetails.address} 
                            onChange={handleShippingChange}
                            placeholder="123 Main St"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={shippingDetails.city} 
                            onChange={handleShippingChange}
                            placeholder="Mumbai"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={shippingDetails.state} 
                            onChange={handleShippingChange}
                            placeholder="Maharashtra"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input 
                            id="pincode" 
                            name="pincode" 
                            value={shippingDetails.pincode} 
                            onChange={handleShippingChange}
                            placeholder="400001"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Back to Cart
                      </Button>
                      <Button onClick={handleContinue}>
                        Continue to Payment
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {step === "payment" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <Input 
                              id="cardNumber" 
                              name="cardNumber" 
                              value={paymentDetails.cardNumber} 
                              onChange={handlePaymentChange}
                              placeholder="4111 1111 1111 1111"
                              className="border-0"
                            />
                            <span className="px-3">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input 
                            id="cardholderName" 
                            name="cardholderName" 
                            value={paymentDetails.cardholderName} 
                            onChange={handlePaymentChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input 
                              id="expiryDate" 
                              name="expiryDate" 
                              value={paymentDetails.expiryDate} 
                              onChange={handlePaymentChange}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              name="cvv"
                              type="password"
                              value={paymentDetails.cvv} 
                              onChange={handlePaymentChange}
                              placeholder="123"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 p-3 bg-gray-50 rounded-md">
                          <h3 className="font-medium mb-2">Payment Methods</h3>
                          <div className="flex gap-2 flex-wrap">
                            <div className="border rounded p-2 bg-white">
                              <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="h-6" />
                            </div>
                            <div className="border rounded p-2 bg-white">
                              <img src="https://cdn.worldvectorlogo.com/logos/mastercard-6.svg" alt="Mastercard" className="h-6" />
                            </div>
                            <div className="border rounded p-2 bg-white">
                              <img src="https://cdn.worldvectorlogo.com/logos/upi-1.svg" alt="UPI" className="h-6" />
                            </div>
                            <div className="border rounded p-2 bg-white">
                              <img src="https://cdn.worldvectorlogo.com/logos/paytm-1.svg" alt="Paytm" className="h-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Back to Shipping
                      </Button>
                      <Button 
                        onClick={processPayment} 
                        disabled={isProcessing}
                        className="bg-foliage hover:bg-foliage-dark"
                      >
                        {isProcessing ? "Processing..." : <>Pay <IndianRupee className="ml-1 h-4 w-4" /> {getTotal()}</>}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{getSubtotal()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{getShipping() === 0 ? "Free" : `₹${getShipping()}`}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>₹{getTotal()}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getShipping() === 0 ? "Free shipping on orders above ₹1000" : ""}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-4 bg-foliage-light/30 rounded-lg p-3 text-xs text-gray-600">
                  <p className="font-medium mb-1">Secure Checkout</p>
                  <p>All transactions are secure and encrypted. Your payment information is never stored.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
