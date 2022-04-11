import {
  Color,
  Image,
  List,
} from "@raycast/api";
import React from "react";
import { format } from "timeago.js";

export type PullRequestOwnProps = {
  author: {
    avatarUrl: string;
  };
  body: string;
  createdAt: string;
  id: string;
  number: number;
  repository: {
    nameWithOwner: string;
    mergeCommitAllowed: boolean;
    rebaseMergeAllowed: boolean;
    squashMergeAllowed: boolean;
  };
  state: string;
  title: string;
  url: string;
};

export default function PullRequest(props: PullRequestOwnProps) {
  const { author, createdAt, id, number, repository, state, title, url } = props;

  return (
    <List.Item
      key={id}
      title={title}
      subtitle={`#${number} in ${repository.nameWithOwner}`}
      icon={{
        source: state === "MERGED" ? "pull-request-merge.png" : "pull-request.png",
        tintColor: state === "OPEN" ? Color.Green : state === "CLOSED" ? Color.Red : Color.Purple,
      }}
      accessoryTitle={format(createdAt)}
      accessoryIcon={{
        source: author.avatarUrl,
        mask: Image.Mask.Circle,
      }}
    />
  );
}
