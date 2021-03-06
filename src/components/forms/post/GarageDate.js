import React from 'react'

import { useMountEffect } from '../../../hooks'
import { Label, Input, FormError, InputContainer } from '../../shared/Forms'
import { getDatePortionForInput, getNextSaturday } from '../../../util/datetime'

function GarageDate({ errors, register, watch, setValue }) {
    
    //Initialize form to next saturday at 9am, if no value set in form when the component mounts
    useMountEffect(() => {
        if (!watch('startTime')) {
            const nextSaturday = getDatePortionForInput(getNextSaturday())
            //create start time for next Saturday
            setValue('garageDate', nextSaturday)
            setValue('startTime', '09:00')
        }
    })
    return (
        <InputContainer>
            <Label>When's it happening?</Label>
            From
            <Input
                type="time"
                name="startTime"
                ref={register({ required: true })}
            />
            To
            <Input
                type="time"
                name="endTime"
                ref={register({ required: true })}
            />
            On
            <Input
                type="date"
                name="garageDate"
                ref={register({ required: true })}
            />
            <FormError>
                {(errors.startTime || errors.endTime || errors.garageDate) &&
                    'Start time, Finish time and date are all required for a garage sale.'}
            </FormError>
        </InputContainer>
    )
}

export default GarageDate
