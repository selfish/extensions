import { popToRoot, showHUD, showToast, Toast, open } from "@raycast/api";
import { NgrokClient } from "ngrok";

function onError(message = "failed", error?: Error) {
  popToRoot().then(() => showToast(Toast.Style.Failure, `${message}. Is Ngrok Running?`, error?.message ?? ""));
}

export default async function Command() {
  await open("http://127.0.0.1:4040");

  showHUD("Ngrok launched!");
}
