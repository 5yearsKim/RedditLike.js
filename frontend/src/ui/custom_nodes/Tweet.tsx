import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { useTheme, Box, Skeleton } from "@mui/material";
// import { TwitterTweetEmbed } from 'react-twitter-embed';

type MTweetProps = {
  id: string;
};

export function Tweet({ id }: MTweetProps): JSX.Element {
  const tweetId = id.replace("tweet_", "");
  const theme = useTheme();

  const isDark = theme.palette.mode == "dark";

  return (
    <Box
      maxWidth='500px'
      margin='auto'
    >
      <TwitterTweetEmbed
        tweetId={tweetId}
        placeholder={<TweetLoading />}
        options={{ theme: isDark ? "dark" : "light" }}
      />
    </Box>
  );
}

function TweetLoading(): JSX.Element {
  return (
    <Box my={1}>
      <Skeleton
        width='100%'
        variant='rounded'
        animation='wave'
        sx={{
          maxWidth: "550px",
          minHeight: "400px",
        }}
      ></Skeleton>
    </Box>
  );
}
