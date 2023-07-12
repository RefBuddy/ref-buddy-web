import React, { useState, useEffect } from 'react';
import Datepicker from "tailwind-datepicker-react"
import TimePicker from 'rc-time-picker';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import 'rc-time-picker/assets/index.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Select } from '../../Select';
import { teamNames } from '../../../constants/TeamNames';
import { Button } from '../../Button';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addGame, fetchGamesByMonth } from '../../../store/Games/actions';

const options = {
  title: "",
  autoHide: true,
  todayBtn: false,
  clearBtn: false,
  theme: {
    background: "bg-white",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    input: "datepicker-input",
    inputIcon: "",
    selected: "",
  },
  icons: {
    prev: () => <ChevronLeftIcon className="h-6 w-6"/>,
    next: () => <ChevronRightIcon className="h-6 w-6"/>,
  },
  datepickerClassNames: "center-datepicker",
  defaultDate: new Date(),
  language: "en",
};

const HomeTeamField = {
  key: 'homeTeam',
  label: 'Home Team',
  required: true,
  options: [...Object.keys(teamNames)],
}

const VisitingTeamField = {
  key: 'visitingTeam',
  label: 'Visiting Team',
  required: true,
  options: [...Object.keys(teamNames)],
}

const League = {
  key: 'league',
  label: 'League',
  required: true,
  options: ['bchl'],
}

const Season = {
  key: 'season',
  label: 'Season',
  required: true,
  options: ['2023-2024', '2022-2023'],
}

const CreateGame = ({ onClose }: { onClose: () => void}) => {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [homeTeam, setHomeTeam] = useState<Team | null>(teamNames[HomeTeamField.options[0]]);
  const [visitingTeam, setVisitingTeam] = useState<Team | null>(teamNames[VisitingTeamField.options[1]]);
  const [league, setLeague] = useState<string | null>(League.options[0]);
  const [season, setSeason] = useState<string | null>(Season.options[0]);
  const [show, setShow] = useState(false);
  
  const successfullyAddedGame = useAppSelector(state => state.games.savedNewGame);

  useEffect(() => {
    if (successfullyAddedGame) {
      toast('Game successfully added!', {
        type: 'success',
      });
      dispatch(fetchGamesByMonth());
      onClose();
    }
   
  }, [successfullyAddedGame])

  const onTeamSelect = (key, teamValue) => {
    const team = teamNames[teamValue];
    if (key === 'homeTeam') {
      setHomeTeam(team);
    } else {
      setVisitingTeam(team);
    }
  }

  const onSave = () => {
    const timezone = homeTeam && homeTeam.abbreviation === 'CRA' ? 'America/Denver' : 'America/Los_Angeles';
      let ISO = "";
      if (selectedTime && selectedDate) {
        // Create a moment object from the selected time
        const selectedMoment = moment(selectedTime);
        // Combine date from selectedDate and time from selectedTime
        selectedDate.setHours(selectedMoment.hours());
        selectedDate.setMinutes(selectedMoment.minutes());
        selectedDate.setSeconds(selectedMoment.seconds());
  
        // Create a moment object from the combined date and time and format it to an ISO string in the correct timezone
        ISO = moment(selectedDate).tz(timezone).format();
      } else {
        // If selectedTime is null, just convert the selected date to an ISO string
        ISO = moment(selectedDate).tz(timezone).format();
      }

    const data: AddGameRequestData = {
      league: league!,
      season: season!,
      homeTeam: homeTeam!,
      visitingTeam: visitingTeam!,
      dateISO8601: ISO
    }

    dispatch(addGame(data));
  }
  
  return (
    <div className="flex flex-col gap-3 mx-auto py-8">
      <div className="flex flex-row items-center gap-2 w-full" onClick={onClose}>
        <ChevronLeftIcon className="h-6 w-6 bg-black text-white rounded-full"/>
        Back
      </div>
      <h1>Create and schedule a new game</h1>
      <Select
        field={HomeTeamField}
        value={homeTeam ? homeTeam.team_name : ''}
        onChange={(value) => onTeamSelect('homeTeam', value)}
      />
      <Select
        field={VisitingTeamField}
        value={visitingTeam ? visitingTeam.team_name : ''}
        onChange={(value) => onTeamSelect('visitingTeam', value)}
      />
      <label className="block text-xs mb-2 font-medium text-gray-500">
        Date *
      </label>
      <Datepicker
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        options={options}
        show={show}
        setShow={setShow}
      />
      <label className="block text-xs mb-2 font-medium text-gray-500">
        Time *
      </label>
      <TimePicker
        onChange={(time) => setSelectedTime(time && time.toDate())}
        value={selectedTime ? moment(selectedTime) : undefined}
        showSecond={false}
        format="h:mm a"
        use12Hours={true}
      />
      <Select
        field={League}
        value={league ? league : ''}
        onChange={(value) => setLeague(value)}
      />
      <Select
        field={Season}
        value={season ? season : ''}
        onChange={(value) => setSeason(value)}
      />

      <Button
        disabled={!league || !season || !homeTeam || !visitingTeam || !selectedDate || !selectedTime}
        onClick={onSave}
      >
        Create New Game
      </Button>
    </div>
  )
}

export default CreateGame;
