import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Patient = ({ patient }) => {
    const navigate = useNavigate();
    const [timeUntilChat, setTimeUntilChat] = useState('');
    const [canChat, setCanChat] = useState(false);
    const [appointmentEndTime, setAppointmentEndTime] = useState(null);

    useEffect(() => {
        if (patient && patient.appointment) {
            const appointmentDate = moment(patient.appointment.date);
            const appointmentTime = moment(patient.appointment.time, 'HH:mm:ss');
            const appointmentDateTime = appointmentDate.set({
                hour: appointmentTime.get('hour'),
                minute: appointmentTime.get('minute'),
                second: appointmentTime.get('second'),
            });

           
            const oneHourAfterAppointment = moment(appointmentDateTime).add(1, 'hour');
            setAppointmentEndTime(oneHourAfterAppointment);

         
            const now = moment();
            if (now.isBefore(appointmentDateTime)) {
                const interval = setInterval(() => {
                    const now = moment();
                    const duration = moment.duration(appointmentDateTime.diff(now));
                    if (now.isAfter(appointmentDateTime)) {
                        setCanChat(true);
                        clearInterval(interval);
                    } else {
                        setTimeUntilChat(formatTimeUntilChat(duration));
                    }
                }, 1000);

                return () => clearInterval(interval);
            } else {
                setCanChat(true);
            }
        }
    }, [patient]);

    const handleChatClick = (e) => {
        e.stopPropagation();
        navigate(`/chat-bot/${patient._id}`);
    };
 
    const formatTimeUntilChat = (duration) => {
        if (duration.days() >= 1) {
            return `${duration.days()}d ago`;
        } else if (duration.hours() >= 1) {
            return `${duration.hours()}h ago`;
        } else if (duration.minutes() >= 1) {
            return `${duration.minutes()}m ago`;
        } else {
            return `${duration.seconds()}s ago`;
        }
    };

   
    const calculateTimeElapsed = () => {
        if (appointmentEndTime) {
            const now = moment();
            const duration = moment.duration(now.diff(appointmentEndTime));
            if (duration.asDays() >= 7) {
                return `${Math.floor(duration.asDays() / 7)}w ago`;
            } else if (duration.asDays() >= 30) {
                return `${Math.floor(duration.asDays() / 30)}mo ago`;
            } else if (duration.asDays() >= 365) {
                return `${Math.floor(duration.asDays() / 365)}y ago`;
            } else {
                return formatTimeUntilChat(duration);
            }
        }
        return '';
    };

    return (
        <div className='card p-2 cursor-pointer'>
            <h1 className="card-title">{patient.username}</h1>
            <hr />
            {!canChat && (
            <div className="timer">
              Chat available in: {timeUntilChat}
            </div>
          )}
          {canChat && appointmentEndTime && (
            <div className="timer">
              Appointment ended: {calculateTimeElapsed()}  
            </div>
          )}
          {canChat && !appointmentEndTime && (
            <Button
              className="primary-button mt-3 full-width-button"
              onClick={handleChatClick}
            >
              Chat with Patient
            </Button>
          )}
        </div>
    );
};

export default Patient;
