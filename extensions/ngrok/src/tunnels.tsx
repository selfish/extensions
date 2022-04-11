import { List, popToRoot, showToast, Toast } from "@raycast/api";
import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import ngrok, { Ngrok, NgrokClient } from "ngrok";

function onError(message = "failed", error?: Error) {
  popToRoot().then(() => showToast(Toast.Style.Failure, `${message}. Is Ngrok Running?`, error?.message ?? ""));
}

export default async function Command() {
  const [searchText, setSearchText] = useState<string>("");
  const api = new NgrokClient('http://127.0.0.1:4040');
  console.log(api)
  if (!api) return onError();
  const { tunnels } = await api.listTunnels();

  console.log(tunnels);

  console.log(JSON.stringify(tunnels))

  const fuseOpen = useMemo(
    () =>
      new Fuse(tunnels || [], {
        threshold: 0.2,
        ignoreLocation: true,
        keys: ["title", "number", "repository.nameWithOwner"],
      }),
    [tunnels]
  );

  const searchOpen = useCallback(
    (str: string) => {
      if (!str) {
        return tunnels.map((item, index: number) => ({
          item,
          score: 1,
          refIndex: index,
        }));
      }

      return fuseOpen.search(str);
    },
    [tunnels]
  );

  return (
    <List
      isLoading={!tunnels?.length}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search pull requests by name or number..."
    >
      {data && searchOpen(searchText)?.length > 0 && (
        <List.Section title="Open Tunnels" subtitle={"open tunnels"}>
          {searchOpen(searchText).map(({ item }) => (
            // <PRTemplate key={item.id} {...item} />
            <List.Item key={item.uri} title={item.uri}>poo</List.Item>
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
  );
}
