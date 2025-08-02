"use client"

import { use, useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, MapPin, Users, CreditCard, Badminton } from 'lucide-react'
import Link from 'next/link'
import { eventsApi, Event } from '@/lib/api/events'
import { BadmintonTournamentForm } from '@/components/badminton-tournament-form'

interface BookingPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true)
        const eventData = await eventsApi.getById(id)
        if (eventData) {
          setEvent(eventData)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Error loading event:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading tournament details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleRegistrationComplete = (success: boolean, registrationId?: string) => {
    if (success) {
      // Registration completed successfully
      console.log('Registration completed:', registrationId)
    }
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/events/${event.$id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tournament
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <BadmintonTournamentForm
              event={event}
              onRegistrationComplete={handleRegistrationComplete}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tournament Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badminton className="w-5 h-5" />
                  Tournament Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Reporting Time: {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{event.available_tickets} spots left</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Age Categories & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="w-5 h-5" />
                  Age Categories & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Kids (7-9 years)</h4>
                    <div className="flex justify-between text-sm">
                      <span>Boys / Girls</span>
                      <span className="font-semibold">₹100 per team</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800">Juniors (10-14 years)</h4>
                    <div className="flex justify-between text-sm">
                      <span>Boys / Girls</span>
                      <span className="font-semibold">₹200 per team</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Adults (15+ years)</h4>
                    <div className="flex justify-between text-sm">
                      <span>Men's / Women's</span>
                      <span className="font-semibold">₹400 per team</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="w-5 h-5" />
                  Tournament Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Doubles format - 2 players per team</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Age verification required on tournament day</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Bring your own rackets and sports shoes</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Knockout format with consolation rounds</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Prizes for winners and runners-up</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="w-5 h-5" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Tournament entry for both players</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Tournament T-shirt for both players</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Refreshments and water</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Professional refereeing</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Participation certificates</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 