import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingWidget from './BookingWidget'
import PlaceGallery from '../PlaceGallery'
import AddressLink from '../AdressLink'

export default function PlacePage() {
  const [place, setPlace] = useState(null)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/places/' + id).then((res) => {
      setPlace(res.data)
    })
  }, [id])

  if (!place) return

  if (showAllPhotos) {
    return (
      <div className='absolute inset-0 bg-black text-white min-h-screen'>
        <div className='bg-black p-8 grid gap-4'>
          <div>
            <h2 className='text-3xl mr-48'>Photos of{place.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className='fixed right-12 top-8 flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black font-semibold'
            >
              {xIcon}Close photos
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div>
                <img src={'http://localhost:4000/uploads/' + photo} alt='' />
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className='mt-4 bg-gray-200 -mx-8 px-8 pt-8'>
      <h1 className='text-3xl'>{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className='mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]'>
        <div>
          <div className='my-4'>
            <h2 className='font-semibold text-2xl'>Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}
          <br />
          Check-out: {place.checkOut} <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className='bg-white -mx-8 px-8 py-8 border-t'>
        <div>
          <h2 className='font-semibold text-2xl'>Extra info</h2>
        </div>
        <div className='mb-4 mt-2 text-sm text-gray-600 leading-5'>
          {place.extraInfo}
        </div>
      </div>
    </div>
  )
}
