import { ZenShell } from "@/components/ZenShell";
import { ChatClient } from "./ChatClient";

export default function ChatPage() {
  return (
    <ZenShell>
      <ChatClient />
    </ZenShell>
  );
}
