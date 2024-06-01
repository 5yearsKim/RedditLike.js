import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

// export function UpvoteIcon(props: SvgIconProps): JSX.Element {
//   return (
//     <SvgIcon {...props}>
//       <path d="M12.1091 6L23.0182 18H1.2L12.1091 6Z"/>
//     </SvgIcon>
//   );
// }

// export function DownvoteIcon(props: SvgIconProps): JSX.Element {
//   return (
//     <SvgIcon {...props}>
//       <path d="M12.1091 18L23.0182 6H1.2L12.1091 18Z"/>
//     </SvgIcon>
//   );
// }

export function NsfwIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.6066 4.22183L4.24264 10.5858C3.46159 11.3668 3.46159 12.6332 4.24264 13.4142L10.6066 19.7782C11.3877 20.5592 12.654 20.5592 13.435 19.7782L19.799 13.4142C20.58 12.6332 20.58 11.3668 19.799 10.5858L13.435 4.22183C12.654 3.44078 11.3877 3.44078 10.6066 4.22183ZM2.82843 9.17157C1.26633 10.7337 1.26633 13.2663 2.82843 14.8284L9.19239 21.1924C10.7545 22.7545 13.2871 22.7545 14.8492 21.1924L21.2132 14.8284C22.7753 13.2663 22.7753 10.7337 21.2132 9.17157L14.8492 2.80761C13.2871 1.24551 10.7545 1.24551 9.19239 2.80761L2.82843 9.17157Z'
      />
      <path d='M9 8.53333V16H10.4933V8.53333H9Z' />
      <path d='M11.3438 14.5067V16H15.8238V8.53333H11.3438V13.0133H14.3304V14.5067H11.3438ZM14.3304 11.52H12.8371V10.0267H14.3304V11.52Z' />
    </SvgIcon>
  );
}

export function ReportIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.9 11.4673V17.1H17.1V11.4792C17.0962 11.4603 17.0913 11.4368 17.0851 11.409C17.0637 11.3145 17.0272 11.1722 16.969 10.9983C16.8517 10.6481 16.6513 10.1843 16.3215 9.72477C15.6868 8.84047 14.5286 7.9 12.3158 7.9C9.97291 7.9 8.69431 8.574 7.97698 9.28791C7.26584 9.99566 6.9972 10.8511 6.9 11.4673ZM18 11.4L18.8909 11.2721L18.9 11.3357V18.9H5.1V11.3357L5.10913 11.2721C5.2307 10.4252 5.59989 9.11415 6.70723 8.01209C7.83201 6.89267 9.60604 6.1 12.3158 6.1C15.1556 6.1 16.8395 7.35953 17.7838 8.67523C18.2435 9.31571 18.5167 9.95186 18.6758 10.4267C18.7557 10.6653 18.808 10.8668 18.8409 11.0129C18.8574 11.0861 18.8692 11.1457 18.8772 11.1896C18.8811 11.2115 18.8842 11.2296 18.8864 11.2434L18.8892 11.261L18.8902 11.2674L18.8906 11.27L18.8907 11.2711C18.8908 11.2716 18.8909 11.2721 18 11.4Z'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 18.9C4.94477 18.9 4.9 18.9448 4.9 19V20C4.9 20.0552 4.94477 20.1 5 20.1H19C19.0552 20.1 19.1 20.0552 19.1 20V19C19.1 18.9448 19.0552 18.9 19 18.9H18V17.1H19C20.0493 17.1 20.9 17.9507 20.9 19V20C20.9 21.0493 20.0493 21.9 19 21.9H5C3.95066 21.9 3.1 21.0493 3.1 20V19C3.1 17.9507 3.95066 17.1 5 17.1H6V18.9H5Z'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 1.1C12.4971 1.1 12.9 1.50294 12.9 2V4C12.9 4.49705 12.4971 4.9 12 4.9C11.5029 4.9 11.1 4.49705 11.1 4V2C11.1 1.50294 11.5029 1.1 12 1.1ZM5.50077 2.25115C5.91435 1.97544 6.47313 2.08719 6.74885 2.50077L8.08218 4.50077C8.3579 4.91434 8.24614 5.47313 7.83256 5.74884C7.41899 6.02456 6.86021 5.9128 6.58449 5.49923L5.25116 3.49923C4.97544 3.08565 5.08719 2.52687 5.50077 2.25115ZM18.4992 2.25115C18.9128 2.52687 19.0246 3.08565 18.7488 3.49923L17.4155 5.49923C17.1398 5.9128 16.581 6.02456 16.1674 5.74884C15.7539 5.47313 15.6421 4.91434 15.9178 4.50077L17.2512 2.50077C17.5269 2.08719 18.0857 1.97544 18.4992 2.25115Z'
      />
    </SvgIcon>
  );
}

