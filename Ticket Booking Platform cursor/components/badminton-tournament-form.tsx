"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badminton, Users, Calendar, MapPin, CreditCard, Upload, User, Phone, Mail, IdCard } from 'lucide-react'
import { PayUPaymentForm } from '@/components/payu-payment-form'

interface Player {
  name: string
  dateOfBirth: string
  age: number
  gender: string
  mobile: string
  email: string
  idProof: string
  photo: File | null
}

interface TeamRegistration {
  teamName: string
  category: string
  player1: Player
  player2: Player
  preferredVenue: string
  amount: number
  bookingId: string
}

interface BadmintonTournamentFormProps {
  event: any
  onRegistrationComplete: (success: boolean, registrationId?: string) => void
}

const AGE_CATEGORIES = {
  'kids-boys': { name: 'Kids (7-9 years) - Boys', price: 100, minAge: 7, maxAge: 9, gender: 'male' },
  'kids-girls': { name: 'Kids (7-9 years) - Girls', price: 100, minAge: 7, maxAge: 9, gender: 'female' },
  'juniors-boys': { name: 'Juniors (10-14 years) - Boys', price: 200, minAge: 10, maxAge: 14, gender: 'male' },
  'juniors-girls': { name: 'Juniors (10-14 years) - Girls', price: 200, minAge: 10, maxAge: 14, gender: 'female' },
  'adults-men': { name: 'Adults (15+ years) - Men\'s', price: 400, minAge: 15, maxAge: 100, gender: 'male' },
  'adults-women': { name: 'Adults (15+ years) - Women\'s', price: 400, minAge: 15, maxAge: 100, gender: 'female' }
}

