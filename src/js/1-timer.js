import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');

const valueDays = document.querySelector('[data-days]');
const valueHours = document.querySelector('[data-hours]');
const valueMin = document.querySelector('[data-minutes]');
const valueSec = document.querySelector('[data-seconds]');

let userSelectedDate;
startBtn.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = !true;
    }
  },
};
flatpickr(datetimePicker, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  datetimePicker.disabled = true;
  const timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate.getTime() - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      valueDays.textContent = '00';
      valueHours.textContent = '00';
      valueMin.textContent = '00';
      valueSec.textContent = '00';

      datetimePicker.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    valueDays.textContent = addLeadingZero(days);
    valueHours.textContent = addLeadingZero(hours);
    valueMin.textContent = addLeadingZero(minutes);
    valueSec.textContent = addLeadingZero(seconds);
  }, 1000);
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
