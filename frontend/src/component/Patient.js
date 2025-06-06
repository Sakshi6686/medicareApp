import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Patient = ({ patient }) => {
  const navigate = useNavigate();
  const [timeUntilChat, setTimeUntilChat] = useState('');
  const [canChat, setCanChat] = useState(false);
  const [appointmentDateTime, setAppointmentDateTime] = useState(null);
  const [appointmentEndTime, setAppointmentEndTime] = useState(null);

  useEffect(() => {
    if (patient && patient.appointment) {
   
      const appointmentStart = moment(patient.appointment.time); 
      const appointmentEnd = moment(appointmentStart).add(1, 'hour');

      setAppointmentDateTime(appointmentStart);
      setAppointmentEndTime(appointmentEnd);

      const interval = setInterval(() => {
        const now = moment();

        if (now.isBefore(appointmentStart)) {
          const duration = moment.duration(appointmentStart.diff(now));
          setTimeUntilChat(formatDuration(duration));
          setCanChat(false);
        } else if (now.isSameOrAfter(appointmentStart) && now.isBefore(appointmentEnd)) {
          setCanChat(true);
          setTimeUntilChat('');
        } else {
          setCanChat(false);
          setTimeUntilChat('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [patient]);

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/chat-bot/${patient._id}`);
  };

  const formatDuration = (duration) => {
    if (duration.days() > 0) return `${duration.days()}d`;
    if (duration.hours() > 0) return `${duration.hours()}h ${duration.minutes()}m`;
    if (duration.minutes() > 0) return `${duration.minutes()}m ${duration.seconds()}s`;
    return `${duration.seconds()}s`;
  };

  const renderTimeMessage = () => {
    const now = moment();
    if (!appointmentDateTime || !appointmentEndTime) return null;

    if (now.isBefore(appointmentDateTime)) {
      return <div className="timer">Chat available in: {timeUntilChat}</div>;
    } else if (now.isAfter(appointmentEndTime)) {
      const duration = moment.duration(now.diff(appointmentEndTime));
      return <div className="timer">Appointment ended: {formatDuration(duration)} ago</div>;
    }
    return null;
  };

  return (
    <div className='card p-2 cursor-pointer'>
      <h1 className="card-title">{patient.username}</h1>
      <hr />

      {renderTimeMessage()}

      {canChat && (
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