export function BadmintonTournamentForm({ event, onRegistrationComplete }: BadmintonTournamentFormProps) {
  const [currentStep, setCurrentStep] = useState<'team' | 'players' | 'payment' | 'confirmation'>('team')
  const [registration, setRegistration] = useState<TeamRegistration>({
    teamName: '',
    category: '',
    player1: {
      name: '',
      dateOfBirth: '',
      age: 0,
      gender: '',
      mobile: '',
      email: '',
      idProof: '',
      photo: null
    },
    player2: {
      name: '',
      dateOfBirth: '',
      age: 0,
      gender: '',
      mobile: '',
      email: '',
      idProof: '',
      photo: null
    },
    preferredVenue: '',
    amount: 0,
    bookingId: ''
  })

  useEffect(() => {
    // Generate booking ID
    const generateBookingId = () => {
      const timestamp = Date.now().toString()
      const random = Math.random().toString(36).substring(2, 8)
      return `BT${timestamp}${random}`.toUpperCase()
    }
    setRegistration(prev => ({ ...prev, bookingId: generateBookingId() }))
  }, [])

  useEffect(() => {
    // Calculate age from date of birth
    const calculateAge = (dateOfBirth: string) => {
      if (!dateOfBirth) return 0
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    }

    setRegistration(prev => ({
      ...prev,
      player1: { ...prev.player1, age: calculateAge(prev.player1.dateOfBirth) },
      player2: { ...prev.player2, age: calculateAge(prev.player2.dateOfBirth) }
    }))
  }, [registration.player1.dateOfBirth, registration.player2.dateOfBirth])

  useEffect(() => {
    // Update amount based on category
    if (registration.category && AGE_CATEGORIES[registration.category as keyof typeof AGE_CATEGORIES]) {
      const category = AGE_CATEGORIES[registration.category as keyof typeof AGE_CATEGORIES]
      setRegistration(prev => ({ ...prev, amount: category.price }))
    }
  }, [registration.category])

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (registration.teamName && registration.category) {
      setCurrentStep('players')
    }
  }

  const handlePlayersSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (registration.player1.name && registration.player2.name) {
      setCurrentStep('payment')
    }
  }

  const handlePaymentComplete = (success: boolean, transactionId?: string) => {
    if (success) {
      setCurrentStep('confirmation')
      onRegistrationComplete(true, transactionId)
    }
  }

  const validateAgeCategory = (age: number, category: string) => {
    if (!category || !AGE_CATEGORIES[category as keyof typeof AGE_CATEGORIES]) return true
    const cat = AGE_CATEGORIES[category as keyof typeof AGE_CATEGORIES]
    return age >= cat.minAge && age <= cat.maxAge
  }

  const getCategoryPrice = (category: string) => {
    return AGE_CATEGORIES[category as keyof typeof AGE_CATEGORIES]?.price || 0
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center ${currentStep === 'team' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            1
          </div>
          <span className="ml-2">Team Details</span>
        </div>
        <div className={`flex items-center ${currentStep === 'players' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'players' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            2
          </div>
          <span className="ml-2">Player Info</span>
        </div>
        <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            3
          </div>
          <span className="ml-2">Payment</span>
        </div>
        <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            4
          </div>
          <span className="ml-2">Confirm</span>
        </div>
      </div>

      {/* Step 1: Team Registration */}
      {currentStep === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badminton className="w-5 h-5" />
              🏸 Team Registration Details
            </CardTitle>
            <CardDescription>
              Enter your team information and select the tournament category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTeamSubmit} className="space-y-6">
              <div>
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  required
                  value={registration.teamName}
                  onChange={(e) => setRegistration(prev => ({ ...prev, teamName: e.target.value }))}
                  placeholder="Enter your team name"
                />
              </div>

              <div>
                <Label htmlFor="category">Team Category *</Label>
                <Select
                  value={registration.category}
                  onValueChange={(value) => setRegistration(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kids-boys">Kids (7-9 years) - Boys - ₹100</SelectItem>
                    <SelectItem value="kids-girls">Kids (7-9 years) - Girls - ₹100</SelectItem>
                    <SelectItem value="juniors-boys">Juniors (10-14 years) - Boys - ₹200</SelectItem>
                    <SelectItem value="juniors-girls">Juniors (10-14 years) - Girls - ₹200</SelectItem>
                    <SelectItem value="adults-men">Adults (15+ years) - Men's - ₹400</SelectItem>
                    <SelectItem value="adults-women">Adults (15+ years) - Women's - ₹400</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredVenue">Preferred Venue (Optional)</Label>
                <Input
                  id="preferredVenue"
                  value={registration.preferredVenue}
                  onChange={(e) => setRegistration(prev => ({ ...prev, preferredVenue: e.target.value }))}
                  placeholder="Enter preferred venue or area"
                />
              </div>

              <Button type="submit" className="w-full" disabled={!registration.teamName || !registration.category}>
                Continue to Player Details
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Player Details */}
      {currentStep === 'players' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                👤 Player Details
              </CardTitle>
              <CardDescription>
                Enter information for both team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlayersSubmit} className="space-y-8">
                {/* Player 1 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">Player 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="player1Name">Full Name *</Label>
                      <Input
                        id="player1Name"
                        required
                        value={registration.player1.name}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player1: { ...prev.player1, name: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player1Dob">Date of Birth *</Label>
                      <Input
                        id="player1Dob"
                        type="date"
                        required
                        value={registration.player1.dateOfBirth}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player1: { ...prev.player1, dateOfBirth: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player1Age">Age</Label>
                      <Input
                        id="player1Age"
                        type="number"
                        value={registration.player1.age}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="player1Gender">Gender *</Label>
                      <Select
                        value={registration.player1.gender}
                        onValueChange={(value) => setRegistration(prev => ({
                          ...prev,
                          player1: { ...prev.player1, gender: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="player1Mobile">Mobile Number *</Label>
                      <Input
                        id="player1Mobile"
                        type="tel"
                        required
                        value={registration.player1.mobile}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player1: { ...prev.player1, mobile: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player1Email">Email (Optional)</Label>
                      <Input
                        id="player1Email"
                        type="email"
                        value={registration.player1.email}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player1: { ...prev.player1, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player1IdProof">ID Proof (Optional)</Label>
                      <Input
                        id="player1IdProof"
                        value={registration.player1.idProof}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player1: { ...prev.player1, idProof: e.target.value }
                        }))}
                        placeholder="Aadhaar/PAN/Other"
                      />
                    </div>
                  </div>
                </div>

                {/* Player 2 */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-blue-600">Player 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="player2Name">Full Name *</Label>
                      <Input
                        id="player2Name"
                        required
                        value={registration.player2.name}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player2: { ...prev.player2, name: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player2Dob">Date of Birth *</Label>
                      <Input
                        id="player2Dob"
                        type="date"
                        required
                        value={registration.player2.dateOfBirth}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player2: { ...prev.player2, dateOfBirth: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player2Age">Age</Label>
                      <Input
                        id="player2Age"
                        type="number"
                        value={registration.player2.age}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="player2Gender">Gender *</Label>
                      <Select
                        value={registration.player2.gender}
                        onValueChange={(value) => setRegistration(prev => ({
                          ...prev,
                          player2: { ...prev.player2, gender: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="player2Mobile">Mobile Number *</Label>
                      <Input
                        id="player2Mobile"
                        type="tel"
                        required
                        value={registration.player2.mobile}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player2: { ...prev.player2, mobile: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player2Email">Email (Optional)</Label>
                      <Input
                        id="player2Email"
                        type="email"
                        value={registration.player2.email}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player2: { ...prev.player2, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="player2IdProof">ID Proof (Optional)</Label>
                      <Input
                        id="player2IdProof"
                        value={registration.player2.idProof}
                        onChange={(e) => setRegistration(prev => ({
                          ...prev,
                          player2: { ...prev.player2, idProof: e.target.value }
                        }))}
                        placeholder="Aadhaar/PAN/Other"
                      />
                    </div>
                  </div>
                </div>

                {/* Age Validation Warning */}
                {registration.category && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Age Category Requirements</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>Category: {AGE_CATEGORIES[registration.category as keyof typeof AGE_CATEGORIES]?.name}</p>
                      <p>Age Range: {AGE_CATEGORIES[registration.category as keyof typeof AGE_CATEGORIES]?.minAge} - {AGE_CATEGORIES[registration.category as keyof typeof AGE_CATEGORIES]?.maxAge} years</p>
                      {(!validateAgeCategory(registration.player1.age, registration.category) || !validateAgeCategory(registration.player2.age, registration.category)) && (
                        <p className="text-red-600 font-semibold">⚠️ One or both players don't meet the age requirements for this category!</p>
                      )}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!registration.player1.name || !registration.player2.name}>
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 'payment' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              💵 Payment Details
            </CardTitle>
            <CardDescription>
              Complete your tournament registration by making the payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PayUPaymentForm
              bookingData={{
                eventId: event.$id,
                eventName: event.name,
                attendeeName: registration.player1.name,
                attendeeEmail: registration.player1.email || registration.player1.mobile,
                attendeePhone: registration.player1.mobile,
                attendeeGender: registration.player1.gender,
                attendeeAge: registration.player1.age,
                attendeeAddress: registration.preferredVenue,
                ticketType: registration.category,
                quantity: 1,
                amount: registration.amount,
                bookingId: registration.bookingId
              }}
              onPaymentComplete={handlePaymentComplete}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 'confirmation' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">🎉 Registration Confirmed!</CardTitle>
            <CardDescription>
              Your badminton tournament registration has been successfully completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200">Registration Details</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Registration ID: {registration.bookingId}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">🏸 Team Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Team Name:</strong> {registration.teamName}</p>
                  <p><strong>Category:</strong> {AGE_CATEGORIES[registration.category as keyof typeof AGE_CATEGORIES]?.name}</p>
                  <p><strong>Amount Paid:</strong> ₹{registration.amount}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">📅 Tournament Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Event:</strong> {event.name}</p>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <p><strong>Reporting Time:</strong> {event.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">👥 Player Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Player 1</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {registration.player1.name}</p>
                    <p><strong>Age:</strong> {registration.player1.age} years</p>
                    <p><strong>Mobile:</strong> {registration.player1.mobile}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Player 2</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {registration.player2.name}</p>
                    <p><strong>Age:</strong> {registration.player2.age} years</p>
                    <p><strong>Mobile:</strong> {registration.player2.mobile}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Important Information</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please arrive 30 minutes before the reporting time</li>
                <li>• Bring your own badminton rackets and sports shoes</li>
                <li>• Carry a valid ID proof for verification</li>
                <li>• Water and refreshments will be provided</li>
                <li>• Tournament schedule will be shared via SMS/Email</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 