export function ChatIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <path d='M12.5 2C7.25332 2 3.00002 6.25329 3.00002 11.5C3.00002 13.146 3.41927 14.6961 4.1572 16.0473L3.03048 19.9908C2.94981 20.2732 3.03206 20.5771 3.24418 20.7802C3.45632 20.9832 3.76344 21.0523 4.04204 20.9593L7.74395 19.7254C9.14316 20.5361 10.7685 21 12.5 21C17.7467 21 22 16.7467 22 11.5C22 6.25329 17.7467 2 12.5 2ZM9.33333 9.91667C9.33333 9.47945 9.68778 9.125 10.125 9.125H14.875C15.3122 9.125 15.6667 9.47945 15.6667 9.91667C15.6667 10.3539 15.3122 10.7083 14.875 10.7083H10.125C9.68778 10.7083 9.33333 10.3539 9.33333 9.91667ZM10.125 12.2917H13.2917C13.7289 12.2917 14.0833 12.6461 14.0833 13.0833C14.0833 13.5206 13.7289 13.875 13.2917 13.875H10.125C9.68778 13.875 9.33333 13.5206 9.33333 13.0833C9.33333 12.6461 9.68778 12.2917 10.125 12.2917Z' />
    </SvgIcon>
  );
}

export function ChatOlIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <path d='M9.33334 9.91667C9.33334 9.47945 9.68778 9.125 10.125 9.125H14.875C15.3122 9.125 15.6667 9.47945 15.6667 9.91667C15.6667 10.3539 15.3122 10.7083 14.875 10.7083H10.125C9.68778 10.7083 9.33334 10.3539 9.33334 9.91667Z' />
      <path d='M10.125 12.2917C9.68778 12.2917 9.33334 12.6461 9.33334 13.0833C9.33334 13.5206 9.68778 13.875 10.125 13.875H13.2917C13.7289 13.875 14.0833 13.5206 14.0833 13.0833C14.0833 12.6461 13.7289 12.2917 13.2917 12.2917H10.125Z' />
      <path d='M3.00002 11.5C3.00002 6.25329 7.25332 2 12.5 2C17.7467 2 22 6.25329 22 11.5C22 16.7467 17.7467 21 12.5 21C10.7685 21 9.14316 20.5361 7.74395 19.7254L4.04204 20.9593C3.76344 21.0523 3.45632 20.9832 3.24418 20.7802C3.03206 20.5771 2.94981 20.2733 3.03048 19.9908L4.1572 16.0473C3.41927 14.6961 3.00002 13.146 3.00002 11.5ZM12.5 3.58333C8.12777 3.58333 4.58335 7.12775 4.58335 11.5C4.58335 12.9774 4.98729 14.358 5.69029 15.5402C5.80174 15.7275 5.83095 15.9527 5.77105 16.1623L4.96522 18.9827L7.59069 18.1076C7.81648 18.0322 8.06418 18.0626 8.26515 18.1901C9.48936 18.9668 10.9409 19.4167 12.5 19.4167C16.8722 19.4167 20.4167 15.8722 20.4167 11.5C20.4167 7.12775 16.8722 3.58333 12.5 3.58333Z' />
    </SvgIcon>
  );
}