import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface WobbleBoxProps extends BoxProps {
  focused: boolean;
}

export const WobbleBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "focused",
})<WobbleBoxProps>(
  ({ focused }) => `
@keyframes wobble {
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
animation: ${focused ? "wobble 1s ease-out" : ""}
`,
);
// {
//   return {
//     '@keyframes wobble': {
//       from: { backgroundColor: alpha('#ffff00', 0.3) },
//       to: { backgroundColor: 'transparent' },
//     },
//   };
// });
