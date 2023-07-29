import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Perks from './Perks'
import axios from 'axios'

export default function PlacePage() {
  const { action } = useParams()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [addedPhotos, setAddedPhotos] = useState([])
  const [photoLink, setPhotoLink] = useState('')
  const [description, setDescription] = useState('')
  const [perks, setPerks] = useState([])
  const [extraInfo, setExtraInfo] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [maxGuests, setMaxGuests] = useState(1)

  const plusIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 4.5v15m7.5-7.5h-15'
      />
    </svg>
  )
  const uploadIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-8 h-8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z'
      />
    </svg>
  )

  function inputHeader(text) {
    return <h2 className='text-2xl mt-4'>{text}</h2>
  }

  function inputDecription(text) {
    return <p className='text-gray-500 text-sm'>{text}</p>
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDecription(description)}
      </>
    )
  }

  async function addPhotoByLink(e) {
    e.preventDefault()
    const { data: filename } = await axios.post('/upload-by-link', {
      link: photoLink,
    })
    setAddedPhotos((prev) => {
      return [...prev, filename]
    })
    setPhotoLink('')
  }

  function uploadPhoto(e) {
    const files = e.target.files
    const data = new FormData()
    // for (let i in files) {
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i])
    }
    axios
      .post('/upload', data, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then((res) => {
        const { data: filenames } = res
        setAddedPhotos((prev) => {
          return [...prev, ...filenames]
        })
      })
  }

  return (
    <div>
      {action !== 'new' && (
        <div className='text-center mt-6'>
          <Link
            className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full'
            to={'/account/places/new'}
          >
            Add new place
            {plusIcon}
          </Link>
        </div>
      )}
      {action === 'new' && (
        <div>
          <form>
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
            {preInput('Photos', 'more - better')}
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder="Add using a link  '....jpg'"
                value={photoLink}
                onChange={(e) => setPhotoLink(e.target.value)}
              />
              <button
                className='bg-gray-200 px-4 rounded-2xl'
                onClick={addPhotoByLink}
              >
                Add photo
              </button>
            </div>
            <div className='mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
              {addedPhotos.length > 0 &&
                addedPhotos.map((link) => (
                  <div className='h-32'>
                    <img
                      className='rounded-2xl'
                      src={'http://localhost:4000/uploads/' + link}
                      alt=''
                    />
                  </div>
                ))}
              <label className='h-32 cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600'>
                <input
                  type='file'
                  multiple
                  className='hidden'
                  onChange={uploadPhoto}
                />
                {uploadIcon}Upload
              </label>
            </div>
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
            <div className='gap-2 grid sm:grid-cols-3'>
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
            </div>
            <div>
              <button className='primary my-4'>Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
