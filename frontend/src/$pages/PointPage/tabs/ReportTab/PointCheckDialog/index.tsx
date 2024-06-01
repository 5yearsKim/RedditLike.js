// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { Dialog, Box } from '@mui/material';
// import { Row, Txt } from '@/styles/custom';
// import {PointImage} from '@/styles/images'

// const AnimatedNumber = dynamic(() => import('react-animated-numbers'), {
//   ssr: false,
// });

// type PointCheckDialogProps = {
//   newPoints: number
// }

// export function PointCheckDialog(props: PointCheckDialogProps): JSX.Element {
//   const {
//     newPoints,
//   } = props;

//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   useEffect(() => {
//     if (newPoints > 0) {
//       setIsOpen(true);
//     }
//   }, []);

//   return (
//     <Dialog
//       open={isOpen}
//       maxWidth='sm'
//       fullWidth
//     >
//       <Box p={2}>
//         <Row>
//           <Txt variant='h6'>today point: </Txt>
//           <AnimatedNumber
//             fontStyle={{
//               fontSize: 16,
//               fontWeight: 700,
//             }}
//             animateToNumber={newPoints}
//             includeComma
//             locale='en-US'
//             configs={[{ tension: 100, friction: 30 }]}
//           />
//           <PointImage fontSize={16}/>
//         </Row>

//       </Box>
//     </Dialog>
//   );
// }
