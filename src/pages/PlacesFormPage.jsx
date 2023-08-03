import React, { useEffect, useState } from 'react'
import PhotosUploader from './PhotosUploader'
import Perks from './Perks'
import AccountNav from './AccountNav'
import { Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function PlacesFormPage() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [addedPhotos, setAddedPhotos] = useState([])
  const [description, setDescription] = useState('')
  const [perks, setPerks] = useState([])
  const [extraInfo, setExtraInfo] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [maxGuests, setMaxGuests] = useState(1)
  const [redirect, setRedirect] = useState(false)
  const [price, setPrice] = useState(100)

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/places/' + id).then((response) => {
      const { data } = response
      setTitle(data.title)
      setAddress(data.address)
      setAddedPhotos(data.photos)
      setDescription(data.description)
      setPerks(data.perks)
      setExtraInfo(data.extraInfo)
      setCheckIn(data.checkIn)
      setCheckOut(data.checkOut)
      setMaxGuests(data.maxGuests)
      setPrice(data.price)
    })
  }, [id])

  function inputHeader(text) {
    return <h2 className='text-2xl mt-4'>{text}</h2>
  }
  function inputDescription(text) {
    return <p className='text-gray-500 text-sm'>{text}</p>
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    )
  }
  async function savePlace(e) {
    e.preventDefault()
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    }
    if (id) {
      // update
      await axios.put('/places', {
        id,
        ...placeData,
      })
    } else {
      // new place
      await axios.post('/places', placeData)
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          'Title',
          'title for your place. should be catchy as in advertisement '
        )}
        <input
          type='text'
          placeholder='title, for example: My lovely apartment'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {preInput('Address', 'address for this place')}
        <input
          type='text'
          placeholder='address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {preInput('Photos', 'more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput('Description', 'description of the place')}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {preInput('Perks', 'select all the perks of your place')}
        <div className='mt-2 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra info', 'house rules, etc')}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        {preInput(
          'Check in&out times, max guests',
          'add check in&out times, remember to have some time for cleaning the room between guests'
        )}
        <div className='gap-2 grid grid-cols-2 md:grid-cols-4'>
          <div>
            <h3 className='mt-2 -mb-1'>Check in time</h3>
            <input
              type='text'
              placeholder='14'
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3 className='mt-2 -mb-1'>Check out time</h3>
            <input
              type='text'
              placeholder='11'
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3 className='mt-2 -mb-1'>Max number of guests</h3>
            <input
              type='number'
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3 className='mt-2 -mb-1'>Price per night</h3>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button className='primary my-4'>Save</button>
        </div>
      </form>
    </div>
  )
}