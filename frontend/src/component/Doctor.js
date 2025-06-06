import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Doctor = ({ doctor, appointment, approved }) => {
  const navigate = useNavigate();
  const [timeUntilChat, setTimeUntilChat] = useState('');
  const [canChat, setCanChat] = useState(false);
  const [appointmentDateTime, setAppointmentDateTime] = useState(null);
  const [appointmentEndTime, setAppointmentEndTime] = useState(null);

  useEffect(() => {
    if (doctor && appointment && appointment.time) {
   
      const appointmentStart = moment(appointment.time); 
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
  }, [doctor, appointment]);

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/chat-bot/${doctor.userId}`, { state: { isDoctor: true } });
  };

  const formatDuration = (duration) => {
    const h = duration.hours();
    const m = duration.minutes();
    const s = duration.seconds();
    if (duration.days() > 0) return `${duration.days()}d`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
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
    <div
      className="card p-2 cursor-pointer"
      onClick={() => !approved && navigate(`/book-appointment/${doctor._id}`)}
    >
      <h1 className="card-title">
        {doctor.firstName} {doctor.lastName}
      </h1>
      <hr />
      <p><b>Phone Number: </b>{doctor.phoneNumber}</p>
      <p><b>Address: </b>{doctor.address}</p>
      <p><b>Fee per visit: </b>{doctor.feePerConsultation}</p>
      <p><b>Specialization: </b>{doctor.specialization}</p>

      {approved && (
        <>
          {renderTimeMessage()}

          {canChat && (
            <Button
              className="primary-button mt-3 full-width-button"
              onClick={handleChatClick}
            >
              Chat with Doctor
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Doctor;
