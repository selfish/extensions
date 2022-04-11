import { popToRoot, showHUD, showToast, Toast } from "@raycast/api";
import { NgrokClient } from "ngrok";

function onError(message = "failed", error?: Error) {
  popToRoot().then(() => showToast(Toast.Style.Failure, `${message}. Is Ngrok Running?`, error?.message ?? ""));
}

export default async function Command() {
  const api = new NgrokClient("http://127.0.0.1:4040");
  if (!api) return onError();

  const { requests } = await api.listRequests({ limit: 1 });

  const { id, tunnel_name } = requests[0];
  await api.replayRequest(id, tunnel_name);

  showHUD("Replay Sent!");
}
