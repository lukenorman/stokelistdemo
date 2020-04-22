//eslint-disable-next-line
import React from 'react'
//eslint-disable-next-line
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import validator from 'email-validator'
import { Map, TileLayer, Marker } from 'react-leaflet'

import { Title } from '../shared/Text'
import { BigGreyButton } from '../shared/Buttons'
import { Label, Input } from '../shared/Forms'

const Description = styled.textarea``

const SubLabel = styled.span`
    font-weight: normal;
    font-size: 12px;
`

const MapContainer = styled.div`
    height: 350px;
    width: 60%;
    margin: 1em 0;
`

function PostCreate() {
    const { register, handleSubmit, errors, setValue, watch } = useForm() // initialise the hook
    const onSubmit = async (data) => {
        //TODO: Sanitize these inputs as could be html?
        let title = data.title
        let description = data.description
        let price =
            data.price === ''
                ? data.priceRadio === 'priceFree'
                    ? 'Free'
                    : ''
                : data.price
        let location = data.location
        let exactLocation =
            data.lng !== '' && data.lat !== ''
                ? {
                      type: 'Point',
                      coordinates: [data.lng, data.lat],
                  }
                : null
        let email = data.email
        const postData = {
            title,
            description,
            price,
            location,
            exactLocation,
            email,
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData), // body data type must match "Content-Type" header
        })
        if (response.status === 200) {
            //TODO: Show posting confirmation as per modal in design, then redirect to latest posts
            console.log('New post successfully submitted')
        } else {
            //TODO: Show posting error
            console.log('New post error: ' + response.status)
        }
    }

    const position = [50.9981, -118.1957]

    const updatePriceForm = (e) => {
        if (e.target.checked) {
            //A price radio box was checked, so clear price text field
            setValue('price', '')
        } else {
            //Text was entered, so clear both price radio boxes
            setValue('priceRadio', null)
        }
    }

    const updateLocation = async (e) => {
        try {
            const location = e.target.getLatLng()
            setValue('lat', location.lat)
            setValue('lng', location.lng)
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse.php?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=0`
            )
            const json = await res.json()
            const displayName = json.display_name.split(',')
            let suggestion = displayName[0]
            //If the suggestion is just a street number, get the second bit too
            if (!isNaN(suggestion)) {
                suggestion = displayName[0] + displayName[1]
            }
            setValue('location', suggestion)
        } catch {
            //Do nothing, if any of this fails just don't update the text
        }
    }

    const validatePrice = () => {
        const price = watch('price')
        const priceRadio = watch('priceRadio')
        //Validation fails if there is no price entered, nor a radio button selected
        return !(price === '' && priceRadio === '')
    }

    const validateEmail = () => {
        const email = watch('email')
        return validator.validate(email)
    }

    return (
        <div>
            <Title>Create Post</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Label>Post Title</Label>
                <Input
                    name="title"
                    placeholder="50 characters max"
                    ref={register({ required: true, maxLength: 50 })}
                />
                {errors.title &&
                    errors.title.type === 'required' &&
                    'Title is required.'}
                {errors.title &&
                    errors.title.type === 'maxLength' &&
                    'Title has a max length of 50 characters.'}
                {/*TODO: Garage Sale?*/}
                <Label>Post Description</Label>
                <Description
                    rows="10"
                    cols="80"
                    name="description"
                    ref={register({ required: true })}
                />
                {errors.description && 'Description is required.'}
                {/*TODO: Images/Media*/}
                <Label>Add a Price</Label>
                $
                <Input
                    type="numeric"
                    name="price"
                    ref={register({ validate: validatePrice })}
                    onChange={updatePriceForm}
                />
                <Input
                    type="radio"
                    name="priceRadio"
                    value="priceNA"
                    ref={register()}
                    onChange={updatePriceForm}
                />
                Not Applicable
                <Input
                    type="radio"
                    name="priceRadio"
                    value="priceFree"
                    ref={register()}
                    onChange={updatePriceForm}
                />
                Free
                <br />
                {errors.price && 'Enter a price or select an option'}
                <Label>Add Location</Label>
                <Input name="location" ref={register} />
                <Input type="hidden" name="lat" ref={register} />
                <Input type="hidden" name="lng" ref={register} />
                <MapContainer>
                    <Map
                        center={position}
                        zoom={13}
                        style={{ height: '350px' }}
                    >
                        <TileLayer
                            name="OSM Base Map"
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            draggable={true}
                            onDragend={updateLocation}
                            position={position}
                        />
                    </Map>
                </MapContainer>
                <Label>
                    Your Contact Email
                    <SubLabel> - This will not be published</SubLabel>
                </Label>
                <Input
                    type="email"
                    name="email"
                    ref={register({ required: true, validate: validateEmail })}
                />
                {errors.email &&
                    errors.email.type === 'required' &&
                    'Email is required.'}
                {errors.email &&
                    errors.email.type === 'validate' &&
                    'Must be an email address.'}
                {/*TODO: Captcha*/}
                {/*TODO: Terms of Service */}
                <BigGreyButton type="submit">Submit</BigGreyButton>
            </form>
        </div>
    )
}

export default PostCreate