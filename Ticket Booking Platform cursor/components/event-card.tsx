"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, Star, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Event } from '@/lib/api/events'
import Image from 'next/image'

interface EventCardProps {
  event: Event
  showActions?: boolean
}

export default function EventCard({ event, showActions = true }: EventCardProps) {
  if (!event) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
      {/* Banner Section */}
      <div className="relative h-48 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
        {/* Light Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-300/40 to-transparent rounded-full blur-lg"></div>
        
        {/* Event Image or Default */}
        {event.image_url && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {/* Banner Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {event.category} #{parseInt(event.$id?.slice(-1)) || 1}
              </Badge>
              {event.featured && (
                <Badge variant="default" className="bg-yellow-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm font-medium">Hosted by</div>
              <div className="text-white font-semibold">Event Organizer</div>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="mt-4">
            <h3 className="text-white text-xl font-bold leading-tight line-clamp-2">
              {event.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6">
        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            }).toUpperCase()}</span>
            <span>•</span>
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{event.available_tickets} tickets left</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 line-clamp-2">
          {event.description}
        </p>
        
        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'}>
              {event.status}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-lg">₹{event.price}</span>
            </div>
          </div>
          
          {showActions && (
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/events/${event.$id || ''}`}>
                View Details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 