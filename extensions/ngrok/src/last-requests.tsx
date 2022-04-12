import { List, popToRoot, showToast, Toast } from "@raycast/api";
import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import { NgrokClient } from "ngrok";

function onError(message = "failed", error?: Error) {
  popToRoot().then(() => showToast(Toast.Style.Failure, `${message}. Is Ngrok Running?`, error?.message ?? ""));
}

type State = {
  filter?: string,
  requests?: any[]
}

export default async function Command() {
  const api = new NgrokClient("http://127.0.0.1:4040");
  if (!api) return onError();

  const { requests } = await api.listRequests({});

  console.log(requests);

  return RequestList(requests);
}

function RequestList(requests){
  const [searchText, setSearchText] = useState<string>("");

  const fuseOpen = useMemo(
    () =>
      new Fuse(requests || [], {
        threshold: 0.2,
        ignoreLocation: true,
        keys: ["title", "number", "repository.nameWithOwner"],
      }),
    [requests]
  );

  const searchOpen = useCallback(
    (str: string) => {
      if (!str) {
        return requests.map((item, index: number) => ({
          item,
          score: 1,
          refIndex: index,
        }));
      }

      return fuseOpen.search(str);
    },
    [requests]
  );

  return <List
      isLoading={!requests?.length}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search requests by url"
    >
      {data && searchOpen(searchText)?.length > 0 && (
        <List.Section title="Open Tunnels" subtitle={"open tunnels"}>
          {searchOpen(searchText).map(({ item }) => (
            // <PRTemplate key={item.id} {...item} />
            <List.Item key={item.uri} title={item.uri}>
              poo
            </List.Item>
          ))}
        </List.Section>
      )}
      {/*{data && searchRecentlyClosed(searchText)?.length > 0 && (
        <List.Section
          title="Recently Closed"
          subtitle={plural(searchRecentlyClosed(searchText)?.length, "pull request")}
        >
          {searchRecentlyClosed(searchText).map(({ item }) => (
            <PRTemplate key={item.id} {...item} />
          ))}
        </List.Section>
      )}*/}
    </List>
}
