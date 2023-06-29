// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from './path-to-your-store'; // import your store here
// import { getOfficialsList } from './actions';
// import { useHistory } from 'react-router-dom';

// type Official = {
//   uid: string;
//   firstName: string;
//   lastName: string;
//   profilePictureUrl: string;
// };

// const OfficialsList: React.FC = () => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const { officialsList } = useSelector((state: RootState) => state.officials);
//   const [search, setSearch] = useState('');
//   const [filteredOfficials, setFilteredOfficials] = useState<Official[]>([]);

//   useEffect(() => {
//     dispatch(getOfficialsList({ league: 'bchl' }));
//   }, [dispatch]);

//   useEffect(() => {
//     const filtered = Object.values(officialsList).filter((official) =>
//       `${official.firstName} ${official.lastName}`.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredOfficials(filtered);
//   }, [officialsList, search]);

//   const handleProfileClick = (uid: string) => {
//     // Go to the profile route, passing along the UID
//     history.push(`/profile/${uid}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <input
//         className="border-2 border-gray-300 rounded p-2 m-2 w-1/2"
//         type="text"
//         placeholder="Search officials"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <div className="w-1/2">
//         {filteredOfficials.map((official) => (
//           <div
//             key={official.uid}
//             className="flex items-center border-2 border-gray-300 rounded p-2 m-2 cursor-pointer"
//             onClick={() => handleProfileClick(official.uid)}
//           >
//             <img
//               className="w-12 h-12 rounded mr-2"
//               src={official.profilePictureUrl}
//               alt={official.firstName}
//             />
//             <span>
//               {official.firstName} {official.lastName}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OfficialsList;
