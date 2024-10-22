import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Loader2, User, Store } from "lucide-react"
import { api, apiMethods } from '../api/api'

export default function CombinedSignIn() {
  const [userType, setUserType] = useState('customer')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let response
      if (userType === 'customer') {
        response = await apiMethods.loginCustomer(formData)
      } else {
        response = await apiMethods.loginRestaurant(formData)
      }
      
      // Assuming the API returns a token
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userType', userType)
      
      toast({
        title: "Sign In Successful",
        description: `Welcome back, ${userType}!`,
      })
      
      // Redirect based on user type
      // window.location.href = userType === 'customer' ? '/customer-dashboard' : '/restaurant-dashboard'
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In to UberEats</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup 
          defaultValue="customer" 
          onValueChange={setUserType}
          className="flex justify-center space-x-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="customer" id="customer" />
            <Label htmlFor="customer" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Customer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="restaurant" id="restaurant" />
            <Label htmlFor="restaurant" className="flex items-center">
              <Store className="w-4 h-4 mr-2" />
              Restaurant
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full"
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            `Sign In as ${userType === 'customer' ? 'Customer' : 'Restaurant'}`
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="#" className="font-medium text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  )
}